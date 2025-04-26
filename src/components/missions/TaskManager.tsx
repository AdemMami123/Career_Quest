import React, { useState, useEffect } from 'react';
import { MissionTask } from '../../types';
import { TaskService } from '../../lib/TaskService';
import { Check, X, Plus, Trash2, Edit, Save, ChevronUp, ChevronDown } from 'lucide-react';

interface TaskManagerProps {
  missionId: string;
  initialTasks?: MissionTask[];
  onTasksChange?: (tasks: MissionTask[]) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  missionId,
  initialTasks = [],
  onTasksChange,
}) => {
  const [tasks, setTasks] = useState<MissionTask[]>(initialTasks);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskDescription, setEditingTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks if not provided
  useEffect(() => {
    if (initialTasks.length === 0) {
      fetchTasks();
    }
  }, [missionId]);

  // Fetch tasks for the mission
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await TaskService.getTasksForMission(missionId);
      setTasks(fetchedTasks);
      if (onTasksChange) {
        onTasksChange(fetchedTasks);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new task
  const handleAddTask = async () => {
    if (!newTaskDescription.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const newTask = await TaskService.createTask(missionId, newTaskDescription);
      
      if (newTask) {
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        if (onTasksChange) {
          onTasksChange(updatedTasks);
        }
        setNewTaskDescription('');
      } else {
        setError('Failed to create task');
      }
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await TaskService.deleteTask(missionId, taskId);
      
      if (success) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        if (onTasksChange) {
          onTasksChange(updatedTasks);
        }
      } else {
        setError('Failed to delete task');
      }
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a task
  const handleStartEdit = (task: MissionTask) => {
    setEditingTaskId(task.id);
    setEditingTaskDescription(task.description);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskDescription('');
  };

  // Save task edit
  const handleSaveEdit = async () => {
    if (!editingTaskId || !editingTaskDescription.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const updatedTask = await TaskService.updateTask(
        missionId,
        editingTaskId,
        { description: editingTaskDescription }
      );
      
      if (updatedTask) {
        const updatedTasks = tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
        setTasks(updatedTasks);
        if (onTasksChange) {
          onTasksChange(updatedTasks);
        }
        handleCancelEdit();
      } else {
        setError('Failed to update task');
      }
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (taskId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await TaskService.toggleTaskCompletion(missionId, taskId);
      
      if (success) {
        // Refresh tasks to get updated completion status
        await fetchTasks();
      } else {
        setError('Failed to update task completion status');
      }
    } catch (err) {
      setError('Failed to update task completion status');
      console.error('Error toggling task completion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Move task up in order
  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    
    const newTasks = [...tasks];
    [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
    
    try {
      setIsLoading(true);
      setError(null);
      const success = await TaskService.reorderTasks(
        missionId,
        newTasks.map(task => task.id)
      );
      
      if (success) {
        setTasks(newTasks);
        if (onTasksChange) {
          onTasksChange(newTasks);
        }
      } else {
        setError('Failed to reorder tasks');
      }
    } catch (err) {
      setError('Failed to reorder tasks');
      console.error('Error reordering tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Move task down in order
  const handleMoveDown = async (index: number) => {
    if (index >= tasks.length - 1) return;
    
    const newTasks = [...tasks];
    [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
    
    try {
      setIsLoading(true);
      setError(null);
      const success = await TaskService.reorderTasks(
        missionId,
        newTasks.map(task => task.id)
      );
      
      if (success) {
        setTasks(newTasks);
        if (onTasksChange) {
          onTasksChange(newTasks);
        }
      } else {
        setError('Failed to reorder tasks');
      }
    } catch (err) {
      setError('Failed to reorder tasks');
      console.error('Error reordering tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Mission Tasks</h3>
      
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* Task List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-gray-500 italic">No tasks defined for this mission yet.</p>
        ) : (
          tasks.map((task, index) => (
            <div 
              key={task.id} 
              className={`flex items-center space-x-2 p-3 rounded-md border ${
                task.completed 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Task Content */}
              <div className="flex-1">
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editingTaskDescription}
                    onChange={(e) => setEditingTaskDescription(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                ) : (
                  <div className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.description}
                  </div>
                )}
              </div>

              {/* Task Actions */}
              <div className="flex items-center space-x-2">
                {editingTaskId === task.id ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="text-gold-600 hover:text-gold-800"
                      title="Save"
                      disabled={isLoading}
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-700"
                      title="Cancel"
                      disabled={isLoading}
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className={`${
                        task.completed
                          ? 'text-gold-600 hover:text-gold-800'
                          : 'text-gray-400 hover:text-gold-600'
                      }`}
                      title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      disabled={isLoading}
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => handleStartEdit(task)}
                      className="text-navy-600 hover:text-navy-800"
                      title="Edit"
                      disabled={isLoading}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-burgundy-600 hover:text-burgundy-800"
                      title="Delete"
                      disabled={isLoading}
                    >
                      <Trash2 size={18} />
                    </button>
                    {tasks.length > 1 && (
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleMoveUp(index)}
                          className={`text-gray-500 hover:text-gray-700 ${
                            index === 0 ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                          disabled={index === 0 || isLoading}
                          title="Move up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          className={`text-gray-500 hover:text-gray-700 ${
                            index === tasks.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                          disabled={index === tasks.length - 1 || isLoading}
                          title="Move down"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Add New Task */}
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Enter new task description..."
            className="flex-1 p-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
          <button
            onClick={handleAddTask}
            disabled={!newTaskDescription.trim() || isLoading}
            className={`p-2 rounded-md bg-gold text-white flex items-center space-x-1 ${
              !newTaskDescription.trim() || isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gold-dark'
            }`}
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;