import time
import json
import random
from datetime import datetime

# --------------------
# File path (K8s volume)
# --------------------
DATA_PATH = "/data/pump_data.json"

# --------------------
# Device info
# --------------------
DEVICE_ID = "PUMP-01"

# Initial sensor values
temperature = 40.0
pressure = 50.0
vibration = 2.5
flow_rate = 210.0
power = 18.0

# Thresholds
LIMITS = {
    "temperatureMax": 80,
    "pressureMax": 100,
    "vibrationMax": 6
}

# Cycle durations
DURATION = {
    "NORMAL": 60,
    "WARNING": 15,
    "ALERT": 10
}

state = "NORMAL"
cycle_timer = 0
update_interval = 5

# SENSOR_ERROR
sensor_error_active = False
sensor_error_timer = 0
SENSOR_ERROR_DURATION = 10

# --------------------
def calculate_status(temp, press, vib):
    if temp > LIMITS["temperatureMax"] or press > LIMITS["pressureMax"] or vib > LIMITS["vibrationMax"]:
        return "ALERT"
    elif temp > LIMITS["temperatureMax"] * 0.8 or press > LIMITS["pressureMax"] * 0.8 or vib > LIMITS["vibrationMax"] * 0.8:
        return "WARNING"
    else:
        return "NORMAL"

# --------------------
def apply_ai(temp, press, vib):
    temp += random.uniform(-0.3, 0.3)
    press += random.uniform(-0.5, 0.5)
    vib += random.uniform(-0.05, 0.05)

    temp += random.uniform(-0.1, 0.1)
    press += random.uniform(-0.2, 0.2)
    vib += random.uniform(-0.02, 0.02)

    flow_correction = max(0, (press - 50) * 0.5)
    return temp, press, vib, flow_correction

# --------------------
print("AI Pump Simulator started...")

while True:

    # Random SENSOR_ERROR
    if not sensor_error_active and random.random() < 0.05:
        sensor_error_active = True
        sensor_error_timer = 0

    if sensor_error_active:
        sensor_error_timer += update_interval
        data = {
            "deviceId": DEVICE_ID,
            "timestamp": datetime.utcnow().isoformat(),
            "temperature": None,
            "pressure": None,
            "flowRate": None,
            "vibration": None,
            "power": None,
            "status": "SENSOR_ERROR",
            "message": "Sensor not responding"
        }

        with open(DATA_PATH, "w") as f:
            json.dump(data, f, indent=2)

        print(json.dumps(data, indent=2))

        if sensor_error_timer >= SENSOR_ERROR_DURATION:
            sensor_error_active = False
            temperature -= 5
            pressure -= 8
            vibration -= 1.5

        time.sleep(update_interval)
        continue

    # State transitions
    cycle_timer += update_interval
    if state == "NORMAL" and cycle_timer >= DURATION["NORMAL"]:
        state = "WARNING"
        cycle_timer = 0
    elif state == "WARNING" and cycle_timer >= DURATION["WARNING"]:
        state = "ALERT"
        cycle_timer = 0
        temperature -= 5
        pressure -= 8
        vibration -= 1.5
    elif state == "ALERT" and cycle_timer >= DURATION["ALERT"]:
        state = "NORMAL"
        cycle_timer = 0

    # Sensor behavior
    if state == "NORMAL":
        temperature += random.uniform(-0.5, 0.5)
        pressure += random.uniform(-1, 1)
        vibration += random.uniform(-0.1, 0.1)
    elif state == "WARNING":
        temperature += random.uniform(1, 3)
        pressure += random.uniform(2, 4)
        vibration += random.uniform(0.3, 0.7)
    elif state == "ALERT":
        temperature += random.uniform(3, 6)
        pressure += random.uniform(4, 8)
        vibration += random.uniform(0.8, 1.5)

    temperature, pressure, vibration, flow_corr = apply_ai(temperature, pressure, vibration)

    temperature = max(30, min(temperature, 98))
    pressure = max(40, min(pressure, 120))
    vibration = max(1.0, min(vibration, 8.5))

    flow_rate = 240 - (pressure - 40) * 0.8 - flow_corr + random.uniform(-2, 2)
    power = 10 + (temperature - 30) * 0.3 + vibration + random.uniform(-1, 1)

    status = calculate_status(temperature, pressure, vibration)

    data = {
        "deviceId": DEVICE_ID,
        "timestamp": datetime.utcnow().isoformat(),
        "temperature": round(temperature, 1),
        "pressure": round(pressure, 1),
        "flowRate": round(flow_rate, 1),
        "vibration": round(vibration, 1),
        "power": round(power, 1),
        "status": status
    }

    with open(DATA_PATH, "w") as f:
        json.dump(data, f, indent=2)

    print(json.dumps(data, indent=2))
    time.sleep(update_interval)
