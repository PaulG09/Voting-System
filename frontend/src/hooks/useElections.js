import { useState, useEffect } from 'react';
import { fetchElections } from '../services/electionService';

const useElections = (filter) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchElections(filter).then((data) => {
      setElections(data);
      setLoading(false);
    });
  }, [filter]);

  return { elections, loading };
};

export default useElections;
