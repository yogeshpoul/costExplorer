import React from 'react';
import CostGraph from './components/CostGraph';

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Cloud Cost Dashboard</h1>
      <CostGraph />
    </div>
  );
};

export default App;
