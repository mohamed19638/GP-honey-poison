"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./home.css";

export default function Home() {
  const router = useRouter();
  const [pumps, setPumps] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5194/api/pumps");
        const data = await res.json();
        setPumps(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);


  const totalPumps = pumps.length;

  const avgTemp =
    pumps.reduce((acc, p) => acc + p.temperature, 0) /
    (pumps.length || 1);

  const totalPower =
    pumps.reduce((acc, p) => acc + p.power, 0);

  const healthyCount = pumps.filter(
    (p) =>
      p.temperature < 80 &&
      p.pressure < 120 &&
      p.vibration < 60 &&
      p.power < 300
  ).length;

const calcPumpHealth = (p: any) => {
  let score = 0;


  score += Math.max(0, 1 - p.temperature / 150) * 25;
  score += Math.max(0, 1 - p.pressure / 200) * 25;
  score += Math.max(0, 1 - p.vibration / 100) * 25;
  score += Math.max(0, 1 - p.power / 500) * 25;

  return score; 
};
const health =
  pumps.reduce((acc, p) => acc + calcPumpHealth(p), 0) /
  (pumps.length || 1);
 
const chartData = pumps.map((p, i) => ({
  name: `P${i + 1}`,
  temperature: (p.temperature / 150) * 100,
  pressure: (p.pressure / 200) * 100,
  vibration: (p.vibration / 100) * 100,
  power: (p.power / 500) * 100,
}));
<YAxis domain={[0, 100]} />
  return (
    <div className="home">

     
      <div className="navbar">
        <h1 className="title">Pump Monitor System Dashboard</h1>

        <div className="nav-actions">
          <button onClick={() => router.push("/login")} className="main-btn">
  Login
</button>

<button onClick={() => router.push("/register")} className="main-btn">
  Register
</button>
        </div>
      </div>

     
      <div className="stats">

        <StatCard
          title="Total Pumps"
          value={totalPumps}
          data={pumps.map((_, i) => ({ x: i, y: 1 }))}
        />

        <StatCard
          title="Avg Temp"
          value={avgTemp.toFixed(1)}
          data={pumps.map((p, i) => ({ x: i, y: p.temperature }))}
        />

        <StatCard
          title="Total Power"
          value={totalPower}
          data={pumps.map((p, i) => ({ x: i, y: p.power }))}
        />

        <StatCard
          title="System Health"
          value={`${health.toFixed(0)}%`}
          data={pumps.map((_, i) => ({ x: i, y: health }))}
        />

      </div>

      <div className="chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis />
            <Tooltip />

            <Line dataKey="temperature" stroke="#ef4444" />
            <Line dataKey="pressure" stroke="#22c55e" />
            <Line dataKey="vibration" stroke="#f59e0b" />
            <Line dataKey="power" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    <div className="pump-grid">
  {pumps.map((p, i) => (
    <div key={i} className="pump-card-new">

      <h3>Pump {p.id}</h3>

      <img src="/photo.png" className="pump-img-big" />

      <div className="gauges-grid">
        <MiniGauge title="Temp" value={p.temperature} max={150} />
        <MiniGauge title="Pressure" value={p.pressure} max={200} />
        <MiniGauge title="Vibration" value={p.vibration} max={100} />
        <MiniGauge title="Power" value={p.power} max={500} />
      </div>

      <button
        className="details-btn"
        onClick={() => router.push(`/pump/${p.id}`)}
      >
        View Details
      </button>

    </div>
  ))}
</div>
     
      <div className="charts-grid">

        <Chart title="Temperature" data={chartData} dataKey="temperature" color="#ef4444" />
        <Chart title="Pressure" data={chartData} dataKey="pressure" color="#22c55e" />
        <Chart title="Vibration" data={chartData} dataKey="vibration" color="#f59e0b" />
        <Chart title="Power" data={chartData} dataKey="power" color="#3b82f6" />

      </div>

    </div>
  );
}

function StatCard({ title, value, data }: any) {
  return (
    <div className="card">
      <p>{title}</p>
      <h2>{value}</h2>
<ResponsiveContainer width="100%" height={200}>
     
        <LineChart data={data}>
          <Line dataKey="y" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function Chart({ title, data, dataKey, color }: any) {
  return (
    <div className="chart-box">
      <h3>{title}</h3>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line dataKey={dataKey} stroke={color} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}function MiniGauge({ title, value, max }: any) {
  const percentage = (value / max) * 100;

  const getColor = () => {
    if (percentage > 80) return "#ef4444"; 
    if (percentage > 50) return "#f59e0b"; 
    return "#22c55e"; // normal
  };

  return (
    <div className="mini-gauge">
      <p>{title}</p>

      <div style={{ width: 70, height: 70 }}>
        <CircularProgressbar
          value={percentage}
          text={`${value}`}
          styles={{
            path: { stroke: getColor(), strokeWidth: 8 },
            trail: { stroke: "#1e293b" },
            text: { fill: "white", fontSize: "22px" },
          }}
        />
      </div>
    </div>
  );
}