import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import multiplayerService from '../services/multiplayerService';

const MultiplayerContext = createContext();

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within MultiplayerProvider');
  }
  return context;
};

export const MultiplayerProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [inMatchmaking, setInMatchmaking] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [activePlayers, setActivePlayers] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to multiplayer server
      const socket = multiplayerService.connect(user.id, user.name, user.avatar);

      socket.on('connected', () => {
        setIsConnected(true);
        multiplayerService.getActivePlayers();
      });

      socket.on('matchmaking_joined', (data) => {
        setInMatchmaking(true);
      });

      socket.on('matchmaking_left', () => {
        setInMatchmaking(false);
      });

      socket.on('match_found', (data) => {
        setInMatchmaking(false);
        setCurrentGame({
          roomId: data.room_id,
          roomCode: data.room_code,
          puzzleId: data.puzzle_id
        });
        setOpponent(data.opponent);
      });

      socket.on('game_start', (data) => {
        setCurrentGame(prev => ({ ...prev, started: true }));
      });

      socket.on('game_results', (data) => {
        setCurrentGame(prev => ({ ...prev, results: data }));
      });

      socket.on('player_disconnected', (data) => {
        console.log('Player disconnected:', data);
      });

      socket.on('active_players_count', (data) => {
        setActivePlayers(data.count);
      });

      return () => {
        multiplayerService.disconnect();
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, user]);

  const joinMatchmaking = () => {
    if (user) {
      multiplayerService.joinMatchmaking(user.id, user.name, user.avatar);
    }
  };

  const leaveMatchmaking = () => {
    if (user) {
      multiplayerService.leaveMatchmaking(user.id);
      setInMatchmaking(false);
    }
  };

  const playerReady = () => {
    if (user && currentGame) {
      multiplayerService.playerReady(currentGame.roomId, user.id);
    }
  };

  const sendMove = (moveData) => {
    if (user && currentGame) {
      multiplayerService.sendMove(currentGame.roomId, user.id, moveData);
    }
  };

  const completeGame = (score, timeTaken) => {
    if (user && currentGame) {
      multiplayerService.gameComplete(currentGame.roomId, user.id, score, timeTaken);
    }
  };

  const leaveGame = () => {
    setCurrentGame(null);
    setOpponent(null);
  };

  const value = {
    isConnected,
    inMatchmaking,
    currentGame,
    opponent,
    activePlayers,
    joinMatchmaking,
    leaveMatchmaking,
    playerReady,
    sendMove,
    completeGame,
    leaveGame
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};
