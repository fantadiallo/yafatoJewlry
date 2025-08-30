import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShopifyCartProvider } from "../../context/ShopifyCartContext";

export default function Layout() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/newsletter";

  return (
    <ShopifyCartProvider>
      <div className="layout">
        {!hideNavAndFooter && <Header />}

        <main className="main-content">
          <Outlet />
        </main>

        {!hideNavAndFooter && <Footer />}
      </div>

      <ToastContainer position="top-center" autoClose={5000} />
    </ShopifyCartProvider>
  );
}
