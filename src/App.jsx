import { Routes, Route } from "react-router-dom";
import ComingSoon from "./pages/ComingSoon/CommingSoon";


function App() {
  return (
    <Routes>
      <Route path="/" element={<ComingSoon />} />
    </Routes>
  );
}

export default App;
