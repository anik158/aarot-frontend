# Aarot (React + Vite)

A modern, responsive, and performance-optimized E-commerce storefront built with React and Redux.

## 🌟 Features

- **Global State Management**: Powered by **Redux Toolkit** for consistent data across the entire application.
- **Dynamic Cart Experience**: 
  - Real-time cart updates without page refreshes.
  - Seamlessly handles Guest-to-User cart merging via backend synchronization.
- **Premium UI/UX**:
  - Fully responsive design using **Tailwind CSS**.
  - Glassmorphic UI elements and smooth loading transitions.
  - **Scroll Restoration**: Automatic "Scroll to Top" behavior for a true SPA feel.
- **Secure Authentication**: Integrated with Laravel Passport for persistent, secure user sessions.
- **Smart Components**: Centralized Header with live cart count and intelligent redirection logic.

## 🚀 Tech Stack

- **Framework**: React 18+ (Vite)
- **State**: Redux Toolkit & Redux Persist
- **Styling**: Tailwind CSS / Lucide Icons
- **Routing**: React Router 6
- **HTTP Client**: Axios (with centralized interceptors for Auth/Guest headers)

## 🏁 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Setup environment**: Create a `.env` file with `VITE_API_URL`.
4. **Run Development**: `npm run dev`
5. **Build for Production**: `npm run build`

## 📂 Project Structure

- `/src/components`: UI components (Layouts, Products, Carts, Checkout)
- `/src/redux`: Slices and Store configuration
- `/src/helpers`: API configuration and helper utilities
- `/src/pages`: Page-level components
