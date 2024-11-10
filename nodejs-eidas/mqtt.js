const mqtt = require("mqtt");

const mqttClient = mqtt.connect("mqtt://"+process.env.MQTT_ADDRESS, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    protocolVersion: 5
});

mqttClient.on("error", err => {
    console.error(err);
});

mqttClient.on("connect", () => {
    console.log("[MQTT] Connected!");
});

module.exports = {
    mqttClient
};
