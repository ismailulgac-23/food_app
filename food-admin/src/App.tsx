import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { authAPI } from "./services/api";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Orders from "./pages/Orders";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const check = async () => {
      try {
        await authAPI.me();
        setOk(true);
      } catch {
        setOk(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);
  if (loading) return <div className="flex items-center justify-center h-screen">UYMAR MARKET</div>;
  return ok ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index path="/" element={<Home />} />

            {/* Food Management */}
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />

          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
