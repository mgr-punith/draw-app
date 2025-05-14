Real-Time Collaborative Drawing
A modern collaborative drawing platform built with Next.js and WebSocket technology. This platform allows multiple users to draw on the same canvas in real-time, providing a seamless collaborative experience.

Features
🎨 Real-time drawing collaboration

🔄 Live canvas synchronization

🛠️ Drawing tools:

Rectangle

Circle

Line

Freehand drawing

🖐️ Canvas controls:

Pan

Zoom

Reset view

🔐 Secure authentication

🏠 Drawing rooms

🌙 Dark theme

Technology Stack
Frontend
Next.js 14

TypeScript

Tailwind CSS

Custom UI components

Canvas API

Backend
Node.js

WebSocket server

Prisma ORM

PostgreSQL database

Development
Turborepo

pnpm package manager

Vercel deployment

Getting Started
Prerequisites
Node.js 18 or higher

pnpm package manager

PostgreSQL database

Installation
Clone the repository:

bash
Copy
Edit
git clone <repository-url>
cd <project-name>
Install dependencies:

bash
Copy
Edit
pnpm install
Configure environment variables:

For the frontend (apps/web/.env):

env
Copy
Edit
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api/v1
For the backend (apps/http-backend/.env):

env
Copy
Edit
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
For the WebSocket server (apps/ws-backend/.env):

env
Copy
Edit
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
Set up the database:

Navigate to the backend folder:

bash
Copy
Edit
cd apps/http-backend
pnpm prisma generate
pnpm prisma db push
Start development servers:

bash
Copy
Edit
pnpm dev
Project Structure
plaintext
Copy
Edit
apps/
  ├── web/                 # Next.js frontend
  ├── http-backend/       # REST API server
  └── ws-backend/         # WebSocket server
packages/
  ├── ui/                 # Shared components
  ├── db/                 # Database client
  └── common/             # Shared utilities
Contributing
Fork the repository

Create a feature branch:

bash
Copy
Edit
git checkout -b feature/new-tool
Commit changes:

bash
Copy
Edit
git commit -m 'Add new drawing tool'
Push to the branch:

bash
Copy
Edit
git push origin feature/new-tool
Open a Pull Request

