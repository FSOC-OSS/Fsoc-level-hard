// VoiceSettings.jsx - Settings modal component
import React from 'react'

const VoiceSettings = ({ isOpen, onClose, voiceSettings, availableVoices, onUpdateSettings }) => {
  if (!isOpen) return null

  const handleSettingChange = (key, value) => {
    onUpdateSettings({ [key]: value })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Voice Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Voice
            </label>
            <select
              value={voiceSettings.voice}
              onChange={(e) => handleSettingChange('voice', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
            >
              {availableVoices.map((voice, index) => (
                <option key={index} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Speech Rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Speech Rate: <span className="text-purple-600">{voiceSettings.rate.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.rate}
              onChange={(e) => handleSettingChange('rate', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((voiceSettings.rate - 0.5) / 1.5) * 100}%, #e5e7eb ${((voiceSettings.rate - 0.5) / 1.5) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5x</span>
              <span>2.0x</span>
            </div>
          </div>

          {/* Pitch */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pitch: <span className="text-purple-600">{voiceSettings.pitch.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.pitch}
              onChange={(e) => handleSettingChange('pitch', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((voiceSettings.pitch - 0.5) / 1.5) * 100}%, #e5e7eb ${((voiceSettings.pitch - 0.5) / 1.5) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5</span>
              <span>2.0</span>
            </div>
          </div>

          {/* Volume */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Volume: <span className="text-purple-600">{Math.round(voiceSettings.volume * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voiceSettings.volume}
              onChange={(e) => handleSettingChange('volume', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${voiceSettings.volume * 100}%, #e5e7eb ${voiceSettings.volume * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => {
              handleSettingChange('rate', 1.0)
              handleSettingChange('pitch', 1.0)
              handleSettingChange('volume', 1.0)
            }}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default VoiceSettings