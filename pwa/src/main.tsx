import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

window.addEventListener("DOMContentLoaded",()=>isPushSupported())


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
  navigator.serviceWorker.ready
    .then(function (registration) {
      registration.pushManager
      .getSubscription()
      .then((subscription)=>{
        console.log("Push Subscription",subscription)
      })
      .catch(function (error) {
        console.error('Error occurred while enabling push ', error);
      });
    });
}
