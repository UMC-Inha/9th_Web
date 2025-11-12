import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import Layout from "./components/Layout"
import SignupPage from "./pages/SignupPage"
import ProtectedRoute from "./components/ProtectedRoute"
import UserPage from "./pages/UserPage"
import LpPage from "./pages/LpPage"
import GoogleCallbackPage from "./pages/GoogleCallbackPage"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from "./contexts/AuthContext"
import LpDetailPage from "./pages/LpDetailPage"

const queryClient = new QueryClient();

function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  )
}

function App() {
  const router = createBrowserRouter([
    {
      path : "/",
      element : <RootLayout />,
      children : [
        {
          path : '',
          element : <HomePage />,
        },

        {
          path : 'login', 
          element : <LoginPage />,
        },

        {
          path : 'signin', 
          element : <SignupPage />,
        },

        {
          path : "/v1/auth/google/callback",
          element : <GoogleCallbackPage />,
        }
      ],
    },

    {
      element: (
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/user", element: <UserPage /> },
        { path: "/lp", element: <LpPage /> },
        { path: "/lp/:id", element: <LpDetailPage /> },
      ],
    },
  ])
  
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App