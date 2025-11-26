import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import { MultiplayerProvider } from "./context/MultiplayerContext";
import { Toaster } from "./components/ui/toaster";
import Tutorial from "./components/Tutorial";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Levels from "./pages/Levels";
import Puzzle from "./pages/Puzzle";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import Categories from "./pages/Categories";
import CategoryPuzzles from "./pages/CategoryPuzzles";
import DailyChallenge from "./pages/DailyChallenge";
import TimeAttack from "./pages/TimeAttack";
import ProgressAnalytics from "./pages/ProgressAnalytics";
import Themes from "./pages/Themes";
import WeeklyTournament from "./pages/WeeklyTournament";
import Premium from "./pages/Premium";
import FriendChallenge from "./pages/FriendChallenge";
import DailyRewards from "./pages/DailyRewards";
import AdReward from "./pages/AdReward";
import Multiplayer from "./pages/Multiplayer";
import MultiplayerGame from "./pages/MultiplayerGame";
import PuzzleCreator from "./pages/PuzzleCreator";
import CommunityPuzzles from "./pages/CommunityPuzzles";
import AIPuzzleGenerator from "./pages/AIPuzzleGenerator";

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <MultiplayerProvider>
          <div className="App">
            <BrowserRouter>
            <Tutorial />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:categoryId" element={<CategoryPuzzles />} />
              <Route path="/levels" element={<Levels />} />
              <Route path="/puzzle/:id" element={<Puzzle />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/daily-challenge" element={<DailyChallenge />} />
              <Route path="/time-attack" element={<TimeAttack />} />
              <Route path="/progress" element={<ProgressAnalytics />} />
              <Route path="/themes" element={<Themes />} />
              <Route path="/tournament" element={<WeeklyTournament />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/challenges" element={<FriendChallenge />} />
              <Route path="/daily-rewards" element={<DailyRewards />} />
              <Route path="/ad-rewards" element={<AdReward />} />
              <Route path="/multiplayer" element={<Multiplayer />} />
              <Route path="/multiplayer-game/:roomId" element={<MultiplayerGame />} />
              <Route path="/puzzle-creator" element={<PuzzleCreator />} />
              <Route path="/community-puzzles" element={<CommunityPuzzles />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </div>
        </MultiplayerProvider>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
