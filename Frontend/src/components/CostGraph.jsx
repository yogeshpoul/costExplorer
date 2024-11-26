import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import apiClient from '../api/axios';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CostGraph = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState('2024-11-01');
  const [endDate, setEndDate] = useState('2024-11-25');

  const fetchCosts = async (start, end) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/fetch-costs', {
        params: { startDate: start, endDate: end },
      });

      const lines = response.data.split('\n').filter(line => line.trim() !== '');
      const timePeriods = [];
      const costs = [];

      lines.forEach(line => {
        if (line.startsWith('Time Period')) {
          const range = line.split(': ')[1];
          timePeriods.push(range);
        } else if (line.startsWith('Metric')) {
          const cost = parseFloat(line.split(', Amount: $')[1]);
          costs.push(cost);
        }
      });

      setChartData({
        labels: timePeriods,
        datasets: [
          {
            label: 'AWS Costs (USD)',
            data: costs,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            tension: 0.4,
          },
        ],
      });

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cost data');
      setLoading(false);
    }
  };

  // Fetch data on component mount and when dates change
  useEffect(() => {
    fetchCosts(startDate, endDate);
  }, [startDate, endDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCosts(startDate, endDate);
  };

  return (
    <div>
      <h1>AWS Cost Analysis</h1>
      
      {/* Date Picker Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginRight: '10px', marginLeft: '5px' }}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginRight: '10px', marginLeft: '5px' }}
          />
        </label>
        <button type="submit">Fetch Costs</button>
      </form>

      {/* Display Chart or Loading/Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default CostGraph;
