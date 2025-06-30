
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Share2, Info } from 'lucide-react';
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
  const [finalScore, setFinalScore] = useState(0);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  const calculateFinalScore = (attempts: GameAttempt[]): number => {
    if (attempts.length === 0) return 0;

    // Get the highest score
    const highestScore = Math.max(...attempts.map(a => a.score));
    
    // Calculate average score
    const averageScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
    
    // Calculate consistency (lower standard deviation = higher consistency)
    const variance = attempts.reduce((sum, a) => sum + Math.pow(a.score - averageScore, 2), 0) / attempts.length;
    const standardDeviation = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 100 - standardDeviation * 2);
    
    // Bonus for using fewer attempts (more points if you get it right early)
    const attemptBonus = attempts.length === 1 ? 20 : attempts.length === 2 ? 10 : 0;
    
    // Final score calculation (weighted formula)
    const finalCalculation = (
      highestScore * 0.4 +           // 40% highest score
      averageScore * 0.3 +           // 30% average performance
      consistencyScore * 0.2 +       // 20% consistency
      attemptBonus                   // Bonus for fewer attempts
    );
    
    return Math.round(Math.min(100, finalCalculation));
  };

  const getScoreBreakdown = (attempts: GameAttempt[]) => {
    if (attempts.length === 0) return null;

    const highestScore = Math.max(...attempts.map(a => a.score));
    const averageScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
    const variance = attempts.reduce((sum, a) => sum + Math.pow(a.score - averageScore, 2), 0) / attempts.length;
    const standardDeviation = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 100 - standardDeviation * 2);
    const attemptBonus = attempts.length === 1 ? 20 : attempts.length === 2 ? 10 : 0;

    return {
      highestScore,
      averageScore: Math.round(averageScore),
      consistencyScore: Math.round(consistencyScore),
      attemptBonus,
      attempts: attempts.length
    };
  };

  const resetGame = () => {
    setCurrentAttempt(1);
    setIsDrawing(false);
    setCurrentScore(0);
    setGameCompleted(false);
    setGameHistory([]);
    setFinalScore(0);
    setShowScoreBreakdown(false);
  };

  const handleCircleComplete = (score: number) => {
    const newAttempt: GameAttempt = {
      score,
      attempt: currentAttempt,
    };
    
    const updatedHistory = [...gameHistory, newAttempt];
    setGameHistory(updatedHistory);
    setCurrentScore(score);

    if (currentAttempt >= 3) {
      const calculatedFinalScore = calculateFinalScore(updatedHistory);
      setFinalScore(calculatedFinalScore);
      setGameCompleted(true);
      onScoreUpdate(calculatedFinalScore);
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
    if (score >= 95) return 'PERFECT MASTER!';
    if (score >= 90) return 'CIRCLE LEGEND!';
    if (score >= 75) return 'GREAT WORK!';
    if (score >= 50) return 'GOOD EFFORT!';
    return 'KEEP PRACTICING!';
  };

  const breakdown = getScoreBreakdown(gameHistory);

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
            <p className={`text-3xl font-bold ${getScoreColor(finalScore)}`}>
              {getScoreMessage(finalScore)}
            </p>
            <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-gray-300">Final Score:</span>
                <span className={`text-2xl font-bold ${getScoreColor(finalScore)}`}>
                  {finalScore}/100
                </span>
                <Button
                  onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
                  variant="ghost"
                  size="sm"
                  className="text-purple-400 hover:text-white"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              
              {showScoreBreakdown && breakdown && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="text-gray-300 font-mono border-b border-purple-500/30 pb-2">
                    <strong>Score Calculation:</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-300">
                    <span>Highest Score (40%):</span>
                    <span className="text-cyan-400">{breakdown.highestScore} pts</span>
                    <span>Average Score (30%):</span>
                    <span className="text-cyan-400">{breakdown.averageScore} pts</span>
                    <span>Consistency (20%):</span>
                    <span className="text-cyan-400">{breakdown.consistencyScore} pts</span>
                    <span>Attempt Bonus:</span>
                    <span className="text-cyan-400">+{breakdown.attemptBonus} pts</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-purple-500/20">
                    Formula: (Highest×0.4 + Average×0.3 + Consistency×0.2 + Bonus)
                  </div>
                </div>
              )}
            </div>
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
      {currentScore > 0 && !gameCompleted && (
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
          bestScore={finalScore}
          attempts={gameHistory}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
