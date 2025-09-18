import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import HomePage from "./pages/HomePage/HomePage";
import ContactPage from "./pages/Contact/Contact";
import AboutPage from "./pages/About/About";
import { CustomePage } from "./pages/CustomePage/CustomePage";
import NewsletterPage from "./pages/NewsLetterPage/NewsletterPage";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import SearchResults from "./pages/SearchResults/SearchResults";
import { ShopifyCartProvider } from "./context/ShopifyCartContext";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/about" element={<AboutPage />} />
   <Route path="/custom" element={<CustomePage />} />
   <Route path="/products" element={<ProductPage />} />
   <Route path="/products/:id" element={<ProductDetailsPage />} />
   <Route path="/search" element={<SearchResults />} />
      </Route>
    </Routes>
  );
}

export default App;
