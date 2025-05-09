
import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import EPITable from './EPITable';
import StatusCard from './StatusCard';
import DistributionCard from './DistributionCard';
import QuickActionsCard from './QuickActionsCard';
import DistributionTable from './DistributionTable';

const Dashboard = () => {
  return (
    <div className="w-full p-6 bg-gray-50 font-sans">
      <Header />
      <Navigation />
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-3 lg:col-span-3">
          <EPITable />
        </div>
        
        <div className="md:col-span-1 lg:col-span-1">
          <StatusCard />
          <DistributionCard />
          <QuickActionsCard />
        </div>
      </div>
      
      <DistributionTable />
    </div>
  );
};

export default Dashboard;
