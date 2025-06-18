import { Routes, Route } from "react-router-dom";
import ComingSoon from "./pages/ComingSoon/CommingSoon";
import Layout from "./components/layout/layout";


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}

export default App;
