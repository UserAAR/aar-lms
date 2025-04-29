# AAR/LMS Academy - LMS Client

A modern, production-ready Learning Management System (LMS) frontend for 17+ age university students and junior-to-mid-level developers and data scientists.

## Setup

1. `npm install`
2. Create `.env` with `VITE_API_BASE_URL=http://localhost:8080`
3. `npm run dev`

## Features

- Light/dark mode toggle (persisted)
- Advanced theming in `tailwind.config.ts`
- Mock API via MSW (see `src/mocks`)
- Replace API URL for Spring Boot integration
- Fully responsive design with modern UI
- Multiple module pages:
  - Dashboard
  - Projects & Applications
  - Classroom & Courses
  - Calendar
  - Tasks
- Interactive UI components with animations
- AI assistance chat widget

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- React Router for navigation
- Tanstack React Query for data fetching
- MSW for API mocking

## Backend Integration

To connect to a real backend, simply update the `.env` file to point to your Spring Boot backend:

```
VITE_API_BASE_URL=https://your-backend-url.com
```

All API calls are centralized through the service in `src/services/api.ts`.
