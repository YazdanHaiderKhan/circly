
import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { Player } from '@/pages/Index';

interface LeaderboardProps {
  players: Player[];
  currentPlayer: Player;
}

const countries = {
  'US': { name: 'United States', flag: '🇺🇸' },
  'GB': { name: 'United Kingdom', flag: '🇬🇧' },
  'DE': { name: 'Germany', flag: '🇩🇪' },
  'FR': { name: 'France', flag: '🇫🇷' },
  'JP': { name: 'Japan', flag: '🇯🇵' },
  'CA': { name: 'Canada', flag: '🇨🇦' },
  'AU': { name: 'Australia', flag: '🇦🇺' },
  'BR': { name: 'Brazil', flag: '🇧🇷' },
  'IN': { name: 'India', flag: '🇮🇳' },
  'CN': { name: 'China', flag: '🇨🇳' },
  'ES': { name: 'Spain', flag: '🇪🇸' },
  'IT': { name: 'Italy', flag: '🇮🇹' },
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ players, currentPlayer }) => {
  const sortedPlayers = [...players].sort((a, b) => b.bestScore - a.bestScore);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number, isCurrentPlayer: boolean) => {
    let baseStyle = "flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ";
    
    if (isCurrentPlayer) {
      baseStyle += "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-400 ";
    } else {
      baseStyle += "bg-black/30 border border-purple-500/20 hover:bg-purple-500/10 ";
    }

    if (rank <= 3) {
      baseStyle += "shadow-lg ";
    }

    return baseStyle;
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/30">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          🏆 LEADERBOARD 🏆
        </h2>
        <p className="text-gray-400 mt-2 font-mono">Top Circle Masters</p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedPlayers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No scores yet!</p>
            <p className="text-gray-500 text-sm mt-2">Be the first to set a score</p>
          </div>
        ) : (
          sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const isCurrentPlayer = player.id === currentPlayer.id;
            const countryInfo = countries[player.country as keyof typeof countries];

            return (
              <div
                key={player.id}
                className={getRankStyle(rank, isCurrentPlayer)}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(rank)}
                </div>

                {/* Profile Picture */}
                <img
                  src={player.profilePicture}
                  alt={player.username}
                  className={`w-12 h-12 rounded-full object-cover border-2 ${
                    isCurrentPlayer ? 'border-purple-400' : 'border-gray-600'
                  }`}
                />

                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-bold ${isCurrentPlayer ? 'text-white' : 'text-gray-200'}`}>
                      {player.username}
                      {isCurrentPlayer && (
                        <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                          YOU
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>{countryInfo?.flag}</span>
                    <span>{countryInfo?.name}</span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className={`text-xl font-bold ${
                    rank === 1 ? 'text-yellow-400' :
                    rank === 2 ? 'text-gray-300' :
                    rank === 3 ? 'text-amber-600' :
                    'text-gray-400'
                  }`}>
                    {player.bestScore}
                  </div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Current Player Stats */}
      {sortedPlayers.length > 0 && (
        <div className="mt-6 pt-6 border-t border-purple-500/30">
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-2">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">
                  #{sortedPlayers.findIndex(p => p.id === currentPlayer.id) + 1}
                </div>
                <div className="text-sm text-gray-400">Rank</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">
                  {currentPlayer.bestScore}
                </div>
                <div className="text-sm text-gray-400">Best Score</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
