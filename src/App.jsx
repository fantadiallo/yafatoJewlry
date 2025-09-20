import { Routes, Route } from "react-router-dom";
import NewsletterPage from "./pages/NewsletterPage/NewsletterPage";
import Privacy from "./pages/policies/Privacy";
import Exchange from "./pages/policies/Exchange";
import Shipping from "./pages/policies/Shipping";
import Terms from "./pages/policies/Terms";
import Legal from "./pages/policies/Legal";
import Contact from "./pages/policies/Contact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewsletterPage />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/exchange" element={<Exchange />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
