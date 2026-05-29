# Aqnaeni (قنيني)

Aqnaeni is an Arabic interactive game experience for group sessions where players create topics, add questions, approve challenges, and vote to uncover the defender. The application includes a React + Vite frontend and a Node.js + Express backend with MongoDB persistence.

## Key Features

- Create and join game sessions
- Add players and manage participation
- Host approval workflow for submitted questions
- Voting flow with results and defender reveal
- Admin view for managing questions
- Client/server architecture with clean separation

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, TypeScript, Mongoose, MongoDB, CORS
- Deployment: Designed for separate frontend and backend hosting

## Repository Structure

- `backend/` - API server, data models, controllers, and session logic
- `frontend/` - React application, page routing, UI components, and API client

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB connection available (local or cloud)

### Backend Setup

1. Open a terminal and navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `backend/` with the following content:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3001
```

4. Start the backend in development mode:

```bash
npm run dev
```

The backend will start on `http://localhost:3001` by default.

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

4. Open the local Vite URL shown in the terminal (usually `http://localhost:5173`).

## Configuration

The frontend currently uses a remote API base URL configured in `frontend/src/lib/api.ts`:

```ts
const API_BASE = "https://aqnaeni-app.onrender.com/api";
```

For local development, update `API_BASE` to your backend address, for example:

```ts
const API_BASE = "http://localhost:3001/api";
```

## Available Scripts

### Backend

- `npm run dev` - run the server with live reload
- `npm run build` - compile TypeScript to JavaScript
- `npm start` - run the built server from `dist`

### Frontend

- `npm run dev` - start Vite development server
- `npm run build` - compile production-ready frontend assets
- `npm run preview` - preview built frontend locally

## Application Flow

1. Create a session with a topic
2. Add players to the session
3. Submit and approve questions
4. Vote on the approved questions
5. View results and reveal the defender

## Admin Access

An admin route exists for question management at:

```
/admin/aqnaeni-secret
```

## Notes

- The backend uses MongoDB via `MONGO_URI`.
- The app UI is Arabic-first and designed for right-to-left session flow.
- The backend exposes API routes under `/api` such as `/api/sessions`, `/api/questions`, and `/api/votes`.

## Author

- Abdelrhman Mohie

## License

This project is licensed under ISC.
