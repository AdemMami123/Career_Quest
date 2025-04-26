import React, { useState, useEffect } from 'react';
import { Mission, MissionCategory, MissionDifficulty, MissionStatus } from '../../types';
import { MissionService } from '../../lib/MissionService';
import { Search, Filter, Plus, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDebounce } from '../../hooks/useDebounce';

interface MissionManagementProps {
  onCreateMission: () => void;
  onEditMission: (mission: Mission) => void;
  onDeleteMission: (missionId: string) => void;
}

const MissionManagement: React.FC<MissionManagementProps> = ({
  onCreateMission,
  onEditMission,
  onDeleteMission,
}) => {
  // State
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMissionMenu, setOpenMissionMenu] = useState<string | null>(null);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<MissionCategory | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<MissionDifficulty | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<MissionStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'points-high' | 'points-low'>('newest');
  
  // Debounce search to avoid too many re-renders
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  // Load missions from database
  useEffect(() => {
    fetchMissions();
  }, []);
  
  // Apply filters when anything changes
  useEffect(() => {
    applyFilters();
  }, [missions, debouncedSearch, categoryFilter, difficultyFilter, statusFilter, sortBy]);
  
  // Fetch all missions
  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedMissions = await MissionService.getMissions();
      setMissions(fetchedMissions);
    } catch (err) {
      setError('Failed to fetch missions. Please try again.');
      console.error('Error fetching missions:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply all filters and sorting
  const applyFilters = () => {
    let result = [...missions];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(mission => mission.category === categoryFilter);
    }
    
    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      result = result.filter(mission => mission.difficulty === difficultyFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(mission => mission.status === statusFilter);
    }
    
    // Apply search query
    if (debouncedSearch) {
      const lowerQuery = debouncedSearch.toLowerCase();
      result = result.filter(
        mission => 
          mission.title.toLowerCase().includes(lowerQuery) || 
          mission.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime();
        case 'oldest':
          return new Date(a.created_at || Date.now()).getTime() - new Date(b.created_at || Date.now()).getTime();
        case 'points-high':
          return b.points - a.points;
        case 'points-low':
          return a.points - b.points;
        default:
          return 0;
      }
    });
    
    setFilteredMissions(result);
  };
  
  // Handle mission menu toggle
  const handleToggleMissionMenu = (missionId: string | null, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setOpenMissionMenu(openMissionMenu === missionId ? null : missionId);
  };
  
  // Handle mission deletion with confirmation
  const handleDeleteMission = async (missionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Ask for confirmation
    const confirmed = window.confirm('Are you sure you want to delete this mission? This cannot be undone.');
    
    if (!confirmed) return;
    
    try {
      setIsLoading(true);
      const success = await MissionService.deleteMission(missionId);
      
      if (success) {
        // Update local state
        setMissions(missions.filter(mission => mission.id !== missionId));
        setOpenMissionMenu(null);
        onDeleteMission(missionId);
      } else {
        setError('Failed to delete mission. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while deleting the mission.');
      console.error('Error deleting mission:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle editing mission
  const handleEditMission = (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMissionMenu(null);
    onEditMission(mission);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setCategoryFilter('all');
    setDifficultyFilter('all');
    setStatusFilter('all');
    setSortBy('newest');
    setSearchQuery('');
  };
  
  // Get color for difficulty badge
  const getDifficultyColor = (difficulty: MissionDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'hard':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get color for status badge
  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle clicking outside to close the menu
  const handleClickOutside = () => {
    if (openMissionMenu) {
      setOpenMissionMenu(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Mission Management</h2>
        <Button 
          onClick={onCreateMission}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Create Mission
        </Button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search missions..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as MissionCategory | 'all')}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">All Categories</option>
              <option value="problem-solving">Problem Solving</option>
              <option value="leadership">Leadership</option>
              <option value="communication">Communication</option>
              <option value="technical">Technical</option>
              <option value="creativity">Creativity</option>
            </select>
          </div>
          
          {/* Difficulty Filter */}
          <div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as MissionDifficulty | 'all')}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MissionStatus | 'all')}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Sort options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'points-high' | 'points-low')}
              className="p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="points-high">Points (High to Low)</option>
              <option value="points-low">Points (Low to High)</option>
            </select>
          </div>
          
          {/* Filter indicators and reset button */}
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">
              {filteredMissions.length} {filteredMissions.length === 1 ? 'mission' : 'missions'} found
            </div>
            
            {/* Only show reset button if any filters are applied */}
            {(categoryFilter !== 'all' || difficultyFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm text-burgundy hover:text-burgundy-dark hover:underline focus:outline-none"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Missions List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!isLoading && filteredMissions.length === 0 && (
          <div className="text-center py-20">
            <Filter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No missions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {missions.length === 0
                ? "You haven't created any missions yet."
                : "No missions match your current filters."}
            </p>
            {missions.length === 0 ? (
              <div className="mt-6">
                <Button onClick={onCreateMission}>
                  <Plus size={16} className="mr-1" /> Create new mission
                </Button>
              </div>
            ) : (
              <button
                onClick={resetFilters}
                className="mt-2 text-burgundy hover:text-burgundy-dark hover:underline focus:outline-none"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
        
        {!isLoading && filteredMissions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mission
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" onClick={handleClickOutside}>
                {filteredMissions.map(mission => (
                  <tr 
                    key={mission.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onEditMission(mission)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{mission.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{mission.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {mission.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(mission.difficulty)}`}>
                        {mission.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(mission.status)}`}>
                        {mission.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mission.points} XP
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={(e) => handleToggleMissionMenu(mission.id, e)}
                        className="text-navy hover:text-navy-dark"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      
                      {openMissionMenu === mission.id && (
                        <div className="absolute right-8 top-5 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-left text-navy hover:bg-navy-50"
                            onClick={(e) => handleEditMission(mission, e)}
                          >
                            <Edit size={16} className="mr-2" /> Edit Mission
                          </button>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-left text-burgundy hover:bg-burgundy-50"
                            onClick={(e) => handleDeleteMission(mission.id, e)}
                          >
                            <Trash2 size={16} className="mr-2" /> Delete Mission
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionManagement;