import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShopifyCartProvider } from "../../context/ShopifyCartContext";
import NewsletterPopup from "../NewsletterPopup/NewsletterPopup";

/**
 * Layout Component
 *
 * Provides the global page structure and shared context across the app.
 * - Wraps children with `ShopifyCartProvider` for cart state.
 * - Conditionally displays `Header` and `Footer` depending on the route.
 * - Conditionally shows the `NewsletterPopup` on non-checkout/newsletter pages.
 * - Includes a `ToastContainer` for global notifications.
 * - Uses `Outlet` from React Router to render child routes.
 *
 * @component
 * @returns {JSX.Element} The rendered layout wrapper with header, footer, main content, and providers.
 */
export default function Layout() {
  const location = useLocation();

  /** Hide header and footer on the newsletter page */
  const hideNavAndFooter = location.pathname === "/newsletter";

  /** Routes where the newsletter popup should not display */
  const hidePopupRoutes = ["/checkout", "/newsletter"];
  const hidePopup = hidePopupRoutes.includes(location.pathname);

  return (
    <ShopifyCartProvider>
      <div className="layout">
        {!hideNavAndFooter && <Header />}

        <main className="main-content">
          <Outlet />
        </main>

        {!hideNavAndFooter && <Footer />}
      </div>

      {!hidePopup && <NewsletterPopup />}

      <ToastContainer position="top-center" autoClose={5000} />
    </ShopifyCartProvider>
  );
}
