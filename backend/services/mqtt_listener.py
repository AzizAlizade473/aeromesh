"""
AeroMesh MQTT Listener
======================
paho-mqtt client that subscribes to ESP32 sensor broadcasts.

Topic pattern: aeromesh/bus/+/sensors
Each ESP32 publishes JSON to: aeromesh/bus/{bus_id}/sensors

⚠️  Uncomment connect() call in main.py startup to enable
    real ESP32 hardware ingestion. Requires an MQTT broker
    running at the configured MQTT_BROKER address.
"""

import os
import json
import logging
from dotenv import load_dotenv
import paho.mqtt.client as mqtt

from models.esp32 import ESP32Payload
from services.fleet_manager import update_bus_from_esp32

load_dotenv()

logger = logging.getLogger("aeromesh.mqtt")

MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
TOPIC_PATTERN = "aeromesh/bus/+/sensors"


def on_connect(client, userdata, flags, reason_code, properties=None):
    """Subscribe to sensor topics on successful broker connection."""
    logger.info(f"Connected to MQTT broker at {MQTT_BROKER}:{MQTT_PORT}")
    client.subscribe(TOPIC_PATTERN)
    logger.info(f"Subscribed to {TOPIC_PATTERN}")


def on_message(client, userdata, msg):
    """
    Parse incoming ESP32 JSON payload and update fleet state.
    Called whenever an ESP32 publishes to aeromesh/bus/{id}/sensors.
    """
    try:
        data = json.loads(msg.payload.decode("utf-8"))
        payload = ESP32Payload(**data)
        update_bus_from_esp32(payload)
        logger.info(f"MQTT ingested data from Bus #{payload.bus_id}")
    except (json.JSONDecodeError, Exception) as e:
        logger.error(f"MQTT message parse error: {e}")


# ── MQTT Client Setup ──────────────────────────────────────────────
_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
_client.on_connect = on_connect
_client.on_message = on_message


def connect():
    """
    Connect to the MQTT broker and start the network loop.

    ⚠️  This function is provided but NOT called by default.
        Uncomment the connect() call in main.py startup event
        to enable real ESP32 hardware data ingestion.
    """
    try:
        _client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
        _client.loop_start()
        logger.info("MQTT listener started")
    except Exception as e:
        logger.warning(f"MQTT connection failed (broker may not be running): {e}")


def disconnect():
    """Cleanly disconnect from the MQTT broker."""
    _client.loop_stop()
    _client.disconnect()
    logger.info("MQTT listener stopped")
