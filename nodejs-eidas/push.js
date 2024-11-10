require('dotenv').config();
const webPush = require("web-push");
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const mysql = require("./mysql");

const port = 3000;

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.error(
        "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
        "environment variables. You can use the following ones:"
    );
    console.log(webPush.generateVAPIDKeys());
    return;
}

// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
    "https://example.com/",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

function thajskaMasaz(subscription) {
    webPush
        .sendNotification(
            subscription,
            JSON.stringify({"title":"Get discount 30%! on spa","content":"Exclusive spa experience"}),
            {TTL: 60}
        )
        .then(function () {
            console.log("Successfuly sent thai massage!");
        })
        .catch(function (error) {
            console.log(error);
        });
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/vapidPublicKey", function (req, res) {
    console.log("GET /vapidPublicKey ", req.query);
    res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post("/register", async  (req, res) => {
    console.log("POST /register ", req.body);
    if(req.body.subscription==null) {
        res.sendStatus(400);
        return;
    }
    if(req.body.bookingId!=null && typeof(req.body.bookingId)==="string" && isNaN()) {
        const bookingId = parseInt(req.body.bookingId);
        if(!isNaN(bookingId)) {
            await mysql.updateBookingSetPushNotifications(bookingId, req.body.subscription);
        }
    }
    setTimeout(() => thajskaMasaz(req.body.subscription), 15*1000);
    // A real world application would store the subscription info.
    res.sendStatus(201);
});

app.post("/sendNotification", function (req, res) {
    console.log("POST /sendNotification ", req.body);

    const subscription = req.body.subscription;
    const payload = req.body.payload;
    const options = {
        TTL: req.body.ttl,
    };

    setTimeout(function () {
        webPush
            .sendNotification(subscription, payload, options)
            .then(function () {
                res.sendStatus(201);
            })
            .catch(function (error) {
                console.log(error);
                res.sendStatus(500);
            });
    }, req.body.delay * 1000);
});

async function main() {
    const server = https.createServer(
        {
            key: fs.readFileSync(process.env.SSL_KEY),
            cert: fs.readFileSync(process.env.SSL_CERT),
            allowHTTP1: true
        },
        app
    );

    await new Promise(resolve => server.listen(port, () => resolve()));

    console.log(`Push notifications app listening on port ${port}`);
}

main();