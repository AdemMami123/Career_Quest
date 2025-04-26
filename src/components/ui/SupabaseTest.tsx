import React, { useState } from 'react';
import { testSupabaseConnection, createTestMission, verifyDatabaseTables } from '../../lib/testSupabase';
import { Mission } from '../../types';

const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [creationStatus, setCreationStatus] = useState<'idle' | 'creating' | 'success' | 'failed'>('idle');
  const [tablesStatus, setTablesStatus] = useState<'idle' | 'checking' | 'done'>('idle');
  const [createdMission, setCreatedMission] = useState<Mission | null>(null);
  const [tableResults, setTableResults] = useState<Record<string, boolean>>({});

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    const success = await testSupabaseConnection();
    setConnectionStatus(success ? 'success' : 'failed');
  };

  const handleCreateMission = async () => {
    setCreationStatus('creating');
    const mission = await createTestMission();
    if (mission) {
      setCreatedMission(mission);
      setCreationStatus('success');
    } else {
      setCreationStatus('failed');
    }
  };

  const handleCheckTables = async () => {
    setTablesStatus('checking');
    const results = await verifyDatabaseTables();
    setTableResults(results);
    setTablesStatus('done');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Supabase Connection Test</h2>
      
      {/* Connection Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Test Database Connection</h3>
        <div className="flex items-center">
          <button 
            className="bg-primary hover:bg-primary-700 text-white px-4 py-2 rounded-md mr-4"
            onClick={handleTestConnection}
            disabled={connectionStatus === 'testing'}
          >
            {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </button>
          
          <div className="ml-2">
            {connectionStatus === 'idle' && <span className="text-gray-500">Not tested yet</span>}
            {connectionStatus === 'testing' && <span className="text-blue-500">Testing connection...</span>}
            {connectionStatus === 'success' && <span className="text-green-500">✅ Connection successful!</span>}
            {connectionStatus === 'failed' && <span className="text-red-500">❌ Connection failed. Check console for details.</span>}
          </div>
        </div>
      </div>
      
      {/* Table Verification */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Verify Database Tables</h3>
        <div className="flex items-center mb-3">
          <button 
            className="bg-primary hover:bg-primary-700 text-white px-4 py-2 rounded-md mr-4"
            onClick={handleCheckTables}
            disabled={tablesStatus === 'checking'}
          >
            {tablesStatus === 'checking' ? 'Checking...' : 'Check Tables'}
          </button>
        </div>
        
        {tablesStatus === 'done' && (
          <div className="mt-2 bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium mb-2">Table Status:</h4>
            <ul className="space-y-1">
              {Object.entries(tableResults).map(([table, exists]) => (
                <li key={table} className="flex items-center">
                  <span className={exists ? "text-green-500 mr-2" : "text-red-500 mr-2"}>
                    {exists ? "✅" : "❌"}
                  </span>
                  <span>{table}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Mission Creation */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Test Mission Creation</h3>
        <div>
          <button 
            className="bg-primary hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            onClick={handleCreateMission}
            disabled={creationStatus === 'creating'}
          >
            {creationStatus === 'creating' ? 'Creating...' : 'Create Test Mission'}
          </button>
          
          <div className="mt-2">
            {creationStatus === 'idle' && <span className="text-gray-500">No test mission created</span>}
            {creationStatus === 'creating' && <span className="text-blue-500">Creating test mission...</span>}
            {creationStatus === 'success' && <span className="text-green-500">✅ Mission created successfully!</span>}
            {creationStatus === 'failed' && <span className="text-red-500">❌ Failed to create mission. Check console for details.</span>}
          </div>
        </div>
        
        {createdMission && (
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Created Mission:</h4>
            <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(createdMission, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-500 mt-8">
        <p>Note: Check the browser console for more detailed information about any errors.</p>
      </div>
    </div>
  );
};

export default SupabaseTest;