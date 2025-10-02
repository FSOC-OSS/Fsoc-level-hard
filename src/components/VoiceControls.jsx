import React, { useEffect } from 'react'

const VoiceControls = ({ 
  question, 
  onAnswerSelect, 
  selectedAnswer,
  isListening,
  isSpeaking,
  transcript,
  microphonePermission,
  onSpeak,
  onStopSpeaking,
  onStartListening,
  onStopListening,
  onOpenSettings,
  parseVoiceAnswer,
  setTranscript,
  isTimedOut,
  showResult,
  isAnnouncingResult
}) => {
  // Automatically read out the question and options when a new question appears
  useEffect(() => {
    if (question && !selectedAnswer && !isTimedOut && !showResult) {
      const text = `${question.category}. ${question.question}. The options are: ${question.answers.map((ans, idx) => `${String.fromCharCode(65 + idx)}, ${ans}`).join('. ')}`;
      onSpeak(text);
    }
  }, [question?.question]);

  // Listen for voice input and select answer if recognized
  useEffect(() => {
    if (transcript && question && !selectedAnswer && !isTimedOut && !showResult) {
      const answer = parseVoiceAnswer(transcript, question.answers);
      if (answer) {
        onAnswerSelect(answer);
        onSpeak(`You selected ${answer}`);
        setTranscript('');
      } else {
        onSpeak("I didn't understand that. Please say A, B, C, or D, or option A, option B, etc.");
        setTranscript('');
      }
    }
  }, [transcript]);

  // Handle clicking the "read question" button
  const handleSoundClick = () => {
    if (isSpeaking) {
      onStopSpeaking();
    } else if (question && !showResult) {
      const text = `${question.question}. The options are: ${question.answers.map((ans, idx) => `${String.fromCharCode(65 + idx)}, ${ans}`).join('. ')}`;
      onSpeak(text);
    }
  }

  // Handle clicking the microphone button
  const handleMicClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      if (microphonePermission === 'denied') {
        alert('Microphone access denied. Please enable microphone permissions in your browser settings.');
        return;
      }
      onStartListening();
    }
  }

  return (
    <div className="flex gap-2 items-start">
      {/* Speak Question Button */}
      <button
        onClick={handleSoundClick}
        disabled={!question || showResult}
        className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
          isSpeaking
            ? 'bg-green-500 animate-pulse'
            : 'bg-purple-600 hover:bg-purple-700 hover:scale-110'
        } ${(!question || showResult) ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isSpeaking ? 'Stop speaking' : 'Read question aloud'}
      >
        {isSpeaking ? (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h4v12H6V6zm8 0h4v12h-4V6z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        )}
      </button>

      {/* Voice Answer Button */}
      <button
        onClick={handleMicClick}
        disabled={!question || selectedAnswer || isTimedOut || showResult}
        className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
          isListening
            ? 'bg-red-500 animate-pulse'
            : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
        } ${(!question || selectedAnswer || isTimedOut || showResult) ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isListening ? 'Stop listening' : 'Answer by voice'}
      >
        {isListening ? (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            <circle cx="12" cy="12" r="2" fill="white">
              <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" />
            </circle>
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>

      {/* Open Voice Settings */}
      <button
        onClick={onOpenSettings}
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-800 hover:scale-110 transition-all duration-300 shadow-lg"
        title="Voice settings"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
      </button>

      {/* Indicator for active listening */}
      {isListening && (
        <div className="absolute top-full right-0 mt-2 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg animate-pulse whitespace-nowrap">
          🎤 Listening...
        </div>
      )}

      {/* Display the transcript while user is speaking */}
      {transcript && (
        <div className="absolute top-full right-0 mt-2 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg whitespace-nowrap">
          "{transcript}"
        </div>
      )}
    </div>
  )
}

export default VoiceControls