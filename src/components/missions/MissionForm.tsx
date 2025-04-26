import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Mission, MissionCategory, MissionDifficulty, MissionTask, Badge } from '../../types';
import { Plus, X, AlertCircle, Check, Loader } from 'lucide-react';
import TaskManager from './TaskManager';
import { MissionService } from '../../lib/MissionService';
import { useAuth } from '../../context/AuthContext';

interface MissionFormProps {
  initialMission?: Partial<Mission>;
  onSubmit: (mission: Partial<Mission>) => void;
  onCancel: () => void;
}

const MissionForm: React.FC<MissionFormProps> = ({
  initialMission,
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth();
  
  // Form state
  const [mission, setMission] = useState<Partial<Mission>>(
    initialMission || {
      title: '',
      description: '',
      category: 'technical' as MissionCategory,
      difficulty: 'medium' as MissionDifficulty,
      points: 100,
      status: 'not-started',
      tasks: [],
      requiredSkills: [],
      completionCriteria: '',
      created_by: user?.id // Add the creator ID
    }
  );
  
  // UI state
  const [activeTab, setActiveTab] = useState<'details'|'tasks'|'skills'|'rewards'>('details');
  const [newSkill, setNewSkill] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formTouched, setFormTouched] = useState<boolean>(false);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  
  // Load available badges for rewards
  useEffect(() => {
    const loadBadges = async () => {
      try {
        setIsLoading(true);
        const badges = await MissionService.getAvailableBadges();
        setAvailableBadges(badges);
      } catch (error) {
        console.error('Error loading badges:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBadges();
  }, []);
  
  // Validate form on change
  useEffect(() => {
    if (formTouched) {
      validateForm();
    }
  }, [mission, formTouched]);
  
  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!mission.title) {
      newErrors.title = 'Title is required';
    } else if (mission.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!mission.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!mission.points || mission.points <= 0) {
      newErrors.points = 'Points must be greater than 0';
    }
    
    if (!mission.completionCriteria) {
      newErrors.completionCriteria = 'Completion criteria is required';
    }
    
    if (mission.tasks && mission.tasks.length === 0 && mission.id) {
      newErrors.tasks = 'At least one task is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (!formTouched) {
      setFormTouched(true);
    }
    
    // Special handling for points which should be a number
    if (name === 'points') {
      setMission({ ...mission, [name]: parseInt(value) || 0 });
    } else {
      setMission({ ...mission, [name]: value });
    }
  };

  const handleTasksChange = (tasks: MissionTask[]) => {
    setMission({ ...mission, tasks });
    
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() === '') return;
    
    const skill = {
      name: newSkill,
      category: mission.category as MissionCategory,
    };
    
    setMission({
      ...mission,
      requiredSkills: [...(mission.requiredSkills || []), skill],
    });
    
    setNewSkill('');
    
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setMission({
      ...mission,
      requiredSkills: (mission.requiredSkills || []).filter(
        skill => skill.name !== skillName
      ),
    });
    
    if (!formTouched) {
      setFormTouched(true);
    }
  };
  
  const handleSelectBadge = (badge: Badge | null) => {
    setMission({
      ...mission,
      badgeReward: badge,
    });
    
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    
    // Validate the form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementsByName(firstErrorField)[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Ensure user ID is set for new missions
      if (!mission.created_by && user) {
        mission.created_by = user.id;
      }
      
      // Submit the form
      await onSubmit(mission);
    } catch (error) {
      console.error('Error submitting mission:', error);
      setErrors({ form: 'An error occurred while saving the mission. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cream rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-navy">
          {initialMission?.id ? 'Edit Mission' : 'Create New Mission'}
        </h2>
        <button 
          className="text-charcoal hover:text-navy"
          onClick={onCancel}
          type="button"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Form error */}
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6 flex items-start">
          <AlertCircle className="text-red-500 mr-2 mt-0.5" size={18} />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex flex-wrap -mb-px">
          <button 
            type="button"
            className={`mr-4 py-2 px-4 font-medium ${
              activeTab === 'details' 
                ? 'text-gold border-b-2 border-gold' 
                : 'text-charcoal-500 hover:text-navy'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Basic Info
          </button>
          
          {mission.id && (
            <button 
              type="button"
              className={`mr-4 py-2 px-4 font-medium ${
                activeTab === 'tasks' 
                  ? 'text-gold border-b-2 border-gold' 
                  : 'text-charcoal-500 hover:text-navy'
              }`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
          )}
          
          <button 
            type="button"
            className={`mr-4 py-2 px-4 font-medium ${
              activeTab === 'skills' 
                ? 'text-gold border-b-2 border-gold' 
                : 'text-charcoal-500 hover:text-navy'
            }`}
            onClick={() => setActiveTab('skills')}
          >
            Required Skills
          </button>
          
          <button 
            type="button"
            className={`mr-4 py-2 px-4 font-medium ${
              activeTab === 'rewards' 
                ? 'text-gold border-b-2 border-gold' 
                : 'text-charcoal-500 hover:text-navy'
            }`}
            onClick={() => setActiveTab('rewards')}
          >
            Rewards
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={mission.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.title 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-gold'
                  } rounded-md focus:outline-none focus:ring-2`}
                  required
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">
                  Points <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="points"
                  value={mission.points}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.points
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-gold'
                  } rounded-md focus:outline-none focus:ring-2`}
                  min="1"
                  required
                />
                {errors.points && (
                  <p className="mt-1 text-sm text-red-600">{errors.points}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={mission.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="problem-solving">Problem Solving</option>
                  <option value="leadership">Leadership</option>
                  <option value="communication">Communication</option>
                  <option value="technical">Technical</option>
                  <option value="creativity">Creativity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <select
                  name="difficulty"
                  value={mission.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={mission.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border ${
                    errors.description
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-gold'
                  } rounded-md focus:outline-none focus:ring-2`}
                  required
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal-700 mb-1">
                  Completion Criteria <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="completionCriteria"
                  value={mission.completionCriteria}
                  onChange={handleChange}
                  rows={2}
                  className={`w-full px-3 py-2 border ${
                    errors.completionCriteria
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-gold'
                  } rounded-md focus:outline-none focus:ring-2`}
                  required
                ></textarea>
                {errors.completionCriteria && (
                  <p className="mt-1 text-sm text-red-600">{errors.completionCriteria}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">
                  Time Limit (minutes, optional)
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  value={mission.timeLimit ? mission.timeLimit / 60 : ''}
                  onChange={(e) => {
                    const minutes = parseInt(e.target.value) || 0;
                    setMission({
                      ...mission,
                      timeLimit: minutes > 0 ? minutes * 60 : undefined,
                    });
                    if (!formTouched) setFormTouched(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && mission.id && (
          <div>
            <TaskManager 
              missionId={mission.id}
              initialTasks={mission.tasks || []}
              onTasksChange={handleTasksChange}
            />
            {errors.tasks && (
              <p className="mt-2 text-sm text-red-600">{errors.tasks}</p>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-3">
              Required Skills
            </label>
            
            <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
              {(mission.requiredSkills || []).length === 0 ? (
                <span className="text-sm text-gray-500">No skills added yet</span>
              ) : (
                (mission.requiredSkills || []).map((skill) => (
                  <div 
                    key={skill.name}
                    className="flex items-center bg-navy-50 px-3 py-1 rounded-full"
                  >
                    <span className="text-navy">{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="ml-2 text-charcoal-500 hover:text-burgundy"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Enter a new skill..."
              />
              <button
                type="button"
                onClick={handleAddSkill}
                disabled={!newSkill.trim()}
                className={`flex items-center px-4 py-2 bg-gold text-white rounded-r-md ${
                  !newSkill.trim() ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gold-dark'
                }`}
              >
                <Plus size={18} />
                <span className="ml-1">Add</span>
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'rewards' && (
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-3">
              Badge Reward
            </label>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader size={24} className="animate-spin text-gold" />
                <span className="ml-2 text-charcoal-500">Loading badges...</span>
              </div>
            ) : (
              <>
                {/* Selected Badge */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Badge:
                  </h3>
                  
                  {mission.badgeReward ? (
                    <div className="flex items-center p-3 border border-gold rounded-md bg-gold-50">
                      <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white">
                        {mission.badgeReward.name?.charAt(0) || '?'}
                      </div>
                      <div className="ml-3 flex-grow">
                        <h4 className="font-medium">{mission.badgeReward.name}</h4>
                        <p className="text-xs text-gray-500">{mission.badgeReward.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectBadge(null)}
                        className="text-burgundy hover:text-burgundy-dark"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No badge selected</p>
                  )}
                </div>
                
                {/* Available Badges */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Available Badges:
                  </h3>
                  
                  {availableBadges.length === 0 ? (
                    <p className="text-sm text-gray-500">No badges available</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableBadges.map(badge => (
                        <button
                          key={badge.id}
                          type="button"
                          onClick={() => handleSelectBadge(badge)}
                          disabled={mission.badgeReward?.id === badge.id}
                          className={`flex items-center p-3 border rounded-md text-left ${
                            mission.badgeReward?.id === badge.id
                              ? 'border-gold bg-gold-50'
                              : 'border-gray-200 hover:border-gold hover:bg-gold-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                            badge.rarity === 'legendary' ? 'bg-purple-600' :
                            badge.rarity === 'epic' ? 'bg-orange-600' :
                            badge.rarity === 'rare' ? 'bg-blue-600' :
                            badge.rarity === 'uncommon' ? 'bg-green-600' :
                            'bg-gray-600'
                          }`}>
                            {badge.name.charAt(0)}
                          </div>
                          <div className="ml-2 flex-grow">
                            <h4 className="text-sm font-medium">{badge.name}</h4>
                            <div className="flex items-center mt-1">
                              <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                                badge.rarity === 'legendary' ? 'bg-purple-100 text-purple-800' :
                                badge.rarity === 'epic' ? 'bg-orange-100 text-orange-800' :
                                badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                                badge.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {badge.rarity}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">{badge.category}</span>
                            </div>
                          </div>
                          {mission.badgeReward?.id === badge.id && (
                            <Check size={16} className="text-gold ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Form Buttons */}
        <div className="flex justify-end space-x-4 pt-6 mt-8 border-t border-gray-200">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-navy text-navy hover:bg-navy-50"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gold hover:bg-gold-dark text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
                {initialMission?.id ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              initialMission?.id ? 'Update Mission' : 'Create Mission'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MissionForm;