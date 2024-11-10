# TTF2024-Salzburg

A project repository for TTF2024 in Salzburg, developed using TypeScript, React, Java, Docker, . This project includes modules for eIDAS integration and PWA support with push notifications (Web, Android, iOS)

## Project Structure

- **nodejs-eidas**: Module for handling eIDAS (electronic IDentification, Authentication, and trust Services) functionalities.
- **pwa**: Progressive Web Application (PWA) components for offline support and enhanced user experience.

## Getting Started
- Mock of eIDAS node (has to be running in docker) https://github.com/e-gov/GovSSO-Mock
  Config
  ```
  {
  "host": "185-8-164-54.nip.io",
  "serverPort": "10443",
  "baseHref": "/",
  "tlsCertificate": "config/tls/fullchain.pem",
  "tlsPrivateKey": "config/tls/privkey.pem",
  "idTokenSignPrivateKeyPath": "config/id-token/id-token-sign.key.pem",
  "idTokenSignPublicKeyPath": "config/id-token/id-token-sign.pub.pem",
  "idTokenSignKeyId": "govsso-mock"
  }
  ```
- MQTT broker
- PWA - Standard vite dev & build & deploy (https://vite.dev/) + need to create VAPID pair of keys for Web Push Notification API (https://datatracker.ietf.org/doc/html/draft-ietf-webpush-vapid-01)
- Node.js for backend service of Push Notifications

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (version 14 or higher recommended)
- **npm** (Node Package Manager, comes with Node.js)

### Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zdebou/ttf2024.git
