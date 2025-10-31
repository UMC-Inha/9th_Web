import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/login",
        element: (
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profile", element: <div>프로필 페이지</div> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
