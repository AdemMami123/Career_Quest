import { supabase } from './supabase';
import { MissionService } from './MissionService';
import { MissionCategory, MissionDifficulty } from '../types';

// Function to test basic Supabase connection
export async function testSupabaseConnection() {
  try {
    // Simple query to check if Supabase is accessible
    const { error } = await supabase
      .from('missions')
      .select('count(*)', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('❌ Error testing Supabase connection:', err);
    return false;
  }
}

// Function to create a test mission in Supabase
export async function createTestMission() {
  try {
    // A simple mission for testing purposes
    const testMission = {
      title: 'Test Mission',
      description: 'This is a test mission to verify Supabase integration',
      category: 'problem-solving' as MissionCategory,
      difficulty: 'easy' as MissionDifficulty,
      points: 50,
      timeLimit: 300, // 5 minutes
      completionCriteria: 'Complete all test tasks',
      requiredSkills: [
        { name: 'Testing', category: 'technical' as MissionCategory }
      ],
      tasks: []
    };

    // Create the mission using MissionService
    const createdMission = await MissionService.createMission(testMission);
    
    if (createdMission && createdMission.id) {
      console.log('✅ Test mission created successfully!', createdMission);
      return createdMission;
    } else {
      console.error('❌ Failed to create test mission');
      return null;
    }
  } catch (err) {
    console.error('❌ Error creating test mission:', err);
    return null;
  }
}

// Function to verify all required tables exist
export async function verifyDatabaseTables() {
  const requiredTables = ['missions', 'mission_tasks', 'mission_skills', 'badges'];
  const results: Record<string, boolean> = {};
  
  try {
    for (const table of requiredTables) {
      // Check if table exists by attempting to get its structure
      const { error } = await supabase
        .from(table)
        .select('count(*)', { count: 'exact', head: true });
      
      results[table] = !error;
      
      if (error) {
        console.error(`❌ Table "${table}" check failed:`, error.message);
      } else {
        console.log(`✅ Table "${table}" exists and is accessible`);
      }
    }
    
    return results;
  } catch (err) {
    console.error('❌ Error verifying database tables:', err);
    return results;
  }
}