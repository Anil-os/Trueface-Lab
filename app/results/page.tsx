'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScorePanel from '@/components/ScorePanel';
import FaceMeshCanvas from '@/components/FaceMeshCanvas';
import { SymmetryBackground } from '@/components/SymmetryBackground';
import { HarmonyScore, FaceLandmarks } from '@/lib/faceMath';

interface CapturedData {
  image: string;
  score: HarmonyScore;
  landmarks: FaceLandmarks[];
  canvasSize: { width: number; height: number };
}

export default function ResultsPage() {
  const router = useRouter();
  const [capturedData, setCapturedData] = useState<CapturedData | null>(null);
  const [showMesh, setShowMesh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve captured data from sessionStorage
    const dataString = sessionStorage.getItem('capturedFaceData');
    if (dataString) {
      try {
        const data = JSON.parse(dataString);
        setCapturedData(data);
      } catch (error) {
        console.error('Failed to parse captured data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleDownload = () => {
    if (!capturedData) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = capturedData.canvasSize.width;
    canvas.height = capturedData.canvasSize.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, capturedData.canvasSize.width, capturedData.canvasSize.height);
      
      // Add score overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(20, 20, 350, 200);
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, 350, 200);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('TrueFace Lab Analysis', 40, 60);
      
      const scoreColor = capturedData.score.overall >= 80 ? '#22c55e' : 
                        capturedData.score.overall >= 60 ? '#eab308' : '#ef4444';
      ctx.fillStyle = scoreColor;
      ctx.font = 'bold 56px sans-serif';
      ctx.fillText(capturedData.score.overall.toString(), 40, 125);
      
      ctx.fillStyle = '#d1d5db';
      ctx.font = '18px sans-serif';
      ctx.fillText(`Proportions: ${capturedData.score.faceRatio}  •  Eyes: ${capturedData.score.eyeRatio}`, 40, 160);
      ctx.fillText(`Symmetry: ${capturedData.score.symmetry}  •  ${capturedData.score.features.faceShape}`, 40, 190);
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `trueface-analysis-${Date.now()}.png`;
      link.click();
    };
    
    img.src = capturedData.image;
  };

  const handleNewScan = () => {
    sessionStorage.removeItem('capturedFaceData');
    router.push('/scan');
  };

  const handleBackHome = () => {
    sessionStorage.removeItem('capturedFaceData');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading results...</div>
      </div>
    );
  }

  if (!capturedData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">No scan data found</div>
          <button
            onClick={() => router.push('/scan')}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Start New Scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-2 sm:p-4 md:p-8 relative overflow-hidden">
      {/* Symmetry Engine Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <SymmetryBackground />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2" style={{textShadow: '0 0 20px rgba(0,0,0,0.8)'}}>
            Your Analysis Results
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-300" style={{textShadow: '0 0 15px rgba(0,0,0,0.8)'}}>
            Complete facial analysis based on your capture
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Captured Image - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={capturedData.image} 
                alt="Captured face analysis" 
                className="w-full h-full object-cover"
              />
              
              {/* Face Mesh Overlay */}
              {showMesh && capturedData.landmarks && (
                <FaceMeshCanvas
                  width={capturedData.canvasSize.width}
                  height={capturedData.canvasSize.height}
                  landmarks={capturedData.landmarks}
                  showMesh={showMesh}
                />
              )}

              {/* Analysis Complete Badge */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg font-semibold flex items-center gap-2 text-xs sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">Analysis Complete</span>
                <span className="sm:hidden">Complete</span>
              </div>

              {/* Overall Score Badge */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 px-4 sm:px-6 py-2 sm:py-3 bg-black/70 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-bold text-center border-2 border-white/30">
                <div className="text-2xl sm:text-3xl">{capturedData.score.overall}</div>
                <div className="text-[10px] sm:text-xs text-gray-300">Harmony</div>
              </div>

              {/* Toggle Mesh Button */}
              <button
                onClick={() => setShowMesh(!showMesh)}
                className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm text-white rounded-lg transition-colors text-xs sm:text-sm touch-manipulation"
              >
                {showMesh ? 'Hide' : 'Show'} Mesh
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
              <button
                onClick={handleDownload}
                className="px-5 sm:px-6 py-3 bg-white hover:bg-gray-200 active:bg-gray-300 text-black rounded-lg sm:rounded-xl transition-all font-medium sm:font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transform active:scale-95 touch-manipulation min-h-[48px]"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Result
              </button>
              <button
                onClick={handleNewScan}
                className="px-5 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg sm:rounded-xl transition-colors font-medium sm:font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transform active:scale-95 touch-manipulation min-h-[48px]"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                New Scan
              </button>
              <button
                onClick={handleBackHome}
                className="px-5 sm:px-6 py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg sm:rounded-xl transition-colors font-medium sm:font-semibold text-sm sm:text-base text-center min-h-[48px] flex items-center justify-center touch-manipulation"
              >
                ← Back to Home
              </button>
            </div>
          </div>

          {/* Score Panel - Takes 1 column */}
          <div className="lg:col-span-1">
            <ScorePanel 
              score={capturedData.score}
              isDetecting={true}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 sm:mt-8 text-center text-gray-400 text-xs space-y-2 px-4">
          <p>
            Analysis based on golden ratio (φ ≈ 1.618) and advanced facial feature detection.
            Results are for informational and entertainment purposes only.
          </p>
          <p>
            Made By Anil • All rights reserved @2026
          </p>
        </div>
      </div>
    </div>
  );
}
