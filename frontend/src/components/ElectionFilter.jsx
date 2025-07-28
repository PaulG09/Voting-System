import React from 'react';

const ElectionFilter = () => {
  // Placeholder for filter UI
  return (
    <div className="election-filter">
      <label>Filter by:</label>
      <select>
        <option value="all">All</option>
        <option value="department">Department</option>
        <option value="general">General</option>
        <option value="hall">Hall</option>
      </select>
    </div>
  );
};

export default ElectionFilter;
