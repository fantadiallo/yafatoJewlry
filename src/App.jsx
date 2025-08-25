import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import HomePage from "./pages/HomePage/HomePage";
import ContactPage from "./pages/Contact/Contact";
import AboutPage from "./pages/About/About";
import { CustomePage } from "./pages/CustomePage/CustomePage";
import NewsletterPage from "./pages/NewsLetterPage/NewsletterPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/about" element={<AboutPage />} />
   <Route path="/custom" element={<CustomePage />} /> 
      </Route>
    </Routes>
  );
}

export default App;
