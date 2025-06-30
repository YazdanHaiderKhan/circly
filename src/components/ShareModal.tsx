import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Share2 } from 'lucide-react';
import { Player, GameAttempt } from '@/pages/Index';

interface ShareModalProps {
  player: Player;
  bestScore: number;
  attempts: GameAttempt[];
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ player, bestScore, attempts, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateShareImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(0.5, '#1e1b4b');
    gradient.addColorStop(1, '#0f0f23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Add decorative circles
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(150, 150, 80, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(650, 450, 100, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Perfect Circle Challenge', 400, 80);

    // Subtitle
    ctx.fillStyle = '#a855f7';
    ctx.font = '24px Arial';
    ctx.fillText('Final Score Results', 400, 120);

    // Player info section
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Player: ${player.username}`, 80, 180);

    // Country flag and name
    ctx.font = '24px Arial';
    ctx.fillStyle = '#d1d5db';
    ctx.fillText(`Country: ${player.country}`, 80, 220);

    // Score display
    ctx.fillStyle = bestScore >= 90 ? '#10b981' : bestScore >= 75 ? '#f59e0b' : bestScore >= 50 ? '#f97316' : '#ef4444';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${bestScore}`, 400, 320);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.fillText('Final Score', 400, 360);

    // Attempts breakdown
    ctx.fillStyle = '#d1d5db';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Attempts:', 80, 420);
    
    attempts.forEach((attempt, index) => {
      ctx.fillStyle = '#a855f7';
      ctx.fillText(`${attempt.attempt}: ${attempt.score} pts`, 80 + (index * 150), 450);
    });

    // Score calculation note
    ctx.fillStyle = '#9ca3af';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Score based on: Highest Score (40%) + Average (30%) + Consistency (20%) + Attempt Bonus', 400, 520);

    // Branding
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('perfectcircle.game', 400, 560);

    return canvas.toDataURL('image/png');
  };

  const shareToTwitter = () => {
    const imageData = generateShareImage();
    const text = `I scored ${bestScore}/100 in the Perfect Circle Challenge! 🎯\n\nCan you draw a better circle?\n\n#PerfectCircle #GameChallenge`;
    
    // Create a link element to download the image
    const link = document.createElement('a');
    link.download = 'perfect-circle-score.png';
    link.href = imageData;
    link.click();
    
    // Open Twitter with the text
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToInstagram = () => {
    const imageData = generateShareImage();
    
    // Create a link element to download the image
    const link = document.createElement('a');
    link.download = 'perfect-circle-score.png';
    link.href = imageData;
    link.click();
    
    // Show instructions
    alert('Image downloaded! Open Instagram and upload this image to share your score.');
  };

  const downloadImage = () => {
    const imageData = generateShareImage();
    const link = document.createElement('a');
    link.download = 'perfect-circle-score.png';
    link.href = imageData;
    link.click();
  };

  const getScoreMessage = (score: number) => {
    if (score >= 95) return 'PERFECT MASTER!';
    if (score >= 90) return 'CIRCLE LEGEND!';
    if (score >= 75) return 'GREAT ARTIST!';
    if (score >= 50) return 'GOOD EFFORT!';
    return 'KEEP PRACTICING!';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/90 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Share Your Score
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src={player.profilePicture}
              alt={player.username}
              className="w-16 h-16 rounded-full border-2 border-purple-500"
            />
            <div>
              <h3 className="text-xl font-bold text-white">{player.username}</h3>
              <p className="text-gray-400">{player.country}</p>
            </div>
          </div>
          
          <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30 mb-4">
            <div className="text-4xl font-bold text-cyan-400 mb-2">{bestScore}/100</div>
            <div className="text-lg text-white font-mono">{getScoreMessage(bestScore)}</div>
            <div className="text-sm text-gray-400 mt-2">Final Score</div>
          </div>

          <div className="text-sm text-gray-400 mb-4">
            Based on {attempts.length} attempt{attempts.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={shareToTwitter}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share on Twitter
          </Button>
          
          <Button
            onClick={shareToInstagram}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share on Instagram
          </Button>
          
          <Button
            onClick={downloadImage}
            variant="outline"
            className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Image
          </Button>
        </div>

        <canvas
          ref={canvasRef}
          className="hidden"
          width={800}
          height={600}
        />
      </div>
    </div>
  );
};
