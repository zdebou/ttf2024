import { useState } from 'react'
import reactLogo from './assets/react.svg'
import front from './assets/front.webp'
import offer from './assets/offers.webp'
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
      payload: JSON.stringify({
        title: "Get discount 30%! on spa",
        content: "Exclusive spa experience"
      }),
      delay: 5,
      ttl: 60,
    }),
  });
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {WelcomePage()}
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
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>


        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <button disabled={Notification.permission !== "default"} onClick={() => {
          Notification.requestPermission()
          window.location.reload()
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
        Notification delay: <input id='notification-delay' type='number' value='5'></input> seconds
      </form>

      <button id="doIt" onClick={onButtonClick}>Request sending a notification!</button>

    </>
  )
}

export default App

function WelcomePage() {
  const url = window.location.href;
  const parsedUrl = new URL(url);
  const bid = parsedUrl.searchParams.get('bookingId');
  const rid = parsedUrl.searchParams.get('roomId');
  const name = parsedUrl.searchParams.get('firstName');
  const surname = parsedUrl.searchParams.get('lastName');

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
      {/* Header with Hero Image */}
      <header
        className="relative text-center text-white h-64 flex items-center justify-center"
        style={{
          backgroundImage: `url(${front})`, // Replace with actual path
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black bg-opacity-50 p-6 rounded-md">
          <h1 className="text-4xl font-bold">Welcome {name} to TTF Hotel!</h1>
          <p className="mt-2 text-lg">Booking ID: <span className="font-semibold">#{bid}</span></p>
          {rid && <p className="mt-2 text-lg">Room: <span className="font-semibold">#{rid}</span></p>}
          {(name || surname) && <p className="mt-2 text-lg">Name: <span className="font-semibold">{name} {surname}</span></p>}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-8 max-w-3xl mx-auto space-y-8">
        {/* Welcome Message */}
        <section className="text-center">
          <p className="text-2xl text-gray-700">We’re delighted to have you with us!</p>
          <p className="mt-2 text-gray-600">
            Enjoy luxury at your fingertips with our exclusive services and amenities.
          </p>
        </section>

        {/* Hotel Information */}
        <section className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <img
            src={front} // Replace with actual path if you want a smaller version here too
            alt="Hotel Exterior"
            className="w-full h-auto rounded-lg md:max-w-lg lg:max-w-xl"
          />
          <p className="text-gray-800 font-semibold">Address:</p>
          <p className="text-gray-600">1234 Sunset Blvd, City, Country</p>
          <p className="text-gray-800 font-semibold mt-4">Contact:</p>
          <a href="tel:+123456789" className="text-blue-600 hover:underline">
            +1 (234) 567-890
          </a>
        </section>

        {/* Promo Section */}
        <section className="relative bg-yellow-100 rounded-lg p-6 text-center">
          <img
            src={offer}// Replace with actual path
            alt="Promo Dining Setup"
            className="absolute inset-0 w-full h-full object-cover opacity-10 rounded-lg"
          />
          <div className="relative z-10">
            <h3 className="text-2xl font-semibold text-yellow-800">Unlock Exclusive Offers!</h3>
            <p className="text-yellow-900 mt-2">
              Install our app to access daily discounts, meal vouchers, and room upgrades.
            </p>
          </div>
        </section>

        {/* PWA Install & Notifications */}
        <div className="flex justify-center space-x-4 mt-6">
          {/* Install PWA Button */}
          <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
            Install Our App
          </button>
          {/* Enable Notifications Button */}
          <button className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105">
            Enable Notifications
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 py-4 text-center text-gray-700">
        <p className="mb-2">Quick Links:</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-blue-600 hover:underline flex items-center space-x-1">
            <span>🏠</span> <span>Home</span>
          </a>
          <a href="#" className="text-blue-600 hover:underline flex items-center space-x-1">
            <span>🛎️</span> <span>Services</span>
          </a>
          <a href="#" className="text-blue-600 hover:underline flex items-center space-x-1">
            <span>🍽️</span> <span>Dining</span>
          </a>
          <a href="#" className="text-blue-600 hover:underline flex items-center space-x-1">
            <span>🌆</span> <span>Attractions</span>
          </a>
          <a href="#" className="text-blue-600 hover:underline flex items-center space-x-1">
            <span>📞</span> <span>Contact Us</span>
          </a>
        </div>
        <div className="mt-4 space-x-4">
          <a href="#" className="text-blue-600 hover:underline">Facebook</a>
          <a href="#" className="text-blue-600 hover:underline">Instagram</a>
          <a href="#" className="text-blue-600 hover:underline">Twitter</a>
        </div>
      </footer>
    </div>
  );
}

