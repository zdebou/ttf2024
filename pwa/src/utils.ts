import Cookies from 'universal-cookie';

const cookies = new Cookies();

export function ShowNotification(){
    const v = (cookies.get("notif") ?? 0) + 1;
    cookies.set("notif", v)

    const notifTitle = `Test ${v}`;
    const notifBody = `Created by test.`;
    const notifImg = `/src/assets/react.svg`;
    const options = {
      body: notifBody,
      icon: notifImg,
    };
    new Notification(notifTitle, options);

    UpdateBadge()
}

export function UpdateBadge(){
    if (navigator.setAppBadge) {
        const v = cookies.get("notif") ?? 0
        if (v && v > 0) {
          navigator.setAppBadge(v);
        } else {
          navigator.clearAppBadge();
        }
      }
}

export function notifyMe() {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification("Hi there!");
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification("Hi there!");
          // …
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }