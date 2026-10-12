# HireTrack — Frontend Milestone 1

A responsive candidate career workspace prototype built with React, TypeScript, Vite, and Lucide icons. It currently uses local demo data; no backend or database is connected yet.

## Features in this milestone
- Responsive dashboard UI
- Application statistics and skill-match visualization
- Search applications by company, role, or location
- Filter applications by status
- Add an application with a working modal
- Notification popover and UI feedback messages
- Candidate pipeline and interview preparation panels

## Run locally

Prerequisites: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
hiretrack-frontend/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.tsx
    ├── main.tsx
    └── styles.css
```

## Planned next milestones
1. Create the Java Spring Boot REST API.
2. Design PostgreSQL entities and database migrations.
3. Replace local demo state with API calls.
4. Add Spring Security/JWT, role-based access, and resume uploads.
5. Add automated tests, Docker, cloud deployment, and GitHub Actions CI/CD.

## Note
All companies, application statuses, dates, and skill-match values currently shown are demo data for UI development only. Skill-match percentages are illustrative, not calculated by a real matching engine.
