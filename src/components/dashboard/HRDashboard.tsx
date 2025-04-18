import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CandidateAnalytics, Mission } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { Brain, Code, Lightbulb, MessageSquare, Users, BarChart2, Trophy, Filter, Download, Briefcase, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface HRDashboardProps {
  user: User;
  candidateAnalytics: CandidateAnalytics[];
  missions: Mission[];
  onViewCandidate: (candidateId: string) => void;
  onCreateMission: () => void;
}

const HRDashboard: React.FC<HRDashboardProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  user,
  candidateAnalytics,
  missions,
  onViewCandidate,
  onCreateMission,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'missions'>('overview');
  const [filterSkill, setFilterSkill] = useState<string>('all');

  // Calculate summary statistics
  const totalCandidates = candidateAnalytics.length;
  const totalMissions = missions.length;
  const completedMissionCount = candidateAnalytics.reduce(
    (sum, candidate) => sum + candidate.completedMissions, 
    0
  );
  const averageScore = candidateAnalytics.reduce(
    (sum, candidate) => sum + candidate.averageScore, 
    0
  ) / totalCandidates;

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

  const getCategoryIcon = (category: string, size = 16) => {
    switch (category.toLowerCase()) {
      case 'problem-solving':
        return <Brain size={size} />;
      case 'technical':
        return <Code size={size} />;
      case 'creativity':
        return <Lightbulb size={size} />;
      case 'communication':
        return <MessageSquare size={size} />;
      case 'leadership':
        return <Users size={size} />;
      default:
        return <Brain size={size} />;
    }
  };

  // Filter candidates based on selected skill
  const filteredCandidates = filterSkill === 'all'
    ? candidateAnalytics
    : candidateAnalytics.filter(candidate => 
        candidate.skillBreakdown[filterSkill as keyof typeof candidate.skillBreakdown] >= 6 // Show candidates with skill level >= 6
      );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white p-6 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">HR Dashboard</h1>
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Users size={20} className="text-primary" />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-500 text-sm">Total Candidates</p>
                      <h3 className="font-bold text-2xl">{totalCandidates}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-secondary/10 p-3 rounded-full">
                      <Briefcase size={20} className="text-secondary" />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-500 text-sm">Total Missions</p>
                      <h3 className="font-bold text-2xl">{totalMissions}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Trophy size={20} className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-500 text-sm">Completed Missions</p>
                      <h3 className="font-bold text-2xl">{completedMissionCount}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <BarChart2 size={20} className="text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-500 text-sm">Avg. Score</p>
                      <h3 className="font-bold text-2xl">{averageScore.toFixed(1)}%</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Candidates */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-lg font-medium mb-4">Top Performing Candidates</h3>
                  <div className="space-y-4">
                    {topCandidates.map((candidate) => (
                      <div key={candidate.userId} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center uppercase font-bold text-gray-600">
                            {candidate.userName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{candidate.userName}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                              <span>{candidate.completedMissions} missions</span>
                              <span className="mx-2">•</span>
                              <span>
                                {candidate.timeSpent} {candidate.timeSpent === 1 ? 'min' : 'mins'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{candidate.averageScore}%</p>
                          <button 
                            className="text-xs text-gray-500 hover:text-primary"
                            onClick={() => onViewCandidate(candidate.userId)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Distribution */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-lg font-medium mb-4">Skills Distribution</h3>
                  <div className="space-y-4">
                    {Object.entries(skillsDistribution).map(([skill, data]) => (
                      <div key={skill} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(skill)}
                            <span className="text-sm font-medium capitalize">{skill}</span>
                          </div>
                          <span className="text-xs font-medium text-gray-500">
                            Avg: {data.average.toFixed(1)}/10
                          </span>
                        </div>
                        <ProgressBar
                          value={data.average}
                          max={10}
                          size="sm"
                          color={
                            skill === 'problem-solving' ? 'bg-blue-500' :
                            skill === 'leadership' ? 'bg-purple-500' :
                            skill === 'communication' ? 'bg-green-500' :
                            skill === 'technical' ? 'bg-red-500' :
                            'bg-amber-500' // creativity
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="space-y-6">
              {/* Filter Controls */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Filter size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Filter by skill:</span>
                  <select
                    className="text-sm border-gray-200 rounded-md"
                    value={filterSkill}
                    onChange={(e) => setFilterSkill(e.target.value)}
                  >
                    <option value="all">All Skills</option>
                    <option value="problem-solving">Problem Solving</option>
                    <option value="leadership">Leadership</option>
                    <option value="communication">Communication</option>
                    <option value="technical">Technical</option>
                    <option value="creativity">Creativity</option>
                  </select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download size={16} /> Export
                </Button>
              </div>
              
              {/* Candidates Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Missions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Top Skills
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCandidates.map((candidate) => (
                      <motion.tr 
                        key={candidate.userId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center uppercase font-bold text-gray-600">
                              {candidate.userName.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{candidate.userName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <span className="font-medium">{candidate.completedMissions}</span>
                            <span className="text-gray-500"> completed</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {candidate.timeSpent} mins total time
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.averageScore}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            {candidate.strengthAreas.slice(0, 2).map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100"
                              >
                                {getCategoryIcon(skill, 12)}
                                <span className="ml-1 capitalize">{skill}</span>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-primary hover:text-primary-700"
                            onClick={() => onViewCandidate(candidate.userId)}
                          >
                            View Details
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredCandidates.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No candidates match the selected filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'missions' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button 
                  onClick={onCreateMission}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} /> Create Mission
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {missions.map((mission) => (
                  <div key={mission.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className={`h-2 w-full ${
                      mission.difficulty === 'easy' ? 'bg-green-500' :
                      mission.difficulty === 'medium' ? 'bg-yellow-500' :
                      mission.difficulty === 'hard' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100">
                          {getCategoryIcon(mission.category, 12)}
                          <span className="ml-1 capitalize">{mission.category}</span>
                        </span>
                        <span className="text-xs text-gray-500 capitalize">{mission.difficulty}</span>
                      </div>
                      <h3 className="font-medium mb-2">{mission.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{mission.description}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span>{mission.tasks.length} tasks</span>
                        <span>{mission.points} XP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;