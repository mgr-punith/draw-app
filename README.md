# Real-Time Collaborative Drawing

A modern collaborative drawing platform built with Next.js and WebSocket technology.

## Features

🎨 **Real-time drawing collaboration:** Multiple users can draw on the same canvas simultaneously, seeing each other's strokes in real-time.

🔄 **Live canvas synchronization:** All drawing actions and canvas manipulations are instantly synchronized across all connected clients.

🛠️ **Drawing tools:**

* **Rectangle:** Draw rectangular shapes.
* **Circle:** Draw circular shapes.
* **Line:** Draw straight lines.
* **Freehand drawing:** Draw freeform paths.

🖐️ **Canvas controls:**

* **Pan:** Move the visible area of the canvas.
* **Zoom:** Adjust the magnification level of the canvas.
* **Reset view:** Return the canvas to its default zoom and pan.

🔐 **Secure authentication:** Ensures only authorized users can access and participate in drawing sessions.

🏠 **Drawing rooms:** Organize collaboration within dedicated virtual rooms.

🌙 **Dark theme:** Offers a visually comfortable dark mode for extended use.

## Technology Stack

**Frontend**

* [Next.js](https://nextjs.org) 14
* [TypeScript](https://www.typescriptlang.org)
* [Tailwind CSS](https://tailwindcss.com)
* Custom UI components
* [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

**Backend**

* [Node.js](https://nodejs.org/en/)
* WebSocket server (built with Node.js)
* [Prisma](https://www.prisma.io/) ORM
* [PostgreSQL](https://www.postgresql.org/) database

**Development**

* [Turborepo](https://turborepo.org/)
* [pnpm](https://pnpm.io/) package manager
* [Vercel](https://vercel.com/) deployment

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) 18 or higher
* [pnpm](https://pnpm.io/) package manager
* [PostgreSQL](https://www.postgresql.org/) database

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Configure environment variables:**

    Create `.env` files in the specified directories and set the following variables:

    **`apps/web/.env`**
    ```
    NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api/v1
    ```

    **`apps/http-backend/.env`**
    ```
    DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
    JWT_SECRET=your-secret-key
    ```

    **`apps/ws-backend/.env`**
    ```
    DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
    JWT_SECRET=your-secret-key
    ```

    **Note:** Replace the placeholder values (e.g., `<user>`, `<password>`, `<host>`, `<port>`, `<database>`, `your-secret-key`) with your actual PostgreSQL database credentials and a strong secret key for JWT.

4.  **Set up the database:**
    ```bash
    cd apps/http-backend
    pnpm prisma generate
    pnpm prisma db push
    ```

5.  **Start development servers:**
    ```bash
    pnpm dev
    ```

    This command will start the frontend, HTTP backend, and WebSocket backend concurrently. You can usually access the frontend at `http://localhost:3000`.

## Project Structure
apps/
├── chat-web/            # chat app no need to worry about this
├── drawapp-fe/          # Website main frontend part
├── http-backend/        # http backend server
└── ws-backend/           #websocket server


packages/
├── ui/               # Shared UI components
├── db/              # Prisma database client
└── common/          # Shared utility functions and types


## Contributing

Contributions are welcome! Please follow these steps:

1.  **Fork the repository** on GitHub.
2.  **Create a feature branch** with a descriptive name:
    ```bash
    git checkout -b feature/new-tool
    ```
3.  **Commit your changes** with a clear and concise message:
    ```bash
    git commit -m 'Add new drawing tool'
    ```
4.  **Push your branch** to your forked repository:
    ```bash
    git push origin feature/new-tool
    ```
5.  **Open a Pull Request** on the main repository.