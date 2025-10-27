import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Rouleth from "./Rouleth";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Rouleth />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
