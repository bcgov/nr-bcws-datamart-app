# NR BCWS Datamart App UI

Angular frontend for the NR BCWS Datamart application.

This application is built using Angular 22 and is intended to run within the BC Government Quickstart Azure Containers platform. The frontend is deployed as a static web application using Caddy and is designed to communicate with a backend API through the `/api` route.

---

## Prerequisites

The project currently targets:

- Node.js 24.x
- npm 10+

Verify your versions:

```bash
node -v
npm -v
```

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Running Locally

Start the Angular development server:

```bash
npm start
```

or

```bash
ng serve
```

Once running, browse to:

```text
http://localhost:4200
```

The application will automatically reload when source files are changed.

---

## Building

Create a production build:

```bash
npm run build
```

Build artifacts are generated under:

```text
dist/nr-bcws-datamart-app-ui/browser
```

---

## Testing

Run unit tests:

```bash
ng test
```

---

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── app/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
├── Dockerfile
└── Caddyfile
```

---

## Docker

### Build Image

From the frontend directory:

```bash
docker build -t datamart-ui .
```

### Run Container

```bash
docker run -p 3000:3000 datamart-ui
```

Browse to:

```text
http://localhost:3000
```

---

## Container Architecture

The application is built and deployed using a multi-stage Docker build:

1. Angular application is compiled using Node.js.
2. Static files are generated in the Angular `dist` directory.
3. Caddy serves the generated static assets.
4. Requests to `/api` are proxied to the configured backend service.

---

## Development Notes

### Generate Components

Create a new component:

```bash
ng generate component components/my-component
```

Generate other Angular artifacts:

```bash
ng generate --help
```

### Recommended Commands

Start development server:

```bash
npm start
```

Build production assets:

```bash
npm run build
```

Run tests:

```bash
ng test
```

---

## Technologies

- Angular 22
- TypeScript
- SCSS
- RxJS
- Caddy
- Docker

---

## Status

Initial Angular application successfully:

- Migrated from React/Vite quickstart template
- Running locally using Angular CLI
- Building successfully for production
- Deployable through Docker
- Served through Caddy

This provides the foundational UI platform for the NR BCWS Datamart application.


## UI Framework

This application is built using Angular 22 and will leverage the BC Government Natural Resources Angular Component Library:

- @bcgov/nr-ngx-component-lib

The component library provides common UI controls, page state management, layout components, and shared patterns used across Natural Resources applications.