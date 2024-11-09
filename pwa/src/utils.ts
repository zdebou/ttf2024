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