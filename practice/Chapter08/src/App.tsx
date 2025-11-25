import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomeLayout from "./layout/HomeLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <div>Not Found</div>,
    children: [
      { index: true, element: <div>DashBoard</div> },
      { path: "settings", element: <div>Settings</div> },
      { path: "team", element: <div>Team</div> },
      { path: "ui-element", element: <div>UI Element</div> },
      { path: "invoice", element: <div>Invoice</div> },
      { path: "contact", element: <div>Contact</div> },
      { path: "todo", element: <div>Todo</div> },
      { path: "calendar", element: <div>Calendar</div> },
      { path: "pricing", element: <div>Pricing</div> },
      { path: "stock", element: <div>Stock</div> },
      { path: "order-list", element: <div>Order List</div> },
      { path: "favorites", element: <div>Favorites</div> },
      { path: "product", element: <div>Product</div> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
