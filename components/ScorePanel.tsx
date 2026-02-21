'use client';

import React from 'react';
import { HarmonyScore, getScoreColor, getScoreBgColor, getScoreLabel } from '@/lib/faceMath';

interface ScorePanelProps {
  score: HarmonyScore | null;
  isDetecting: boolean;
}

export default function ScorePanel({ score, isDetecting }: ScorePanelProps) {
  const displayScore = score?.overall || 0;
  const scoreColor = getScoreColor(displayScore);
  const scoreBgColor = getScoreBgColor(displayScore);
  const scoreLabel = getScoreLabel(displayScore);

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 max-h-[85vh] overflow-y-auto overscroll-contain">
      {/* Main Score Display */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="relative inline-block">
          <svg className="w-36 h-36 sm:w-48 sm:h-48 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-gray-700 sm:hidden"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-700 hidden sm:block"
            />
            {/* Progress circle */}
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - displayScore / 100)}`}
              className={`transition-all duration-500 ${scoreColor} sm:hidden`}
              strokeLinecap="round"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 80}`}
              strokeDashoffset={`${2 * Math.PI * 80 * (1 - displayScore / 100)}`}
              className={`transition-all duration-500 ${scoreColor} hidden sm:block`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-4xl sm:text-5xl font-bold ${scoreColor} transition-colors duration-300`}>
              {displayScore}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1">
              Harmony Score
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        {isDetecting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">
              Face Detected
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-400">
              Looking for face...
            </span>
          </div>
        )}
      </div>

      {/* Score Label */}
      {score && (
        <div className="text-center mb-6">
          <div className={`inline-block px-4 py-2 rounded-full ${scoreBgColor} text-white font-semibold`}>
            {scoreLabel}
          </div>
        </div>
      )}

      {/* Detailed Scores */}
      {score && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-300 mb-2">
            Component Scores
          </div>
          
          <ScoreBar
            label="Face Proportions"
            score={score.faceRatio}
            description="Height to width ratio"
          />
          
          <ScoreBar
            label="Eye Spacing"
            score={score.eyeRatio}
            description="Face width to eye distance"
          />
          
          <ScoreBar
            label="Symmetry"
            score={score.symmetry}
            description="Facial alignment"
          />
        </div>
      )}

      {/* Mood Detection */}
      {score?.mood && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <span>😊</span>
            <span>Mood Detection</span>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getMoodEmoji(score.mood.dominant)}</span>
                <div>
                  <div className="text-lg font-semibold text-white">{score.mood.dominant}</div>
                  <div className="text-xs text-gray-400">Detected Emotion</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-400">{score.mood.confidence}%</div>
                <div className="text-xs text-gray-400">Confidence</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <MoodBar label="Happy" score={score.mood.scores.happy} emoji="😊" />
            <MoodBar label="Neutral" score={score.mood.scores.neutral} emoji="😐" />
            <MoodBar label="Surprised" score={score.mood.scores.surprised} emoji="😮" />
            <MoodBar label="Sad" score={score.mood.scores.sad} emoji="😢" />
            <MoodBar label="Angry" score={score.mood.scores.angry} emoji="😠" />
          </div>
        </div>
      )}

      {/* Jawline Analysis */}
      {score?.jawline && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <span>📐</span>
            <span>Jawline Analysis</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <MetricCard 
              label="Definition" 
              value={score.jawline.definition}
              unit="%"
            />
            <MetricCard 
              label="Sharpness" 
              value={score.jawline.sharpness}
              unit="%"
            />
            <MetricCard 
              label="Jaw Angle" 
              value={score.jawline.jawAngle}
              unit="°"
            />
            <MetricCard 
              label="Chin" 
              value={score.jawline.chinProminence}
              unit="%"
            />
          </div>
        </div>
      )}

      {/* Facial Features */}
      {score?.features && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <span>✨</span>
            <span>Facial Features</span>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 mb-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{score.features.faceShape}</div>
              <div className="text-xs text-gray-400">Face Shape</div>
            </div>
          </div>

          <div className="space-y-2">
            <FeatureBar label="Cheekbones" score={score.features.cheekboneProminence} />
            <FeatureBar label="Eye Size" score={score.features.eyeSize} />
            <FeatureBar label="Lip Fullness" score={score.features.lipFullness} />
            <FeatureBar label="Nose Bridge" score={score.features.noseBridge} />
            <FeatureBar label="Nose Length" score={score.features.noseLength} />
            <FeatureBar label="Forehead" score={score.features.foreheadHeight} />
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-start gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>All processing happens in your browser. No data is uploaded.</span>
        </div>
      </div>
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  score: number;
  description: string;
}

function ScoreBar({ label, score, description }: ScoreBarProps) {
  const scoreColor = getScoreColor(score);
  const scoreBgColor = getScoreBgColor(score);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div>
          <div className="text-sm font-medium text-gray-300">
            {label}
          </div>
          <div className="text-xs text-gray-400">
            {description}
          </div>
        </div>
        <div className={`text-sm font-bold ${scoreColor}`}>
          {score}
        </div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`${scoreBgColor} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

interface MoodBarProps {
  label: string;
  score: number;
  emoji: string;
}

function MoodBar({ label, score, emoji }: MoodBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{emoji}</span>
          <span className="text-xs text-gray-300">{label}</span>
        </div>
        <span className="text-xs text-gray-400">{score}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
}

function MetricCard({ label, value, unit = '' }: MetricCardProps) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
      <div className="text-2xl font-bold text-blue-400">
        {value}{unit}
      </div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

interface FeatureBarProps {
  label: string;
  score: number;
}

function FeatureBar({ label, score }: FeatureBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-300">{label}</span>
        <span className="text-xs text-gray-400">{score}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div
          className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function getMoodEmoji(mood: string): string {
  const emojiMap: { [key: string]: string } = {
    'Happy': '😊',
    'Sad': '😢',
    'Surprised': '😮',
    'Angry': '😠',
    'Neutral': '😐',
  };
  return emojiMap[mood] || '😐';
}
