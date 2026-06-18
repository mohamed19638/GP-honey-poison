export function getPumpStatus(pump: any) {
  let danger = 0;

  if (pump.temperature > 115) danger++;
  if (pump.pressure > 90) danger++;
  if (pump.vibration > 10) danger++;
  if (pump.power > 450) danger++;

  if (danger >= 2) return "warning";
  if (danger === 1) return "danger";
  return "normal";
}