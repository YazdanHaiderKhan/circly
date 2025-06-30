
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Settings as SettingsIcon } from 'lucide-react';
import { Player } from '@/pages/Index';

interface SettingsProps {
  player: Player;
  onUpdatePlayer: (updatedPlayer: Player) => void;
  onClose: () => void;
}

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
];

export const Settings: React.FC<SettingsProps> = ({ player, onUpdatePlayer, onClose }) => {
  const [username, setUsername] = useState(player.username);
  const [country, setCountry] = useState(player.country);
  const [profilePicture, setProfilePicture] = useState(player.profilePicture);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (username.trim() && country && profilePicture) {
      setIsLoading(true);
      const updatedPlayer = {
        ...player,
        username: username.trim(),
        country,
        profilePicture,
      };
      onUpdatePlayer(updatedPlayer);
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 500);
    }
  };

  const canSave = username.trim().length > 0 && country && profilePicture;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/90 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Profile Settings
            </h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-300 mb-3">Profile Picture</label>
            <div className="flex flex-col items-center gap-4">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-purple-500 object-cover"
              />
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-colors">
                  <Upload className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400 font-mono">Change Photo</span>
                </div>
              </label>
            </div>
          </div>

          {/* Username Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/50 border-purple-500/50 text-white placeholder-gray-400 font-mono"
              maxLength={20}
            />
          </div>

          {/* Country Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="bg-black/50 border-purple-500/50 text-white font-mono">
                <SelectValue placeholder="Choose your country" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-purple-500/50">
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code} className="text-white hover:bg-purple-500/20">
                    {c.flag} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave || isLoading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};
