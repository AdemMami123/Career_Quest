import { v4 as uuidv4 } from 'uuid';
import { Mission, MissionCategory, MissionDifficulty, MissionStatus, Badge, BadgeRarity } from '../types';
import { supabase } from './supabase';

// Database table types for proper typing with Supabase responses
interface DbMission {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  time_limit: number | null;
  status: string;
  completion_criteria: string;
  badge_reward_id: string | null; // Changed back to match database schema
  created_at: string;
  created_by: string;
  badge_reward?: DbBadge | null;
}

interface DbBadge {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  rarity: string;
  category: string;
}

interface DbMissionTask {
  id: string;
  mission_id: string;
  description: string;
  completed: boolean;
  order_index: number;
}

interface DbMissionSkill {
  mission_id: string;
  skill_name: string;
  skill_category: string;
}

export class MissionService {
  // Create a new mission
  static async createMission(missionData: Omit<Mission, 'id' | 'status' | 'tasks'>): Promise<Mission> {
    try {
      // Log mission data for debugging
      console.log('Creating mission with data:', JSON.stringify(missionData, null, 2));
      
      // First, let's try to get the missions table structure
      console.log('Fetching table structure...');
      try {
        const { data: tableStructure, error: structureError } = await supabase
          .from('missions')
          .select('*')
          .limit(1);
          
        if (!structureError && tableStructure) {
          console.log('Available columns in missions table:', tableStructure.length > 0 ? 
            Object.keys(tableStructure[0]) : 
            'No records found, but table exists');
        } else {
          console.log('Error fetching table structure or table may not exist:', structureError);
        }
      } catch (e) {
        console.log('Error when trying to check table structure:', e);
      }
      
      console.log('Attempting mission creation with integer ID...');
      
      // Instead of using a UUID, let the database generate the ID
      // Create the mission without specifying an ID
      const missionToCreate = {
        title: missionData.title || 'Untitled Mission',
        description: missionData.description || '',
        category: missionData.category || 'technical',
        difficulty: missionData.difficulty || 'medium',
        points: missionData.points || 100,
        status: 'not-started',
        completion_criteria: missionData.completionCriteria || '',
        created_by: missionData.created_by || 'anonymous'
      };
      
      console.log('Sending to database:', missionToCreate);
      
      const { data, error } = await supabase
        .from('missions')
        .insert(missionToCreate)
        .select();

      if (error) {
        console.error('Error details from Supabase:', error);
        throw new Error(`Failed to create mission: ${error.message}`);
      }

      console.log('Mission record created successfully:', data);
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from mission creation');
      }
      
      const createdMission = data[0];
      
      // Return a proper mission object to the application
      return {
        id: String(createdMission.id), // Convert ID to string in case it's a number
        title: createdMission.title || missionData.title || 'Untitled Mission',
        description: createdMission.description || missionData.description || '',
        category: (createdMission.category || missionData.category || 'technical') as MissionCategory,
        difficulty: (createdMission.difficulty || missionData.difficulty || 'medium') as MissionDifficulty,
        points: createdMission.points || missionData.points || 100,
        status: (createdMission.status || 'not-started') as MissionStatus,
        timeLimit: createdMission.time_limit || missionData.timeLimit || 0,
        tasks: [],
        requiredSkills: missionData.requiredSkills || [],
        completionCriteria: createdMission.completion_criteria || missionData.completionCriteria || '',
        created_by: createdMission.created_by || missionData.created_by || 'anonymous',
        created_at: createdMission.created_at
      };
    } catch (error) {
      console.error('Error creating mission:', error);
      throw error instanceof Error 
        ? error 
        : new Error(`Failed to create mission: ${String(error)}`);
    }
  }

  // Get a mission by ID
  static async getMissionById(id: string): Promise<Mission | null> {
    try {
      // Fetch the mission data
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select(`
          *,
          badge_reward:badge_reward_id(*)
        `)
        .eq('id', id)
        .single();

      if (missionError) {
        throw new Error(`Failed to fetch mission: ${missionError.message}`);
      }

      if (!missionData) {
        return null;
      }

      // Fetch the mission tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('mission_tasks')
        .select('*')
        .eq('mission_id', id)
        .order('order_index');

      if (tasksError) {
        throw new Error(`Failed to fetch mission tasks: ${tasksError.message}`);
      }

      // Fetch the mission skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('mission_skills')
        .select('*')
        .eq('mission_id', id);

      if (skillsError) {
        throw new Error(`Failed to fetch mission skills: ${skillsError.message}`);
      }

      // Map the mission data to the application format
      const mission = this.mapDbMissionToAppMission(
        missionData as DbMission, 
        (tasksData || []) as DbMissionTask[], 
        (skillsData || []) as DbMissionSkill[]
      );
      return mission;
    } catch (error) {
      console.error(`Error getting mission ${id}:`, error);
      return null;
    }
  }

  // Get all missions
  static async getMissions(): Promise<Mission[]> {
    try {
      // Fetch all missions with their badge rewards
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select(`
          *,
          badge_reward:badge_reward_id(*)
        `)
        .order('created_at', { ascending: false });

      if (missionsError) {
        throw new Error(`Failed to fetch missions: ${missionsError.message}`);
      }

      if (!missionsData || missionsData.length === 0) {
        return [];
      }

      // For each mission, fetch its tasks and skills
      const missions: Mission[] = [];
      for (const missionData of missionsData) {
        // Fetch tasks
        const { data: tasksData } = await supabase
          .from('mission_tasks')
          .select('*')
          .eq('mission_id', missionData.id)
          .order('order_index');

        // Fetch skills
        const { data: skillsData } = await supabase
          .from('mission_skills')
          .select('*')
          .eq('mission_id', missionData.id);

        // Map to application format and add to results
        missions.push(this.mapDbMissionToAppMission(
          missionData as DbMission, 
          (tasksData || []) as DbMissionTask[], 
          (skillsData || []) as DbMissionSkill[]
        ));
      }

      return missions;
    } catch (error) {
      console.error('Error getting missions:', error);
      return [];
    }
  }

  // Update a mission
  static async updateMission(id: string, updates: Partial<Mission>): Promise<Mission | null> {
    try {
      // Prepare the database updates
      const dbUpdates: Record<string, string | number | boolean | null> = {};

      // Map the standard fields
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
      if (updates.points !== undefined) dbUpdates.points = updates.points;
      if (updates.timeLimit !== undefined) dbUpdates.time_limit = updates.timeLimit;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.completionCriteria !== undefined) {
        dbUpdates.completion_criteria = updates.completionCriteria;
      }

      // Handle badge reward update
      if (updates.badgeReward !== undefined) {
        dbUpdates.badge_reward_id = updates.badgeReward ? updates.badgeReward.id : null;
      }

      // Update the mission record if there are standard fields to update
      if (Object.keys(dbUpdates).length > 0) {
        const { error } = await supabase
          .from('missions')
          .update(dbUpdates)
          .eq('id', id);

        if (error) {
          throw new Error(`Failed to update mission: ${error.message}`);
        }
      }

      // Handle tasks update if provided
      if (updates.tasks !== undefined) {
        // First delete existing tasks
        const { error: deleteTasksError } = await supabase
          .from('mission_tasks')
          .delete()
          .eq('mission_id', id);

        if (deleteTasksError) {
          throw new Error(`Failed to delete existing tasks: ${deleteTasksError.message}`);
        }

        // Then insert the new tasks with proper order_index
        if (updates.tasks.length > 0) {
          const tasksToInsert = updates.tasks.map((task, index) => ({
            id: task.id || uuidv4(),
            mission_id: id,
            description: task.description,
            completed: task.completed,
            order_index: index
          }));

          const { error: insertTasksError } = await supabase
            .from('mission_tasks')
            .insert(tasksToInsert);

          if (insertTasksError) {
            throw new Error(`Failed to insert new tasks: ${insertTasksError.message}`);
          }
        }
      }

      // Handle required skills update if provided
      if (updates.requiredSkills !== undefined) {
        // First delete existing skills
        const { error: deleteSkillsError } = await supabase
          .from('mission_skills')
          .delete()
          .eq('mission_id', id);

        if (deleteSkillsError) {
          throw new Error(`Failed to delete existing skills: ${deleteSkillsError.message}`);
        }

        // Then insert the new skills
        if (updates.requiredSkills.length > 0) {
          const skillsToInsert = updates.requiredSkills.map(skill => ({
            mission_id: id,
            skill_name: skill.name,
            skill_category: skill.category
          }));

          const { error: insertSkillsError } = await supabase
            .from('mission_skills')
            .insert(skillsToInsert);

          if (insertSkillsError) {
            throw new Error(`Failed to insert new skills: ${insertSkillsError.message}`);
          }
        }
      }

      // Fetch and return the updated mission
      return await this.getMissionById(id);
    } catch (error) {
      console.error(`Error updating mission ${id}:`, error);
      return null;
    }
  }

  // Delete a mission
  static async deleteMission(id: string): Promise<boolean> {
    try {
      // Due to cascading delete in our database setup, we only need to delete the mission
      // and all related tasks and skills will be deleted automatically
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete mission: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error(`Error deleting mission ${id}:`, error);
      return false;
    }
  }

  // Get available badges for mission rewards
  static async getAvailableBadges(): Promise<Badge[]> {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('name');

      if (error) {
        throw new Error(`Failed to fetch badges: ${error.message}`);
      }

      if (!data) return [];

      return (data as DbBadge[]).map((badge) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        imageUrl: badge.image_url || '',
        rarity: badge.rarity as BadgeRarity, // Ensure it's properly cast to BadgeRarity type
        category: badge.category as MissionCategory // Ensure it's properly cast to MissionCategory type
      }));
    } catch (error) {
      console.error('Error getting available badges:', error);
      return [];
    }
  }

  // Get mission statistics for HR dashboard
  static async getMissionStatistics(): Promise<{
    totalMissions: number;
    completedMissions: number;
    inProgressMissions: number;
    notStartedMissions: number;
    averageCompletionRate: number;
  }> {
    try {
      // Fetch all missions to calculate statistics
      interface MissionStatusData {
        status: string;
      }
      
      const { data, error } = await supabase
        .from('missions')
        .select('status');

      if (error) {
        throw new Error(`Failed to fetch mission statistics: ${error.message}`);
      }

      if (!data) {
        return {
          totalMissions: 0,
          completedMissions: 0,
          inProgressMissions: 0,
          notStartedMissions: 0,
          averageCompletionRate: 0
        };
      }

      // Calculate statistics with proper type casting
      const missionData = data as MissionStatusData[];
      const totalMissions = missionData.length;
      const completedMissions = missionData.filter(m => m.status === 'completed').length;
      const inProgressMissions = missionData.filter(m => m.status === 'in-progress').length;
      const notStartedMissions = missionData.filter(m => m.status === 'not-started').length;
      const averageCompletionRate = totalMissions > 0 
        ? (completedMissions / totalMissions) * 100 
        : 0;

      return {
        totalMissions,
        completedMissions,
        inProgressMissions,
        notStartedMissions,
        averageCompletionRate
      };
    } catch (error) {
      console.error('Error getting mission statistics:', error);
      return {
        totalMissions: 0,
        completedMissions: 0,
        inProgressMissions: 0,
        notStartedMissions: 0,
        averageCompletionRate: 0
      };
    }
  }

  // Map database mission format to application mission format
  private static mapDbMissionToAppMission(
    dbMission: DbMission, 
    tasks: DbMissionTask[] | null = [], 
    skills: DbMissionSkill[] | null = []
  ): Mission {
    // Map badge if present
    let badgeReward: Badge | undefined = undefined;
    if (dbMission.badge_reward) {
      badgeReward = {
        id: dbMission.badge_reward.id,
        name: dbMission.badge_reward.name,
        description: dbMission.badge_reward.description,
        imageUrl: dbMission.badge_reward.image_url || '',
        rarity: dbMission.badge_reward.rarity as BadgeRarity,
        category: dbMission.badge_reward.category as MissionCategory
      };
    }

    // Map tasks with more explicit type handling
    const mappedTasks = tasks ? tasks.map((task: DbMissionTask) => ({
      id: task.id,
      description: task.description,
      completed: task.completed
    })) : [];

    // Map skills with more explicit type handling
    const mappedSkills = skills ? skills.map((skill: DbMissionSkill) => ({
      name: skill.skill_name,
      category: skill.skill_category as MissionCategory
    })) : [];

    // Return the mission in application format
    return {
      id: dbMission.id,
      title: dbMission.title,
      description: dbMission.description,
      category: dbMission.category as MissionCategory,
      difficulty: dbMission.difficulty as MissionDifficulty,
      points: dbMission.points,
      timeLimit: dbMission.time_limit || 0,
      status: dbMission.status as MissionStatus,
      tasks: mappedTasks,
      requiredSkills: mappedSkills,
      completionCriteria: dbMission.completion_criteria,
      badgeReward: badgeReward,
      created_at: dbMission.created_at,
      created_by: dbMission.created_by
    };
  }
}