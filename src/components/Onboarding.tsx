
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, User, Globe } from 'lucide-react';
import { Player } from '@/pages/Index';

interface OnboardingProps {
  onComplete: (player: Player) => void;
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

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleSubmit = () => {
    if (username && country && profilePicture) {
      const player: Player = {
        id: Date.now().toString(),
        username,
        country,
        profilePicture,
        bestScore: 0,
      };
      onComplete(player);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return username.trim().length > 0;
      case 2: return profilePicture.length > 0;
      case 3: return country.length > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Welcome Player!
          </h1>
          <p className="text-gray-400 font-mono">Step {currentStep} of 3</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                  step <= currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h2 className="text-xl font-bold text-white mb-2">Choose your username</h2>
              <p className="text-gray-400 text-sm">This will be displayed on the leaderboard</p>
            </div>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/50 border-purple-500/50 text-white placeholder-gray-400 text-center text-lg font-mono"
              maxLength={20}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h2 className="text-xl font-bold text-white mb-2">Upload your avatar</h2>
              <p className="text-gray-400 text-sm">Choose a profile picture to represent you</p>
            </div>
            
            {profilePicture ? (
              <div className="text-center">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto border-4 border-purple-500 object-cover"
                />
                <Button
                  onClick={() => setProfilePicture('')}
                  variant="outline"
                  className="mt-4 border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                >
                  Change Photo
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="w-24 h-24 rounded-full border-4 border-dashed border-purple-500/50 flex items-center justify-center mx-auto hover:border-purple-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                </label>
                <p className="text-gray-400 text-sm mt-2">Click to upload</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h2 className="text-xl font-bold text-white mb-2">Select your country</h2>
              <p className="text-gray-400 text-sm">Show your national pride on the leaderboard</p>
            </div>
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
        )}

        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="outline"
              className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
            >
              Back
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold disabled:opacity-50"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold disabled:opacity-50"
            >
              Start Playing!
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
