# eSalesOne Test Application

A full-stack application with a Next.js frontend and Bun backend server for product management and analytics.

## 🏗️ Project Structure

```
├── www/          # Next.js frontend application
├── server/       # Bun backend API server
└── README.md     # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js** (v18 or higher)
-   **Bun** (latest version) - [Install Bun](https://bun.sh/docs/installation)
-   **MongoDB** database (local or cloud instance)

## 🚀 Getting Started

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd test-1

# Install dependencies for both applications
cd server && bun install
cd ../www && npm install
```

### 2. Environment Configuration

#### Server Environment (.env)

Create a `.env` file in the `server/` directory:

```env
# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=3001

# Database Configuration
DB_PROTOCOL=mongodb
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost:27017
DB_NAME=esalesone_db

# Sticky Integration
STICKY_BASE_URL=https://api.sticky.com
STICKY_USERNAME=your_sticky_username
STICKY_PASSWORD=your_sticky_password
```

#### Frontend Environment (.env.local)

Create a `.env.local` file in the `www/` directory:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 🏃‍♂️ Running the Applications

### Option 1: Start Both Applications Separately

#### Start the Backend Server

```bash
cd server
bun run dev
```

The server will start on `http://localhost:3001`

#### Start the Frontend Application

```bash
cd www
npm run dev
```

The frontend will start on `http://localhost:3000`

### Option 2: Quick Start (PowerShell)

Run both applications simultaneously using PowerShell:

```powershell
# Open two terminal windows
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd server; bun run dev"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd www; npm run dev"
```

## 📱 Available Scripts

### Frontend (www/)

-   `npm run dev` - Start development server with Turbopack
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint

### Backend (server/)

-   `bun run dev` - Start development server with hot reload

## 🔗 API Endpoints

Once the server is running, you can access:

-   **API Base URL**: `http://localhost:3001`
-   **API Documentation**: Check `server/docs/PRODUCTS_API.md` for detailed API documentation

## 🎯 Features

-   **Product Management**: CRUD operations for products
-   **Analytics Dashboard**: Product analytics and reporting
-   **Real-time Sync**: Integration with external systems
-   **Modern UI**: Built with Next.js, Tailwind CSS, and Radix UI
-   **Fast Backend**: Powered by Bun runtime

## 🛠️ Tech Stack

### Frontend

-   **Next.js 15** - React framework
-   **React 19** - UI library
-   **Tailwind CSS** - Styling
-   **Radix UI** - Component library
-   **TanStack Query** - Data fetching
-   **Axios** - HTTP client

### Backend

-   **Bun** - JavaScript runtime
-   **Express** - Web framework
-   **MongoDB** - Database
-   **Mongoose** - ODM

## 📝 Development Notes

1. **Hot Reload**: Both applications support hot reload during development
2. **CORS**: The server is configured to allow requests from the frontend
3. **Environment Validation**: Both apps use Zod for environment variable validation
4. **Code Quality**: ESLint and Prettier are configured for both projects

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**

    - Change the `PORT` in server `.env` file
    - Update `NEXT_PUBLIC_BACKEND_URL` in frontend accordingly

2. **Database Connection Failed**

    - Verify MongoDB is running
    - Check database credentials in `.env`

3. **Module Not Found**

    - Run `bun install` in server directory
    - Run `npm install` in www directory

4. **Environment Variables**
    - Ensure all required environment variables are set
    - Restart the application after changing `.env` files

## 📚 Additional Resources

-   [Next.js Documentation](https://nextjs.org/docs)
-   [Bun Documentation](https://bun.sh/docs)
-   [MongoDB Documentation](https://docs.mongodb.com/)

---

**Happy coding! 🎉**
