import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage.js";
import NotFoundPage from "./pages/NotFoundPage.js";
import LoginPage from "./pages/LoginPage.js";
import HomeLayout from "./layouts/HomeLayout.js";
import SignupPage from "./pages/SignupPage.js";
import MyPage from "./pages/MyPage.js";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import { GoogleLoginRedirectPage } from "./pages/GoogleLoginRedirectPage.js";
import { AuthProvider } from "./contexts/AuthContext.js";
import LpListPage from "./pages/LpListPage.js";
import LpDetailPage from "./pages/LpDetailPage.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      {
        path: "my",
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
      { path: "lps", element: <LpListPage /> },
      {
        path: "lps/:lpid",
        element: (
          <ProtectedRoute>
            <LpDetailPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
