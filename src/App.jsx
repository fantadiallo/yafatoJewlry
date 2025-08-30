import { Routes, Route } from "react-router-dom";
import NewsletterPage from "./pages/NewsletterPage/NewsletterPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<NewsletterPage />} />
    </Routes>
  );
}

export default App;
