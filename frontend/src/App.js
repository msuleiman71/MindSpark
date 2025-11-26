import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { Toaster } from "./components/ui/toaster";
import Home from "./pages/Home";
import Levels from "./pages/Levels";
import Puzzle from "./pages/Puzzle";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";

function App() {
  return (
    <GameProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/levels" element={<Levels />} />
            <Route path="/puzzle/:id" element={<Puzzle />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </GameProvider>
  );
}

export default App;
