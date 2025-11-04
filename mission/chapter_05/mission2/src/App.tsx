import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage.js";
import NotFoundPage from "./pages/NotFoundPage.js";
import LoginPage from "./pages/LoginPage.js";
import HomeLayout from "./layouts/HomeLayout.js";
import SignupPage from "./pages/SignupPage.js";
import MyPage from "./pages/MyPage.js";
import ProtectedRoute from "./routes/ProtectedRoute.js";

//1. 홈페이지
//2. 로그인 페이지
//3. 회원가입 페이지

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        //path: "/" (위에 부모에도 "/"가 있으니 굳이 children에서 또 / 붙일 필요는 없기 때문에 index:true라고 함)
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "my",
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
