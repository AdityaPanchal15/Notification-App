import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { useStatistics } from './useStatistics';
import { Chart } from './Chart';

function App() {
  const [count, setCount] = useState(0);
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>("CPU");
  const cpuUsage = useMemo(() => statistics.map((stat) => stat.cpuUsage), [statistics])
  const ramUsage = useMemo(() => statistics.map((stat) => stat.ramUsage), [statistics])
  const storageUsage = useMemo(() => statistics.map((stat) => stat.storageUsage), [statistics])
  
  const activeUsages = useMemo(() => {
    switch(activeView) {
      case "CPU":
        return cpuUsage;
      case "RAM":
        return ramUsage;
      case "STORAGE":
        return storageUsage
    }
  }, [activeView, cpuUsage, ramUsage, storageUsage]);
  
  useEffect(() => {
    return window.electron.subscribeChangeView((view) => setActiveView(view))
  }, []);
  
  return (
    <div className='App'>
      <div style={{height: 120}}>
        <Chart data={activeUsages} maxDataPoints={10} />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
