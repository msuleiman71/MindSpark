import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Levels from "./pages/Levels";
import Puzzle from "./pages/Puzzle";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/puzzle/:id" element={<Puzzle />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
