
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { Player, GameAttempt } from '@/pages/Index';

interface ShareModalProps {
  player: Player;
  bestScore: number;
  attempts: GameAttempt[];
  onClose: () => void;
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

export const ShareModal: React.FC<ShareModalProps> = ({
  player,
  bestScore,
  attempts,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countryInfo = countries[player.country as keyof typeof countries];

  useEffect(() => {
    generateShareCard();
  }, []);

  const generateShareCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(0.5, '#4c1d95');
    gradient.addColorStop(1, '#0f0f23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Perfect Circle', 400, 80);

    // Subtitle
    ctx.fillStyle = '#a855f7';
    ctx.font = '24px monospace';
    ctx.fillText('Challenge Result', 400, 120);

    // Player info section
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Player: ${player.username}`, 100, 200);
    
    ctx.font = '24px monospace';
    ctx.fillText(`Country: ${countryInfo?.flag} ${countryInfo?.name}`, 100, 240);

    // Score section
    ctx.textAlign = 'center';
    ctx.fillStyle = bestScore >= 90 ? '#10b981' : bestScore >= 75 ? '#f59e0b' : '#ef4444';
    ctx.font = 'bold 64px monospace';
    ctx.fillText(`${bestScore}/100`, 400, 320);

    ctx.fillStyle = '#a855f7';
    ctx.font = '24px monospace';
    ctx.fillText('BEST SCORE', 400, 360);

    // Attempts section
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('Attempts:', 400, 420);

    attempts.forEach((attempt, index) => {
      const x = 250 + (index * 100);
      const y = 480;
      
      // Attempt box
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 40, y - 30, 80, 60);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`#${attempt.attempt}`, x, y - 10);
      ctx.fillText(`${attempt.score}`, x, y + 10);
    });

    // Footer
    ctx.fillStyle = '#6b7280';
    ctx.font = '18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Play at Perfect Circle Game', 400, 550);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `perfect-circle-${player.username}-${bestScore}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareToTwitter = () => {
    const text = `I just scored ${bestScore}/100 in the Perfect Circle Challenge! 🎯 Can you beat my score? ${countryInfo?.flag}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct sharing via URL, so we'll provide instructions
    downloadImage();
    alert('Image downloaded! You can now upload it to your Instagram story or post.');
  };

  const copyToClipboard = () => {
    const text = `🎯 I scored ${bestScore}/100 in the Perfect Circle Challenge! ${countryInfo?.flag}\n\nCan you draw a better circle? Try it now!`;
    navigator.clipboard.writeText(text);
    alert('Text copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/90 rounded-3xl p-6 max-w-2xl w-full border border-purple-500/30 relative">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Share Your Score!</h2>
          <p className="text-gray-400">Show off your circle-drawing skills</p>
        </div>

        {/* Preview Canvas */}
        <div className="flex justify-center mb-6">
          <canvas
            ref={canvasRef}
            className="border border-purple-500/30 rounded-lg max-w-full h-auto"
            style={{ maxHeight: '300px' }}
          />
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={shareToTwitter}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </Button>

          <Button
            onClick={shareToInstagram}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </Button>

          <Button
            onClick={downloadImage}
            variant="outline"
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
          >
            📋 Copy
          </Button>
        </div>
      </div>
    </div>
  );
};
