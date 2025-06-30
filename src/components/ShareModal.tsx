
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

  const generateShareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Set canvas size to match preview
    canvas.width = 400;
    canvas.height = 500;

    // Create dark background like in preview
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 400, 500);

    // Add subtle gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, 400, 500);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 500);

    // Title
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Share Your Score', 200, 40);

    // Load and draw profile picture
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          // Draw circular profile picture
          ctx.save();
          ctx.beginPath();
          ctx.arc(200, 100, 30, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, 170, 70, 60, 60);
          ctx.restore();
          
          // Add border around profile picture
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(200, 100, 30, 0, 2 * Math.PI);
          ctx.stroke();
          
          resolve(true);
        };
        img.onerror = () => {
          // Fallback: draw a circle with initials
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(200, 100, 30, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(player.username.charAt(0).toUpperCase(), 200, 107);
          
          resolve(true);
        };
        img.src = player.profilePicture;
      });
    } catch (error) {
      // Fallback for profile picture
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(200, 100, 30, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(player.username.charAt(0).toUpperCase(), 200, 107);
    }

    // Username
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player.username, 200, 150);

    // Country
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Arial';
    ctx.fillText(`IN`, 200, 170);

    // Score container (purple box)
    ctx.fillStyle = '#6b21a8';
    ctx.fillRect(30, 200, 340, 120);
    
    // Score container border
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 200, 340, 120);

    // Score
    const scoreColor = bestScore >= 90 ? '#10b981' : bestScore >= 75 ? '#60a5fa' : bestScore >= 50 ? '#f59e0b' : '#ef4444';
    ctx.fillStyle = scoreColor;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${bestScore}/100`, 200, 250);

    // Score message
    const scoreMessage = bestScore >= 95 ? 'PERFECT MASTER!' : 
                        bestScore >= 90 ? 'CIRCLE LEGEND!' : 
                        bestScore >= 75 ? 'GREAT WORK!' : 
                        bestScore >= 50 ? 'GOOD EFFORT!' : 'KEEP PRACTICING!';
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(scoreMessage, 200, 280);

    // "Final Score" label
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Arial';
    ctx.fillText('Final Score', 200, 300);

    // Attempts info
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Arial';
    ctx.fillText(`Based on ${attempts.length} attempt${attempts.length > 1 ? 's' : ''}`, 200, 350);

    // Website branding
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('perfectcircle.game', 200, 450);

    return canvas.toDataURL('image/png');
  };

  const shareToTwitter = async () => {
    const imageData = await generateShareImage();
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

  const shareToInstagram = async () => {
    const imageData = await generateShareImage();
    
    // Create a link element to download the image
    const link = document.createElement('a');
    link.download = 'perfect-circle-score.png';
    link.href = imageData;
    link.click();
    
    // Show instructions
    alert('Image downloaded! Open Instagram and upload this image to share your score.');
  };

  const downloadImage = async () => {
    const imageData = await generateShareImage();
    const link = document.createElement('a');
    link.download = 'perfect-circle-score.png';
    link.href = imageData;
    link.click();
  };

  const getScoreMessage = (score: number) => {
    if (score >= 95) return 'PERFECT MASTER!';
    if (score >= 90) return 'CIRCLE LEGEND!';
    if (score >= 75) return 'GREAT WORK!';
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
          width={400}
          height={500}
        />
      </div>
    </div>
  );
};
