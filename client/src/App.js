import { useEffect, useState } from "react";
import axios from "axios";
import './App.css';
import RunningStatsChart from "./components/RunningStatsChrt";

function App() {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    axios.get('/runs')
      .then(response => setRuns(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <div>
        <h1>Running Stats</h1>
        <ul>
          {runs.map((run, index) => (
            <li key={index}>
              Date: {run.date} : Distance: {run.distance} km en {new Date(run.time * 1000).toISOString().slice(11, 19)} 
            </li>
          ))}
        </ul>
      </div>
      <RunningStatsChart />
    </>
  );
}

export default App;
