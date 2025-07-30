import React, { useState } from 'react';

// candidates: array of { id, name, photo, section }
// Example: [ { id: 1, name: 'John', photo: '...', section: 'President' }, ... ]
const VoteForm = ({ candidates, onConfirm }) => {
  // Group candidates by section
  const sections = candidates.reduce((acc, candidate) => {
    if (!acc[candidate.section]) acc[candidate.section] = [];
    acc[candidate.section].push(candidate);
    return acc;
  }, {});

  // Track selected candidate per section
  const [selected, setSelected] = useState({});

  const handleSelect = (section, id) => {
    setSelected(prev => ({ ...prev, [section]: id }));
  };

  const handleConfirm = () => {
    // Only confirm if all sections have a selection
    const allSelected = Object.keys(sections).every(
      section => selected[section]
    );
    if (allSelected) {
      onConfirm(selected);
    }
  };

  return (
    <div className="vote-form-modern">
      {Object.entries(sections).map(([section, sectionCandidates]) => (
        <div key={section} className="candidate-section">
          <h3>{section}</h3>
          <div className="candidates-grid">
            {sectionCandidates.map(candidate => (
              <div
                key={candidate.id}
                className={`candidate-card${selected[section] === candidate.id ? ' selected' : ''}`}
                onClick={() => handleSelect(section, candidate.id)}
              >
                <img src={candidate.photo} alt={candidate.name} className="candidate-photo" />
                <div className="candidate-name">{candidate.name}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        className="confirm-btn"
        onClick={handleConfirm}
        disabled={Object.keys(sections).some(section => !selected[section])}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default VoteForm;
