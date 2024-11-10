import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getBackEnd, urlBase64ToUint8Array } from './utils.ts'
import Cookies from 'universal-cookie';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

window.addEventListener("DOMContentLoaded", () => isPushSupported())
navigator.serviceWorker.ready
  .then(function (registration) {
    // Use the PushManager to get the user's subscription to the push service.
    return registration.pushManager.getSubscription()
      .then(async function (subscription) {
        // If a subscription was found, return it.
        if (subscription) {
          return subscription;
        }

        // Get the server's public key
        console.log("VapidPublicKey")

        try {
          const response = await fetch(`${getBackEnd()}/vapidPublicKey`);
          if (!response.ok) {
            throw new Error(`Failed to fetch VAPID key: ${response.statusText}`);
          }

          const vapidPublicKey = await response.text(); // Await the text to get the value
          console.log("VAPID key retrieved:", vapidPublicKey);

          // Convert the base64 string to Uint8Array for Chrome compatibility
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

          // Subscribe the user
          return await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });
        } catch (error) {
          console.warn("Failed to subscribe for push notifications:", error);
        }
      });
  }).then(function (subscription) {
    // Send the subscription details to the server using the Fetch API.
    // Access the current URL
    const url = window.location.href;
    const parsedUrl = new URL(url);
    const param1 = parsedUrl.searchParams.get('bookingId');

    console.log("Param1:", param1);

    fetch(`${getBackEnd()}/register`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        subscription: subscription,
        bookingId: param1
      }),
    })
    new Cookies().set("sub", JSON.stringify(subscription))
  })

function isPushSupported() {
  //checks if user has granted permission to Push notifications
  if (Notification.permission === 'denied') {
    alert('User has blocked push notification.');
    return;
  }

  //Checks if current browser supports Push notification
  if (!('PushManager' in window)) {
    alert('Sorry, Push notification isn\'t supported in your browser.');
    return;
  }

  //Get `push notification` subscription id

  //If `serviceWorker` is registered and ready
  //   navigator.serviceWorker.ready
  //     .then(function (registration) {
  //       registration.pushManager
  //       .getSubscription()
  //       .then((subscription)=>{
  //         console.log("Push Subscription",subscription)
  //       })
  //       .catch(function (error) {
  //         console.error('Error occurred while enabling push ', error);
  //       });
  //     });
  // 
}
