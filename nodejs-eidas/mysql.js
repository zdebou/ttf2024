const mysql = require('mysql2/promise');

let mysqlConnection;

async function connect() {
    mysqlConnection = await mysql.createConnection({
        host: "127.0.0.1",
        user: "adam",
        password: "admin"
    });
}

async function updateUserGetBookingId(eidas, roomId, firstName, lastName) {
    const [res] = await mysqlConnection.execute(
        "UPDATE touristx.customers SET checkedInAt = NOW(), eidas = ? WHERE roomId = ? AND checkedInAt is NULL AND NOW() > startTime AND NOW() < endTime AND firstName = ? AND lastName = ?",
        [eidas, roomId, firstName, lastName]
    );

    const [rows] = await mysqlConnection.execute(
        "SELECT * FROM touristx.customers WHERE roomId = ? AND NOW() > startTime AND NOW() < endTime AND firstName = ? AND lastName = ?",
        [roomId, firstName, lastName]
    );

    console.log(rows);

    if(rows.length===0){
        throw new Error("Invalid customer!");
    }

    return [res.affectedRows===1, rows[0].bookingId];
}

async function updateBookingSetPushNotifications(bookingId, subscriptionObject) {
    const [res] = await mysqlConnection.execute(
        "UPDATE touristx.customers SET pushNotifications = ? WHERE bookingId = ?",
        [JSON.stringify(subscriptionObject), bookingId]
    );
}

module.exports = {
    connect,
    updateUserGetBookingId,
    updateBookingSetPushNotifications
};
