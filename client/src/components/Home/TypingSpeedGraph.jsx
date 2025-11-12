import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function TypingSpeedGraph({ data }) {
  // Handle empty or invalid data
  
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-zinc-800 rounded-lg border border-zinc-700">
        <p className="text-gray-400 text-lg">No speed data available</p>
      </div>
    );
  }

  // Ensure data has valid values
  const validData = data.map((point) => ({
    time: point.time || 0,
    wpm: Math.max(0, point.wpm || 0), // Ensure WPM is not negative
  }));

  return (
    <div className="w-full h-96 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={validData}
          margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          
          <XAxis
            dataKey="time"
            label={{
              value: 'Time (seconds)',
              position: 'insideBottomRight',
              offset: -10,
              fill: '#999',
            }}
            stroke="#666"
            tick={{ fill: '#999', fontSize: 12 }}
          />
          
          <YAxis
            label={{
              value: 'WPM',
              angle: -90,
              position: 'insideLeft',
              fill: '#999',
            }}
            stroke="#666"
            tick={{ fill: '#999', fontSize: 12 }}
            domain={[0, 'dataMax + 20']}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #444',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#fff' }}
            formatter={(value) => [`${Math.round(value)} WPM`, 'Speed']}
            labelFormatter={(label) => `${label}s`}
          />
          
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            textStyle={{ color: '#999' }}
          />
          
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name="WPM"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
