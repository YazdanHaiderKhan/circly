
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Share2 } from 'lucide-react';
import { Player, GameAttempt } from '@/pages/Index';
import { ShareModal } from '@/components/ShareModal';
import { CircleCanvas } from '@/components/CircleCanvas';

interface GameInterfaceProps {
  player: Player;
  onScoreUpdate: (score: number) => void;
  gameHistory: GameAttempt[];
  setGameHistory: React.Dispatch<React.SetStateAction<GameAttempt[]>>;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({
  player,
  onScoreUpdate,
  gameHistory,
  setGameHistory,
}) => {
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [bestAttemptScore, setBestAttemptScore] = useState(0);

  const resetGame = () => {
    setCurrentAttempt(1);
    setIsDrawing(false);
    setCurrentScore(0);
    setGameCompleted(false);
    setGameHistory([]);
    setBestAttemptScore(0);
  };

  const handleCircleComplete = (score: number) => {
    const newAttempt: GameAttempt = {
      score,
      attempt: currentAttempt,
    };
    
    const updatedHistory = [...gameHistory, newAttempt];
    setGameHistory(updatedHistory);
    setCurrentScore(score);
    
    if (score > bestAttemptScore) {
      setBestAttemptScore(score);
      onScoreUpdate(score);
    }

    if (currentAttempt >= 3) {
      setGameCompleted(true);
    } else {
      setCurrentAttempt(currentAttempt + 1);
    }
    setIsDrawing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 95) return 'PERFECT!';
    if (score >= 90) return 'EXCELLENT!';
    if (score >= 75) return 'GREAT!';
    if (score >= 50) return 'GOOD!';
    return 'KEEP TRYING!';
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/30">
      {/* Player Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={player.profilePicture}
            alt={player.username}
            className="w-12 h-12 rounded-full border-2 border-purple-500"
          />
          <div>
            <h3 className="font-bold text-white">{player.username}</h3>
            <p className="text-sm text-gray-400">Best: {player.bestScore} pts</p>
          </div>
        </div>
        
        {gameCompleted && (
          <Button
            onClick={() => setShowShareModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
      </div>

      {/* Game Status */}
      <div className="text-center mb-6">
        {!gameCompleted ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Attempt {currentAttempt} of 3
            </h2>
            <p className="text-gray-400 font-mono">
              {isDrawing ? 'Draw your circle!' : 'Click to start drawing'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Game Complete!</h2>
            <p className={`text-3xl font-bold ${getScoreColor(bestAttemptScore)}`}>
              {getScoreMessage(bestAttemptScore)}
            </p>
            <p className="text-gray-400">Best Score: {bestAttemptScore}/100</p>
          </div>
        )}
      </div>

      {/* Canvas */}
      <CircleCanvas
        onCircleComplete={handleCircleComplete}
        isActive={!gameCompleted && currentAttempt <= 3}
        attemptNumber={currentAttempt}
        onDrawingStart={() => setIsDrawing(true)}
      />

      {/* Score Display */}
      {currentScore > 0 && (
        <div className="text-center mt-4">
          <div className={`text-4xl font-bold ${getScoreColor(currentScore)} animate-scale-in`}>
            {currentScore}/100
          </div>
        </div>
      )}

      {/* Attempt History */}
      {gameHistory.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-white mb-3">Your Attempts</h3>
          <div className="grid grid-cols-3 gap-4">
            {gameHistory.map((attempt, index) => (
              <div
                key={index}
                className="bg-purple-500/20 rounded-lg p-3 text-center border border-purple-500/30"
              >
                <div className="text-sm text-gray-400">Attempt {attempt.attempt}</div>
                <div className={`text-xl font-bold ${getScoreColor(attempt.score)}`}>
                  {attempt.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      {gameCompleted && (
        <div className="text-center mt-6">
          <Button
            onClick={resetGame}
            variant="outline"
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          player={player}
          bestScore={bestAttemptScore}
          attempts={gameHistory}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
