"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import dynamic from "next/dynamic";

const LineChart = dynamic(() => import("recharts").then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
 

import "./pump.css";

export default function PumpDetails() {
  const params = useParams();
  const id = params?.id as string;

  const [pump, setPump] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchPump = async () => {
      try {
        const res = await fetch(`http://localhost:5194/api/pumps/${id}`);
        const data = await res.json();

        setPump(data);

        setHistory((prev) => [
          ...prev.slice(-10),
          {
            time: new Date().toLocaleTimeString(),
            temp: data.temperature,
            pressure: data.pressure,
          },
        ]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPump();
    const interval = setInterval(fetchPump, 2000);
    return () => clearInterval(interval);
  }, [id]);

  if (!pump) return <div className="loading">Loading...</div>;

const LIMITS = {
  temp: { warn: 0.75, critical: 0.9, max: 150 },
  pressure: { warn: 0.7, critical: 0.9, max: 200 },
  vibration: { warn: 0.65, critical: 0.85, max: 100 },
  power: { warn: 0.75, critical: 0.9, max: 500 },
};

const tempStatus =
  pump.temperature > LIMITS.temp.critical * LIMITS.temp.max
    ? "critical"
    : pump.temperature > LIMITS.temp.warn * LIMITS.temp.max
    ? "warning"
    : "normal";

const pressureStatus =
  pump.pressure > LIMITS.pressure.critical * LIMITS.pressure.max
    ? "critical"
    : pump.pressure > LIMITS.pressure.warn * LIMITS.pressure.max
    ? "warning"
    : "normal";

const vibrationStatus =
  pump.vibration > LIMITS.vibration.critical * LIMITS.vibration.max
    ? "critical"
    : pump.vibration > LIMITS.vibration.warn * LIMITS.vibration.max
    ? "warning"
    : "normal";

const powerStatus =
  pump.power > LIMITS.power.critical * LIMITS.power.max
    ? "critical"
    : pump.power > LIMITS.power.warn * LIMITS.power.max
    ? "warning"
    : "normal";

const dangerCount = [tempStatus, pressureStatus, vibrationStatus, powerStatus]
  .filter((s) => s !== "normal").length;

const getColorByStatus = (status: string) => {
  if (status === "critical") return "#ef4444";
  if (status === "warning") return "#f59e0b";
  return "#22c55e";
};
  return (
    <div className="dashboard">

     
      <div className="sidebar">
        <div className="sidebar-content">

          {dangerCount >= 2 && (
            <div className="warning-icon">⚠️</div>
          )}
<p className={dangerCount >= 2 ? "status-warning" : "status-ok"}>
            {dangerCount >= 2 ? "WARNING" : "Normal"}
          </p>

          <h1 className="pump-title">Pump {id} #</h1>
          <h1 className="pump-title">Status Monitor</h1>
          
          <p className="status-label">🟢 Normal Operation </p>
          <p className="status-label">⚠️ Pressure Alert</p>
          <p className="status-label">🛠Maintenance Scheduled</p>

        
        </div>
      </div>
\
      <div className="right">
\
       <div className="top-cards">
  <Gauge
    title="Temperature"
    value={pump.temperature}
    max={150}
    color={getColorByStatus(tempStatus)}
  />

  <Gauge
    title="Pressure"
    value={pump.pressure}
    max={200}
    color={getColorByStatus(pressureStatus)}
  />

  <Gauge
    title="Vibration"
    value={pump.vibration}
    max={100}
    color={getColorByStatus(vibrationStatus)}
  />

  <Gauge
    title="Power"
    value={pump.power}
    max={500}
    color={getColorByStatus(powerStatus)}
  />
</div>
\
        <div className="bottom">
          <div className="chart-box">
            <h3>System Summary</h3>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history}>
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#ef4444"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

function Gauge({ title, value, max, color }: any) {
  const percentage = (value / max) * 100;

  return (
    <div className="card">
      <p>{title}</p>

      <div className="circle">
        <CircularProgressbar
          value={percentage}
          text={`${value}`}
          styles={{
            path: { stroke: color, strokeWidth: 10 },
            trail: { stroke: "#1e293b" },
            text: { fill: "white", fontSize: "18px" },
          }}
        />
      </div>
    </div>
  );
}