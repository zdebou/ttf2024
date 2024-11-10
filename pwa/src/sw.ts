/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { IncreaseUpdateBadge } from './utils'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

let allowlist: RegExp[] | undefined
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist },
))

self.skipWaiting()
clientsClaim()

self.addEventListener('push', function(event: PushEvent) {
  console.log("Push notification")
  const data = event?.data?.json() ?? {};  // Assuming the server sends JSON
  const options = {
      body: data?.content,
      icon: 'badge.png',
      badge: 'badge.png',
  };
  IncreaseUpdateBadge(),
  event.waitUntil(
      self.registration.showNotification(data?.title, options)
  );
});