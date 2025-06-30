
import React, { useState, useEffect } from 'react';
import { Onboarding } from '@/components/Onboarding';
import { GameInterface } from '@/components/GameInterface';
import { Leaderboard } from '@/components/Leaderboard';
import { AdSpace } from '@/components/AdSpace';

export interface Player {
  id: string;
  username: string;
  country: string;
  profilePicture: string;
  bestScore: number;
  rank?: number;
}

export interface GameAttempt {
  score: number;
  attempt: number;
}

const Index = () => {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [activeTab, setActiveTab] = useState<'compete' | 'leaderboard'>('compete');
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameHistory, setGameHistory] = useState<GameAttempt[]>([]);

  useEffect(() => {
    // Load players from localStorage
    const savedPlayers = localStorage.getItem('circleGamePlayers');
    if (savedPlayers) {
      const parsedPlayers = JSON.parse(savedPlayers);
      setPlayers(parsedPlayers);
    }
  }, []);

  const savePlayer = (player: Player) => {
    const updatedPlayers = [...players];
    const existingPlayerIndex = updatedPlayers.findIndex(p => p.id === player.id);
    
    if (existingPlayerIndex >= 0) {
      updatedPlayers[existingPlayerIndex] = player;
    } else {
      updatedPlayers.push(player);
    }
    
    // Sort by best score and assign ranks
    updatedPlayers.sort((a, b) => b.bestScore - a.bestScore);
    updatedPlayers.forEach((p, index) => {
      p.rank = index + 1;
    });
    
    setPlayers(updatedPlayers);
    localStorage.setItem('circleGamePlayers', JSON.stringify(updatedPlayers));
  };

  const updatePlayerScore = (newScore: number) => {
    if (currentPlayer && newScore > currentPlayer.bestScore) {
      const updatedPlayer = { ...currentPlayer, bestScore: newScore };
      setCurrentPlayer(updatedPlayer);
      savePlayer(updatedPlayer);
    }
  };

  if (!currentPlayer) {
    return <Onboarding onComplete={setCurrentPlayer} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
            Perfect Circle
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mt-2 font-mono">
            Draw the perfect circle and climb the leaderboard!
          </p>
        </header>

        {/* Ad Space Top */}
        <AdSpace position="top" />

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-full p-2 border border-purple-500/30">
            <button
              onClick={() => setActiveTab('compete')}
              className={`px-6 py-3 rounded-full font-mono font-bold transition-all duration-300 ${
                activeTab === 'compete'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              COMPETE
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-3 rounded-full font-mono font-bold transition-all duration-300 ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              LEADERBOARD
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Ad Space */}
          <div className="hidden lg:block">
            <AdSpace position="left" />
          </div>

          {/* Game Area */}
          <div className="lg:col-span-2">
            {activeTab === 'compete' ? (
              <GameInterface
                player={currentPlayer}
                onScoreUpdate={updatePlayerScore}
                gameHistory={gameHistory}
                setGameHistory={setGameHistory}
              />
            ) : (
              <Leaderboard players={players} currentPlayer={currentPlayer} />
            )}
          </div>

          {/* Right Ad Space */}
          <div className="hidden lg:block">
            <AdSpace position="right" />
          </div>
        </div>

        {/* Bottom Ad Space */}
        <AdSpace position="bottom" />
      </div>
    </div>
  );
};

export default Index;
