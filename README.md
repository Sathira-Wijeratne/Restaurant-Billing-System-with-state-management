# Restaurant Billing System

A modern, responsive web application for restaurant billing management. This system helps restaurant owners manage their menu items and track sales efficiently.

## 🍽️ Features

- **Authentication & Security**
  - JWT (JSON Web Token) based authentication system
  - Secure user registration and login with email/password
  - HTTP-only cookies for secure token storage
  - Password hashing with bcryptjs for enhanced security
  - Protected routes requiring authentication
  - Automatic token verification and session management

- **State Management**
  - Redux Toolkit for centralized authentication state management
  - Persistent login sessions across browser refreshes
  - Real-time authentication status updates
  - Automatic token validation and renewal
  - Seamless user experience with loading states

- **Menu Management**
  - Add new menu items with names and prices
  - Edit existing menu items
  - Delete menu items with confirmation
  - Real-time updates using Firebase

- **Sales Tracking**
  - View all sales transactions
  - Detailed view of each sale with items, quantities, and amounts
  - Total sales calculation
  - Real-time updates using Firebase

- **User Interface**
  - Clean, responsive design with Material UI
  - Consistent theme based on warm restaurant colors
  - Toast notifications for user feedback
  - Loading states and error handling

## 🛠️ Technologies Used

### Frontend
- **React** - UI library for building the user interface
- **React Router** - For client-side routing between pages
- **Redux Toolkit** - State management for authentication and app state
- **React Redux** - React bindings for Redux state management
- **Material UI** - Component library for consistent design
- **React Toastify** - For displaying notifications

### Backend
- **Node.js & Express** - Server-side runtime and web framework
- **JWT (JSON Web Tokens)** - Secure authentication and authorization
- **bcryptjs** - Password hashing for security
- **cookie-parser** - HTTP cookie parsing middleware
- **Firebase Firestore** - NoSQL database for storing menu items and sales data
- **Firebase Real-time Updates** - For instant data synchronization

## 📂 Project Structure

```
/backend
  /config           # Firebase Admin configuration
  /middleware       # Authentication middleware
  /routes           # API routes (auth, protected)
  server.js         # Express server setup

/frontend
  /public           # Static files
  /src
    /components     # React components
      /dialogs      # Modal dialog components
    /hooks          # Custom React hooks
    /store          # Redux store and slices
    /theme          # Theme configuration
    /utils          # Utility functions
```

## ⚙️ Setup and Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sathira-Wijeratne/Restaurant-Billing-System.git
   cd Restaurant-Billing-System
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   - Create a `.env` file in the backend directory
   - Add the following environment variables:
   ```env
   JSON_WEB_TOKEN_SECRET_KEY=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000
   PORT=3001
   ```

5. **Set up Firebase**
   - Create a Firebase project
   - Set up Firestore database
   - Generate Firebase Admin SDK service account key
   - Place the JSON file in `backend/config/`
   - Update the Firebase configuration in `frontend/src/Firebase.js`

6. **Run the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

## 📱 Usage

### Authentication
- **Registration**: Create a new account with email and password
- **Login**: Sign in with your credentials to access the system
- **Security**: All routes are protected and require authentication

### Menu Management
- Navigate to the Items page to view all menu items
- Click "Add New Item" to add a new menu item
- Use the edit/delete buttons to modify or remove items

### Sales Tracking
- Click "View Sales" to see all sales transactions
- Click "Details" on any sale to view the specific items sold

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication system
- **HTTP-Only Cookies**: Tokens stored securely to prevent XSS attacks
- **Password Hashing**: bcrypt encryption for user passwords
- **Protected Routes**: Authentication required for all sensitive operations
- **Redux State Management**: Centralized state management for authentication
- **Auto Token Verification**: Automatic validation of user sessions

## 🔒 Environment Variables

### Backend Environment Variables
Create a `.env` file in the backend directory:
```env
JSON_WEB_TOKEN_SECRET_KEY=your_super_secure_secret_key
CLIENT_URL=http://localhost:3000
PORT=3001
```

### Firebase Configuration
- **Backend**: Place Firebase Admin SDK service account JSON file in `backend/config/`
- **Frontend**: Update Firebase configuration in `frontend/src/Firebase.js`
