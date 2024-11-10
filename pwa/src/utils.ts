import Cookies from 'universal-cookie';

const cookies = new Cookies();

export function getBackEnd(){
    return "https://185-8-164-54.nip.io:3000"
}
export function IncreaseUpdateBadge(){
    cookies.set("notif", cookies.get("notif") ?? 0)
    UpdateBadge()
}
export function UpdateBadge() {
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
        new Notification("Hi there!");
        // …
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                navigator.serviceWorker.ready.then(function (registration) {
                    registration.showNotification('Notification with ServiceWorker');
                });
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
}

export function urlBase64ToUint8Array(base64String: string) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}