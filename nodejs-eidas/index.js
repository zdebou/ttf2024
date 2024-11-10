//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
global.crypto = require("crypto");
const express = require('express')
const cors = require('cors');
const {jwtDecode} = require("jwt-decode");
const {mqttClient} = require("./mqtt");
const mysql = require("./mysql");
const mailer = require("./mail");
require("./push");

const realAddress = "185-8-164-54.nip.io";
const baseUrl = "https://185-8-164-54.nip.io:10443";
const clientId = "example-client-id";
const clientSecret = "secret-a";

let redirect_uri = "http://185-8-164-54.nip.io:4000/";

const finalRedirect = "https://zdebou.github.io/ttf2024";

const recipient = "ado4007@gmail.com";

const port = 4000;

const app = express()
app.use(cors());

const roomIdMap = {};

async function getData(code) {
    const formData = new FormData();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("redirect_uri", redirect_uri);

    const req    = await fetch(baseUrl+"/oauth2/token", {
        method: 'POST',
        header: {
            Authorization: "Basic "+Buffer.from(clientId+":"+clientSecret).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
    });

    const obj = await req.json();

    return jwtDecode(obj.id_token);
}

async function main() {
    await mysql.connect();

    const client = await import('openid-client');
    const config = await client.discovery(
        new URL(baseUrl),
        clientId,
        clientSecret
    );

    app.get('/init', (req, res) => {
        console.log("GET /init "+req.socket.remoteAddress);
        if(req.query.roomId==null || typeof(req.query.roomId)!=="string") {
            res.write("You fucking cunt! Ty vyjebany kokot! Hurensohn!");
            res.end();
            return;
        }

        const parsedRoomId = parseInt(req.query.roomId);
        if(isNaN(parsedRoomId)){
            res.write("You fucking cunt! Ty vyjebany kokot! Hurensohn!");
            res.end();
            return;
        }

        let parameters = {
            redirect_uri,
            scope: "openid",
            state: client.randomState(),
            nonce: client.randomNonce()
        };

        roomIdMap[parameters.state] = parsedRoomId;

        let redirectTo = client.buildAuthorizationUrl(config, parameters);

        redirectTo.hostname = realAddress;

        res.writeHead(302, {
            'Location': redirectTo.href
        });
        res.end();
    });

    app.get("/", async (req, res) => {
        console.log("GET / "+req.socket.remoteAddress);
        if(
            req.query.code==null || typeof(req.query.code)!=="string" ||
            req.query.state==null || typeof(req.query.state)!=="string"
        ) {
            res.write("You fucking cunt! Ty vyjebany kokot! Hurensohn!");
            res.end();
            return;
        }

        const roomId = roomIdMap[req.query.state];
        if(roomId==null) {
            res.write("You fucking cunt! Ty vyjebany kokot! Hurensohn!");
            res.end();
            return;
        }

        let jwtData;
        try {
            jwtData = await getData(req.query.code);
        } catch (e) {
            console.error(e);
            res.write("You fucking cunt! Ty vyjebany kokot! Hurensohn!");
            res.end();
            return;
        }

        console.log("Great success! Data: ", jwtData);

        const firstName = jwtData.given_name;
        const lastName = jwtData.family_name;
        const identifier = jwtData.sub;

        let bookingId;
        let firstTime;
        try {
            [firstTime, bookingId] = await mysql.updateUserGetBookingId(identifier, roomId, firstName, lastName);
        } catch (e) {
            console.error(e);
            res.write("You are not an authorized person to enter this room!");
            res.end();
            return;
        }

        console.log("roomId="+roomId+" bookingId="+bookingId+" firstName="+firstName+" lastName="+lastName+" identifier="+identifier+" firstTime="+firstTime);

        await new Promise((resolve, reject) => {
            mqttClient.publish("hotel/lock/lock"+roomId+"/unlock", Buffer.from("1"), err => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        if(firstTime) await mailer.sendMail(
            recipient,
            "Check-in booking ID: "+bookingId.toString().padStart(10, "0"),
            firstName+" "+lastName+" just checked-in to room number "+roomId+" eID identifier: "+identifier
        );

        res.writeHead(302, {
            'Location': finalRedirect+"?bookingId="+bookingId+"&roomId="+roomId+"&firstName="+encodeURIComponent(firstName)+"&lastName="+encodeURIComponent(lastName)
        });
        res.end();

    });

    await new Promise(resolve => app.listen(port, () => resolve()));
    console.log(`BE app listening on port ${port}`)
}

main();
