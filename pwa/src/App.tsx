import { useState } from 'react'
import reactLogo from './assets/react.svg'
import appLogo from '/favicon.svg'
import PWABadge from './PWABadge.tsx'
import './App.css'
import { getBackEnd, notifyMe } from './utils.ts'
import QRCode from 'react-qr-code'
import Cookies from 'universal-cookie';


function onButtonClick(){

  var cookie = new Cookies().get("sub")
  console.log(cookie, "onButtonClick")
  fetch(`${getBackEnd()}/sendNotification`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      subscription: cookie,
      payload: "payload",
      delay: 5,
      ttl: 60,
    }),
  });
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={appLogo} className="logo" alt="TTF logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>TTF</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <button disabled={Notification.permission !== "default"} onClick={() => {
          Notification.requestPermission()
        }}>
          Permission Push notification 
          {Notification.permission === "denied" ? " Denied" : ""}
        </button>


        <button onClick={notifyMe}>Notify me!</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <PWABadge />
      <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={"https://zdebou.github.io/ttf2024/"}
          viewBox={`0 0 256 256`}
        />
      </div>
      <p>This demo shows how to send push notifications with a payload.</p>

      <form>
        Notification payload: <input id='notification-payload' type='text' value='Insert here a payload'></input>
        Notification delay: <input id='notification-delay' type='number' value='5'></input> seconds
        Notification Time-To-Live: <input id='notification-ttl' type='number' value='0'></input> seconds
      </form>

      <button id="doIt" onClick={onButtonClick}>Request sending a notification!</button>

    </>
  )
}

export default App
