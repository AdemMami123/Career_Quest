import { v4 as uuidv4 } from 'uuid';
import { MissionTask } from '../types';
import { supabase } from './supabase';

export class TaskService {
  // Create a new task for a mission
  static async createTask(missionId: string, taskDescription: string): Promise<MissionTask | null> {
    try {
      // First, determine the current max order index for this mission
      const { data: existingTasks, error: fetchError } = await supabase
        .from('mission_tasks')
        .select('order_index')
        .eq('mission_id', missionId)
        .order('order_index', { ascending: false })
        .limit(1);
      
      if (fetchError) throw new Error(fetchError.message);
      
      const nextOrderIndex = existingTasks && existingTasks.length > 0 
        ? existingTasks[0].order_index + 1 
        : 0;
      
      // Create the new task in database
      const { data, error } = await supabase
        .from('mission_tasks')
        .insert({
          id: uuidv4(),
          mission_id: missionId,
          description: taskDescription,
          completed: false,
          order_index: nextOrderIndex
        })
        .select();
      
      if (error) throw new Error(error.message);
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after creating task');
      }
      
      // Return task in the format expected by the application
      return {
        id: data[0].id,
        description: data[0].description,
        completed: data[0].completed
      };
    } catch (error) {
      console.error(`Error creating task for mission ${missionId}:`, error);
      return null;
    }
  }

  // Update a task
  static async updateTask(
    missionId: string, 
    taskId: string, 
    updates: Partial<Omit<MissionTask, 'id'>>
  ): Promise<MissionTask | null> {
    try {
      // Update the task in database
      const { data, error } = await supabase
        .from('mission_tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('mission_id', missionId) // Extra safety check
        .select(); // Add .select() to retrieve the updated record
      
      if (error) throw new Error(error.message);
      
      if (!data || data.length === 0) {
        throw new Error(`Task ${taskId} not found in mission ${missionId}`);
      }
      
      // Return task in the format expected by the application
      return {
        id: data[0].id,
        description: data[0].description,
        completed: data[0].completed
      };
    } catch (error) {
      console.error(`Error updating task ${taskId} for mission ${missionId}:`, error);
      return null;
    }
  }

  // Delete a task
  static async deleteTask(missionId: string, taskId: string): Promise<boolean> {
    try {
      // Delete the task from database
      const { error } = await supabase
        .from('mission_tasks')
        .delete()
        .eq('id', taskId)
        .eq('mission_id', missionId); // Extra safety check
      
      if (error) throw new Error(error.message);
      
      // Re-index remaining tasks to keep order_index continuous
      await this.reindexTasksForMission(missionId);
      
      return true;
    } catch (error) {
      console.error(`Error deleting task ${taskId} from mission ${missionId}:`, error);
      return false;
    }
  }

  // Reorder tasks within a mission
  static async reorderTasks(missionId: string, taskIds: string[]): Promise<boolean> {
    try {
      // Verify all tasks exist and belong to the mission
      const { data: existingTasks, error: fetchError } = await supabase
        .from('mission_tasks')
        .select('id')
        .eq('mission_id', missionId);
      
      if (fetchError) throw new Error(fetchError.message);
      
      if (!existingTasks || existingTasks.length !== taskIds.length) {
        throw new Error('Task count mismatch for reordering');
      }
      
      const existingTaskIds = new Set(existingTasks.map(task => task.id));
      const allTasksExist = taskIds.every(id => existingTaskIds.has(id));
      
      if (!allTasksExist) {
        throw new Error('Invalid task IDs for reordering');
      }
      
      // Update the order of each task using a transaction
      const updates = taskIds.map((id, index) => ({
        id,
        order_index: index
      }));
      
      // Supabase does not support transactions directly in the client,
      // so we'll have to update each task individually
      for (const update of updates) {
        const { error } = await supabase
          .from('mission_tasks')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
          .eq('mission_id', missionId); // Extra safety check
        
        if (error) throw new Error(error.message);
      }
      
      return true;
    } catch (error) {
      console.error(`Error reordering tasks for mission ${missionId}:`, error);
      return false;
    }
  }

  // Get all tasks for a mission
  static async getTasksForMission(missionId: string): Promise<MissionTask[]> {
    try {
      // Get tasks from database, ordered by order_index
      const { data, error } = await supabase
        .from('mission_tasks')
        .select('*')
        .eq('mission_id', missionId)
        .order('order_index');
      
      if (error) throw new Error(error.message);
      
      if (!data) return [];
      
      // Convert to the format expected by the application
      return data.map(task => ({
        id: task.id,
        description: task.description,
        completed: task.completed
      }));
    } catch (error) {
      console.error(`Error getting tasks for mission ${missionId}:`, error);
      return [];
    }
  }

  // Toggle task completion status
  static async toggleTaskCompletion(missionId: string, taskId: string): Promise<boolean> {
    try {
      // First, get the current completion status
      const { data: currentTask, error: fetchError } = await supabase
        .from('mission_tasks')
        .select('completed')
        .eq('id', taskId)
        .eq('mission_id', missionId) // Extra safety check
        .single();
      
      if (fetchError) throw new Error(fetchError.message);
      
      if (!currentTask) {
        throw new Error(`Task ${taskId} not found in mission ${missionId}`);
      }
      
      // Toggle the completion status
      const { error: updateError } = await supabase
        .from('mission_tasks')
        .update({ completed: !currentTask.completed })
        .eq('id', taskId)
        .eq('mission_id', missionId); // Extra safety check
      
      if (updateError) throw new Error(updateError.message);
      
      // Check if all tasks are now completed
      const { data: tasks, error: allTasksError } = await supabase
        .from('mission_tasks')
        .select('completed')
        .eq('mission_id', missionId);
      
      if (allTasksError) throw new Error(allTasksError.message);
      
      if (tasks) {
        const allTasksCompleted = tasks.every(task => task.completed);
        
        // Update mission status based on task completion
        const status = allTasksCompleted ? 'completed' : 'in-progress';
        
        // Only update if there's a change
        if ((allTasksCompleted && status === 'completed') || 
            (!allTasksCompleted && status === 'in-progress')) {
            
          const { error: missionUpdateError } = await supabase
            .from('missions')
            .update({ status })
            .eq('id', missionId);
          
          if (missionUpdateError) {
            console.error(`Error updating mission status: ${missionUpdateError.message}`);
            // We don't throw here, as the task toggle itself was successful
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error toggling completion for task ${taskId} in mission ${missionId}:`, error);
      return false;
    }
  }

  // Helper method to reindex tasks after deletion
  private static async reindexTasksForMission(missionId: string): Promise<void> {
    try {
      // Get all tasks in current order
      const { data, error } = await supabase
        .from('mission_tasks')
        .select('id, order_index')
        .eq('mission_id', missionId)
        .order('order_index');
      
      if (error) throw new Error(error.message);
      
      if (!data || data.length === 0) return;
      
      // Update indices to be continuous starting from 0
      for (let i = 0; i < data.length; i++) {
        if (data[i].order_index !== i) {
          const { error: updateError } = await supabase
            .from('mission_tasks')
            .update({ order_index: i })
            .eq('id', data[i].id)
            .eq('mission_id', missionId); // Extra safety check
          
          if (updateError) throw new Error(updateError.message);
        }
      }
    } catch (error) {
      console.error(`Error reindexing tasks for mission ${missionId}:`, error);
      throw error;
    }
  }
}