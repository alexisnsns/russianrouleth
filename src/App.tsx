import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestRouleth from "./TestRouleth";
import Rouleth from "./Rouleth";

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Rouleth />} />
          <Route path="/test-rouleth" element={<TestRouleth />} />
        </Routes>
    </Router>
  );
};

export default App;
