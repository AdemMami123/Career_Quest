import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, CandidateAnalytics, Mission } from '../../types';
import { Button } from '../ui/Button';
import { Users, Briefcase, AlignStartVertical } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import MissionManagement from '../missions/MissionManagement';
import { MissionService } from '../../lib/MissionService';

interface HRDashboardProps {
  user: User;
  candidateAnalytics: CandidateAnalytics[];
  missions: Mission[];
  onViewCandidate: (candidateId: string) => void;
  onCreateMission: () => void;
  onEditMission: (mission: Mission) => void;
  onDeleteMission: (missionId: string) => void;
}

const HRDashboard: React.FC<HRDashboardProps> = ({
  user,
  candidateAnalytics,
  missions,
  onViewCandidate,
  onCreateMission,
  onEditMission,
  onDeleteMission,
}) => {
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'missions'>('overview');
  const [stats, setStats] = useState({
    totalMissions: 0,
    completedMissions: 0,
    inProgressMissions: 0,
    notStartedMissions: 0,
    averageCompletionRate: 0
  });
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  useEffect(() => {
    // Fetch mission statistics
    const fetchMissionStats = async () => {
      try {
        setIsStatsLoading(true);
        const missionStats = await MissionService.getMissionStatistics();
        setStats(missionStats);
      } catch (error) {
        console.error('Error fetching mission statistics:', error);
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchMissionStats();
  }, [missions]);

  // Calculate summary statistics
  const totalCandidates = candidateAnalytics.length;
  const completedMissionCount = candidateAnalytics.reduce(
    (sum, candidate) => sum + candidate.completedMissions, 
    0
  );
  const averageScore = candidateAnalytics.reduce(
    (sum, candidate) => sum + candidate.averageScore, 
    0
  ) / (totalCandidates || 1); // Prevent division by zero

  // Get top performing candidates
  const topCandidates = [...candidateAnalytics]
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 5);

  // Get skills distribution across all candidates
  const skillsDistribution = candidateAnalytics.reduce((acc, candidate) => {
    Object.entries(candidate.skillBreakdown).forEach(([skill, level]) => {
      if (!acc[skill]) {
        acc[skill] = { count: 0, sum: 0, average: 0 };
      }
      acc[skill].count++;
      acc[skill].sum += level;
      acc[skill].average = acc[skill].sum / acc[skill].count;
    });
    return acc;
  }, {} as Record<string, { count: number; sum: number; average: number }>);

  // Format skill name for display
  const formatSkillName = (skill: string) => {
    return skill.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        className="bg-gradient-to-r from-navy to-navy-dark rounded-2xl p-6 shadow-lg text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome, {user.name || user.email}</h1>
            <p className="text-primary-100">
              Track candidate performance and manage recruitment missions
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              onClick={onCreateMission}
              className="bg-white text-primary hover:bg-gray-100"
            >
              Create New Mission
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'candidates'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('candidates')}
          >
            Candidates
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'missions'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('missions')}
          >
            Missions
          </button>
        </div>

        <div className="p-6">
          {/* Tab content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Mission Stats */}
                <motion.div
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-700 mr-4">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Missions</p>
                      <p className="text-2xl font-bold">
                        {isStatsLoading ? '...' : stats.totalMissions}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs flex justify-between">
                    <span className="text-green-600">
                      {isStatsLoading ? '...' : stats.completedMissions} completed
                    </span>
                    <span className="text-blue-600">
                      {isStatsLoading ? '...' : stats.inProgressMissions} in progress
                    </span>
                    <span className="text-gray-500">
                      {isStatsLoading ? '...' : stats.notStartedMissions} not started
                    </span>
                  </div>
                </motion.div>

                {/* Candidates */}
                <motion.div
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-50 text-green-700 mr-4">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Candidates</p>
                      <p className="text-2xl font-bold">{totalCandidates}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs">
                    <span className="text-gray-600">
                      Average score: {averageScore.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>

                {/* Completion Rate */}
                <motion.div
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-50 text-purple-700 mr-4">
                      <AlignStartVertical size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completion Rate</p>
                      <p className="text-2xl font-bold">
                        {isStatsLoading ? '...' : `${Math.round(stats.averageCompletionRate)}%`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <ProgressBar 
                      progress={stats.averageCompletionRate} 
                      className="h-1.5 rounded-full overflow-hidden" 
                    />
                  </div>
                </motion.div>

                {/* Missions Per Candidate */}
                <motion.div
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-amber-50 text-amber-700 mr-4">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Missions Completed</p>
                      <p className="text-2xl font-bold">{completedMissionCount}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {totalCandidates > 0
                      ? `${(completedMissionCount / totalCandidates).toFixed(1)} per candidate`
                      : 'No candidates'}
                  </div>
                </motion.div>
              </div>

              {/* Top Candidates */}
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-4">Top Performing Candidates</h3>
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Missions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time Spent
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topCandidates.map((candidate) => (
                        <tr key={candidate.userId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {candidate.userName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900">
                                {candidate.averageScore}%
                              </span>
                              <div className="ml-4 flex-grow max-w-xs">
                                <ProgressBar
                                  progress={candidate.averageScore}
                                  className="h-1.5 rounded-full overflow-hidden"
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {candidate.completedMissions} completed
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {Math.floor(candidate.timeSpent / 60)} hours {candidate.timeSpent % 60} min
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => onViewCandidate(candidate.userId)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                      {topCandidates.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                            No candidate data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Skills Distribution */}
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-4">Candidate Skills Distribution</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(skillsDistribution).map(([skill, data]) => (
                      <div key={skill} className="flex flex-col">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {formatSkillName(skill)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Average: {data.average.toFixed(1)}/10
                          </span>
                        </div>
                        <ProgressBar
                          progress={(data.average / 10) * 100}
                          className="h-2 rounded-full overflow-hidden"
                          colorClass={
                            data.average >= 7 ? 'bg-green-500' :
                            data.average >= 5 ? 'bg-blue-500' :
                            'bg-amber-500'
                          }
                        />
                      </div>
                    ))}
                    {Object.keys(skillsDistribution).length === 0 && (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        No skill data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div>
              <h3 className="text-lg font-medium mb-4">All Candidates</h3>
              
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Missions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Strength Areas
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidateAnalytics.map((candidate) => (
                      <tr key={candidate.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.userName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {candidate.averageScore}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {candidate.completedMissions} completed
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {candidate.strengthAreas.map(area => (
                              <span 
                                key={area}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                              >
                                {formatSkillName(area)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => onViewCandidate(candidate.userId)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {candidateAnalytics.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          No candidate data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <MissionManagement
              onCreateMission={onCreateMission}
              onEditMission={onEditMission}
              onDeleteMission={onDeleteMission}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;