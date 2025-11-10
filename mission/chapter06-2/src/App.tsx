import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { LpListPage } from "./pages/LpListPage";
import { LpDetailPage } from "./pages/LpDetailPage";

function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <h1 className="logo">돌려돌려LP판</h1>
        <nav>
          <Link to="/">메인</Link>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<LpListPage />} />
          <Route path="/lp/:lpid" element={<LpDetailPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
