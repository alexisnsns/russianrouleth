import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestRouleth from "./TestRouleth";
import Rouleth from "./Rouleth";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Rouleth />} />
          <Route path="/test-rouleth" element={<TestRouleth />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
