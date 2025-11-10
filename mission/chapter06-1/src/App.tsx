import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import LpListPage from "./pages/LpListPage";
import LpDetailPage from "./pages/LpDetailPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import FloatingButton from "./components/FloatingButton";
import "./App.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ nickname: string } | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <BrowserRouter>
      <div className="layout">
        <Header toggleSidebar={toggleSidebar} user={user} setUser={setUser} />
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

        <main className="main">
          <Routes>
            <Route path="/" element={<LpListPage />} />
            <Route
              path="/lp/:lpid"
              element={
                <ProtectedRoute>
                  <LpDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
          </Routes>
        </main>

        <FloatingButton />
        {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
      </div>
    </BrowserRouter>
  );
}
