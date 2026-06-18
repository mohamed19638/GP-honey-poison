

import Link from "next/link";
import { getPumpStatus } from "@/utils/status";

export default function PumpCard({ pump }: any) {
  const status = getPumpStatus(pump);

  return (
    <Link href={`/pump/${pump.id}`}>
      <div className="p-4 rounded-xl shadow-lg mb-4 cursor-pointer border bg-white text-black">
        <h2 className="text-xl font-bold">Pump {pump.id}</h2>

        <p>🌡 Temp: {pump.temperature.toFixed(1)}</p>
        <p>Pressure: {pump.pressure.toFixed(1)}</p>
        <p>Vibration: {pump.vibration.toFixed(1)}</p>
        <p>⚡ Power: {pump.power.toFixed(1)}</p>

       {status === "danger" && (
  <span className="text-red-500 text-xl">●</span>
)}</div>
    </Link>
  );
}