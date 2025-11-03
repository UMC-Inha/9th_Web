import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import Layout from "./components/Layout"
import SignupPage from "./pages/SignupPage"
import ProtectedRoute from "./components/ProtectedRoute"
import UserPage from "./pages/UserPage"
import LpPage from "./pages/LpPage"

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
        
        // 여기서부턴 보호된 페이지입니당
        {
          path: "user",
          element: (
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          ),
        },
        
        {
          path: "lp",
          element: (
            <ProtectedRoute>
              <LpPage />
            </ProtectedRoute>
          ),
        },
      ],
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App