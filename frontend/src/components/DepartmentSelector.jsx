import React from 'react';

const DepartmentSelector = ({ departments, onSelect }) => {
  return (
    <select onChange={e => onSelect(e.target.value)}>
      {departments.map(dep => (
        <option key={dep} value={dep}>{dep}</option>
      ))}
    </select>
  );
};

export default DepartmentSelector;
