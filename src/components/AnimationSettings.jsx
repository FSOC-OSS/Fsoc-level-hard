// src/components/AnimationSettings.jsx
import React, { useState } from 'react';
import { Settings, Eye, EyeOff, Gauge, Zap, Wind, Turtle } from 'lucide-react';
import { useAnimations } from '../context/AnimationContext';
import { AnimatedModal } from './AnimationWrappers';

const AnimationSettings = () => {
  const { enabled, speed, toggleAnimations, setSpeed } = useAnimations();
  const [isOpen, setIsOpen] = useState(false);

  const speedOptions = [
    { value: 'slow', label: 'Slow', icon: Turtle, emoji: '🐌', description: '1.5x slower' },
    { value: 'normal', label: 'Normal', icon: Wind, emoji: '⚡', description: 'Default speed' },
    { value: 'fast', label: 'Fast', icon: Zap, emoji: '🚀', description: '2x faster' }
  ];

  return (
    <>
      {/* Floating Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full
                   shadow-lg hover:bg-blue-700 transition-all duration-200 
                   hover:scale-110 active:scale-95 z-40 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Animation Settings"
      >
        <Settings 
          size={24} 
          className={enabled ? 'animate-spin-slow' : ''}
        />
      </button>

      {/* Settings Modal */}
      <AnimatedModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Animation Settings"
      >
        <div className="space-y-6">
          {/* Enable/Disable Animations */}
          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {enabled ? (
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye size={24} className="text-blue-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <EyeOff size={24} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">Enable Animations</h4>
                  <p className="text-sm text-gray-600">
                    {enabled 
                      ? 'Animations are currently enabled' 
                      : 'Animations are currently disabled'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleAnimations}
                className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                  enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={enabled ? 'Disable animations' : 'Enable animations'}
              >
                <div 
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full
                             shadow-md transition-transform duration-200 ${
                    enabled ? 'translate-x-7' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>
          </div>

          {/* Animation Speed Control */}
          <div className={`space-y-3 transition-opacity duration-300 ${!enabled && 'opacity-50 pointer-events-none'}`}>
            <div className="flex items-center gap-2">
              <Gauge size={20} className="text-gray-700" />
              <h4 className="font-semibold text-gray-900">Animation Speed</h4>
            </div>
            <p className="text-sm text-gray-600">
              Choose how fast animations should play
            </p>
            <div className="grid grid-cols-3 gap-3">
              {speedOptions.map(option => {
                const Icon = option.icon;
                const isSelected = speed === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => setSpeed(option.value)}
                    disabled={!enabled}
                    className={`p-4 rounded-lg border-2 transition-all duration-200
                               hover:scale-105 active:scale-95 text-center ${
                      isSelected && enabled
                        ? 'border-blue-600 bg-blue-50 scale-105 shadow-md'
                        : 'border-gray-200 hover:border-blue-300'
                    } ${!enabled && 'cursor-not-allowed'}`}
                  >
                    <div className="flex justify-center mb-2">
                      <div className={`p-2 rounded-lg ${isSelected && enabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Icon size={20} className={isSelected && enabled ? 'text-blue-600' : 'text-gray-600'} />
                      </div>
                    </div>
                    <div className={`font-semibold text-sm ${isSelected && enabled ? 'text-blue-900' : 'text-gray-900'}`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    {isSelected && enabled && (
                      <div className="mt-2 flex justify-center">
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Animations */}
          {enabled && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3">Animation Preview</h4>
              <div className="space-y-2">
                <div className="h-8 bg-blue-400 rounded-lg animate-slide-in-right shadow-sm" />
                <div className="h-8 bg-purple-400 rounded-lg animate-slide-in-left shadow-sm" 
                     style={{ animationDelay: '100ms' }} />
                <div className="h-8 bg-pink-400 rounded-lg animate-fade-in-up shadow-sm" 
                     style={{ animationDelay: '200ms' }} />
              </div>
              <p className="text-xs text-gray-600 mt-3 text-center">
                Watch the bars animate at {speed === 'slow' ? 'slow' : speed === 'fast' ? 'fast' : 'normal'} speed
              </p>
            </div>
          )}

          {/* Information */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">About Animations</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Animations enhance user experience with smooth transitions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Settings are saved automatically to your browser</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Respects your system's reduced motion preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Users with motion sensitivity should keep animations disabled</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setSpeed('normal');
                if (!enabled) toggleAnimations();
              }}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium
                       hover:bg-blue-700 transition-all duration-200 
                       hover:scale-105 active:scale-95 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Reset to Default
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium
                       hover:bg-gray-200 transition-all duration-200 
                       hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </AnimatedModal>
    </>
  );
};

export default AnimationSettings;