import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import Layout from "./components/Layout"
import SignupPage from "./pages/SignupPage"
import ProtectedRoute from "./components/ProtectedRoute"
import UserPage from "./pages/UserPage"
import LpPage from "./pages/LpPage"
import GoogleCallbackPage from "./pages/GoogleCallbackPage"

function App() {
  const router = createBrowserRouter([
    {
      path : "/",
      element : <Layout />,
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
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/user", element: <UserPage /> },
        { path: "/lp", element: <LpPage /> },
      ],
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App