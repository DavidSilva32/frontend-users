# Frontend - User Management System

This is the frontend of the **User Management System**, built with **React**, **TypeScript**, and **Material UI**.  
It provides a user-friendly interface for authentication, profile management, and user administration.

## 🌐 Tech Stack

- **React** with **TypeScript**
- **Material UI (MUI)** for UI components and layout
- **React Router v6** for client-side routing
- **Fetch API** for HTTP requests
- **Context API** for authentication state management
- **Vite** for fast development and build

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components (e.g., UserMenu, UserForm)
├── pages/            # Application pages (Login, Register, Profile, Admin)
├── types/            # TypeScript types and interfaces
├── utils/            # Utility functions (e.g., API requests, auth helpers)
├── AuthContext.tsx   # Authentication provider using Context API
├── App.tsx           # Main layout with persistent drawer and routing
└── main.tsx          # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/frontend-users-app.git
   cd frontend-users-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Running the App

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The app will be available at: [http://localhost:5173](http://localhost:5173)

### Building for Production

To build the app for production:
```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist/` directory.

## 🔐 Authentication

- **Token-based authentication** using `localStorage`.
- User roles (`USER` / `ADMIN`) determine access control.
- The role is fetched from the `/profile` endpoint after login.

## 📦 Environment Variables

Create a `.env` file in the root directory with the following variable:

```
VITE_API_BASE_URL=http://localhost:3000
```

Replace the URL with your backend API base URL.

## ✅ Features

- **Responsive Design**: Mobile-first layout with Material UI.
- **Persistent Sidebar**: Toggleable drawer for navigation.
- **Light/Dark Mode**: Theme toggle with localStorage persistence.
- **Authentication**: Login, registration, and role-based access control.
- **User Management**: Admin features for managing users (list, edit, delete).
- **Form Validation**: Client-side validation with error handling.
- **Protected Routes**: Access control based on authentication and roles.

## 🔧 Todo

- [ ] Add unit and integration tests using Vitest or React Testing Library.

## 🛠️ Commands

- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Lint Code**: `npm run lint`

## 📄 License

This project is licensed under the **MIT License**.