const mqtt = require("mqtt");

const mqttClient = mqtt.connect("mqtt://185.8.164.54", {
    username: "server",
    password: "90ugt989gh98egj80verj0",
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
