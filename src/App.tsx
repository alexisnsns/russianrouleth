import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TestRouleth from "./Rouleth";
import Rouleth from "./Rouleth";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Rouleth />} />
        <Route path="/test-rouleth" element={<TestRouleth />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
