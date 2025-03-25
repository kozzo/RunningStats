import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const RunningStatsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/runs") // Fetch from your Fastify API
      .then(response => {
        // Transform data if necessary
        const formattedData = response.data.map(run => ({
          date: run.date || "Unknown",  // X-axis: Date
          distance: run.distance,       // Y-axis: Distance
          time: run.time                // You can add more fields
        }));
        console.log(formattedData);
        setData(formattedData);
      })
      .catch(error => console.error("Error fetching run data:", error));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="distance" stroke="#8884d8" />
        <Line type="monotone" dataKey="time" stroke="#82ca9d" />

      </LineChart>
      
    </ResponsiveContainer>
  );
};

export default RunningStatsChart;
