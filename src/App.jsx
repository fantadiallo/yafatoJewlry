import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import HomePage from "./pages/HomePage/HomePage";
import ContactPage from "./pages/Contact/Contact";
import AboutPage from "./pages/About/About";
import { CustomePage } from "./pages/CustomePage/CustomePage";
import NewsletterPage from "./pages/NewsLetterPage/NewsLetterPage";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import SearchResults from "./pages/SearchResults/SearchResults";
import { CatalogProvider } from "./context/CatalogContext";
import { fetchShopifyProductsPaged } from "./api/shopify";
// Policy pages
import Contact from "./pages/policies/Contact";
import Exchange from "./pages/policies/Exchange";
import Privacy from "./pages/policies/Privacy";
import Terms from "./pages/policies/Terms";
import Shipping from "./pages/policies/Shipping";
import Legal from "./pages/policies/Legal";
import NotFound from "./pages/NotFound/NotFound";

async function loadCatalog() {
  const pageSize = 100;
  let after = null;
  let items = [];
  for (let i = 0; i < 3; i++) {
    const { items: page, hasNextPage, endCursor } =
      await fetchShopifyProductsPaged(pageSize, after);
    items = items.concat(page);
    if (!hasNextPage) break;
    after = endCursor;
  }
  return items;
}

function App() {
  return (
    <CatalogProvider loader={loadCatalog}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/custom" element={<CustomePage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />

          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Policies */}
          <Route path="/policies/privacy" element={<Privacy />} />
          <Route path="/policies/terms" element={<Terms />} />
          <Route path="/policies/shipping" element={<Shipping />} />
          <Route path="/policies/exchange" element={<Exchange />} />
          <Route path="/policies/legal" element={<Legal />} />
          {/* If you want a policy-styled contact page too: */}
          <Route path="/policies/contact" element={<Contact />} />
        </Route>
      </Routes>
    </CatalogProvider>
  );
}

export default App;
