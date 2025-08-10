import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import HomePage from "./pages/HomePage/HomePage";
import ContactPage from "./pages/Contact/Contact";
import AboutPage from "./pages/About/About";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductPage from "./pages/ProductDetails/ProductPage";
import { CustomePage } from "./pages/CustomePage/CustomePage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductListPage />} /> {/* ✅ Product List */}
        <Route path="/products/:id" element={<ProductPage />} />  {/* ✅ Product Detail */}
        <Route path="/custom" element={<CustomePage />} /> {/* ✅ Custom Page */}
      </Route>
    </Routes>
  );
}

export default App;
