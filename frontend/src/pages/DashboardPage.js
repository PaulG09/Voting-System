import React from 'react';
import ElectionList from '../components/ElectionList';
import ElectionFilter from '../components/ElectionFilter';

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <h1>Election Dashboard</h1>
      <ElectionFilter />
      <ElectionList />
    </div>
  );
};

export default DashboardPage;
