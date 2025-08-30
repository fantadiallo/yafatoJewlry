import { Routes, Route } from "react-router-dom";
import NewsletterPage from "./pages/NewsLetterPage/NewsletterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewsletterPage />} />
    </Routes>
  );
}

export default App;
