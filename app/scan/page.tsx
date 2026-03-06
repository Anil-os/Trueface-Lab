'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CameraView from '@/components/CameraView';
import FaceMeshCanvas from '@/components/FaceMeshCanvas';
import { SymmetryBackground } from '@/components/SymmetryBackground';
import { calculateFacialHarmony, HarmonyScore, FaceLandmarks } from '@/lib/faceMath';

// MediaPipe types
declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}

export default function ScanPage() {
  const router = useRouter();
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });
  const [landmarks, setLandmarks] = useState<FaceLandmarks[] | null>(null);
  const [harmonyScore, setHarmonyScore] = useState<HarmonyScore | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [showMesh, setShowMesh] = useState(true);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const faceMeshRef = useRef<any>(null);
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  const [isMobile] = useState(() => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  // Load MediaPipe scripts
  useEffect(() => {
    const loadScripts = async () => {
      // Check if already loaded
      if (window.FaceMesh && window.Camera) {
        setScriptsLoaded(true);
        return;
      }

      try {
        // Load FaceMesh script
        const faceMeshScript = document.createElement('script');
        faceMeshScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
        faceMeshScript.crossOrigin = 'anonymous';
        
        // Load Camera Utils script
        const cameraScript = document.createElement('script');
        cameraScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
        cameraScript.crossOrigin = 'anonymous';

        // Wait for scripts to load
        await new Promise((resolve, reject) => {
          faceMeshScript.onload = resolve;
          faceMeshScript.onerror = reject;
          document.body.appendChild(faceMeshScript);
        });

        await new Promise((resolve, reject) => {
          cameraScript.onload = resolve;
          cameraScript.onerror = reject;
          document.body.appendChild(cameraScript);
        });

        setScriptsLoaded(true);
      } catch (err) {
        console.error('Failed to load MediaPipe scripts:', err);
        setError('Failed to load face detection library. Please refresh the page.');
      }
    };

    loadScripts();
  }, []);

  // Initialize FaceMesh when video is ready
  useEffect(() => {
    if (!videoElement || !scriptsLoaded || faceMeshRef.current) return;

    const initializeFaceMesh = async () => {
      try {
        const faceMesh = new window.FaceMesh({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          }
        });

        // Use lighter settings on mobile for better performance
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: isMobile ? false : true,
          minDetectionConfidence: isMobile ? 0.6 : 0.5,
          minTrackingConfidence: isMobile ? 0.6 : 0.5
        });

        faceMesh.onResults(onFaceMeshResults);

        // Frame throttling for better performance
        const frameInterval = isMobile ? 100 : 50; // Process every 100ms on mobile, 50ms on desktop
        
        const camera = new window.Camera(videoElement, {
          onFrame: async () => {
            const now = Date.now();
            if (faceMeshRef.current && (now - lastFrameTimeRef.current) >= frameInterval) {
              lastFrameTimeRef.current = now;
              await faceMesh.send({ image: videoElement });
            }
          },
          width: canvasSize.width,
          height: canvasSize.height
        });

        await camera.start();
        faceMeshRef.current = { faceMesh, camera };
      } catch (err) {
        console.error('FaceMesh initialization error:', err);
        setError('Failed to initialize face detection. Please refresh the page.');
      }
    };

    initializeFaceMesh();

    return () => {
      if (faceMeshRef.current) {
        faceMeshRef.current.camera?.stop();
        faceMeshRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoElement, scriptsLoaded, canvasSize.width, canvasSize.height]);

  // Handle FaceMesh results
  const onFaceMeshResults = useCallback((results: any) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const detectedLandmarks = results.multiFaceLandmarks[0];
      setLandmarks(detectedLandmarks);
      setIsDetecting(true);

      // Calculate harmony score
      const score = calculateFacialHarmony(detectedLandmarks);
      setHarmonyScore(score);
    } else {
      setIsDetecting(false);
    }
  }, []);

  // Handle video ready
  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    setVideoElement(video);
    
    // Update canvas size based on video dimensions
    const updateSize = () => {
      if (video.videoWidth && video.videoHeight) {
        setCanvasSize({
          width: video.videoWidth,
          height: video.videoHeight
        });
      }
    };

    video.addEventListener('loadedmetadata', updateSize);
    updateSize();
  }, []);

  // Handle errors
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  // Capture current frame and navigate to results
  const captureFrame = useCallback(() => {
    if (!videoElement || !landmarks || !harmonyScore) {
      setError('Please wait for face detection before capturing.');
      return;
    }

    setIsCapturing(true);

    // Create a canvas to capture the video frame
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsCapturing(false);
      return;
    }

    // Draw the video frame (mirrored)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(videoElement, -canvasSize.width, 0, canvasSize.width, canvasSize.height);
    ctx.restore();

    // Convert to image
    const imageDataUrl = canvas.toDataURL('image/png');
    
    // Save captured data to sessionStorage
    const capturedData = {
      image: imageDataUrl,
      score: harmonyScore,
      landmarks: landmarks,
      canvasSize: canvasSize,
    };
    
    sessionStorage.setItem('capturedFaceData', JSON.stringify(capturedData));
    
    // Navigate to results page
    router.push('/results');
  }, [videoElement, landmarks, harmonyScore, canvasSize, router]);

  return (
    <div className="min-h-screen bg-black p-2 sm:p-4 md:p-8 relative overflow-hidden">
      {/* Symmetry Engine Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <SymmetryBackground />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2" style={{textShadow: '0 0 20px rgba(0,0,0,0.8)'}}>
            Face Scanning
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-300" style={{textShadow: '0 0 15px rgba(0,0,0,0.8)'}}>
            Position your face in the center and capture when ready
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Camera View */}
          <div className="relative aspect-video bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
            <CameraView 
              onVideoReady={handleVideoReady}
              onError={handleError}
            />
            
            {/* Face Mesh Overlay */}
            {videoElement && (
              <FaceMeshCanvas
                width={canvasSize.width}
                height={canvasSize.height}
                landmarks={landmarks}
                showMesh={showMesh}
              />
            )}

            {/* Scanning Line Animation */}
            {isDetecting && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="scan-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-70" />
              </div>
            )}

            {/* Status Indicator - Top Center */}
            <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2">
              {isDetecting ? (
                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 bg-green-500/90 backdrop-blur-sm text-white rounded-full shadow-lg text-xs sm:text-base">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="font-semibold">Face Detected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 bg-gray-800/90 backdrop-blur-sm text-gray-300 rounded-full shadow-lg text-xs sm:text-base">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
                  <span className="font-semibold">Searching...</span>
                </div>
              )}
            </div>

            {/* Current Score Badge - Top Right */}
            {harmonyScore && isDetecting && (
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 px-3 sm:px-5 py-2 sm:py-3 bg-black/70 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-bold text-center border-2 border-green-400/50">
                <div className="text-xl sm:text-3xl text-green-400">{harmonyScore.overall}</div>
                <div className="text-[10px] sm:text-xs text-gray-300">Live Score</div>
              </div>
            )}

            {/* Toggle Mesh Button */}
            <button
              onClick={() => setShowMesh(!showMesh)}
              className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm text-white rounded-lg transition-colors text-xs sm:text-sm touch-manipulation"
            >
              {showMesh ? 'Hide' : 'Show'} Mesh
            </button>
          </div>

          {/* Instructions & Controls */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Instructions Card */}
            <div className="lg:col-span-2 p-4 sm:p-6 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700">
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                <span>📋</span>
                <span>Instructions</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-xs sm:text-sm">1</span>
                  </div>
                  <div>
                    <div className="text-white font-medium text-xs sm:text-sm">Position Face</div>
                    <div className="text-gray-400 text-[10px] sm:text-xs">Center in frame</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-xs sm:text-sm">2</span>
                  </div>
                  <div>
                    <div className="text-white font-medium text-xs sm:text-sm">Good Lighting</div>
                    <div className="text-gray-400 text-[10px] sm:text-xs">Well lit face</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-xs sm:text-sm">3</span>
                  </div>
                  <div>
                    <div className="text-white font-medium text-xs sm:text-sm">Look Straight</div>
                    <div className="text-gray-400 text-[10px] sm:text-xs">Face camera</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-xs sm:text-sm">4</span>
                  </div>
                  <div>
                    <div className="text-white font-medium text-xs sm:text-sm">Capture</div>
                    <div className="text-gray-400 text-[10px] sm:text-xs">When ready</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="p-4 sm:p-6 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700">
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                <span>📊</span>
                <span>Status</span>
              </h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Camera</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Detection</span>
                  <span className={isDetecting ? 'text-green-400 font-medium' : 'text-gray-500'}>
                    {isDetecting ? 'Ready' : 'Waiting'}
                  </span>
                </div>
                {harmonyScore && (
                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-700">
                    <span className="text-gray-400">Face Shape</span>
                    <span className="text-blue-400 font-medium">{harmonyScore.features.faceShape}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
            <button
              onClick={captureFrame}
              disabled={!isDetecting || isCapturing}
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all font-semibold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 touch-manipulation min-h-[48px] ${
                isDetecting && !isCapturing
                  ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg transform active:scale-95'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{isCapturing ? 'Capturing...' : 'Capture & Analyze'}</span>
            </button>
            <a
              href="/"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white rounded-xl transition-colors font-semibold text-base sm:text-lg border border-gray-600 text-center min-h-[48px] flex items-center justify-center touch-manipulation"
            >
              ← Back to Home
            </a>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-500/20 border border-red-500 rounded-xl">
              <div className="flex items-start gap-2 sm:gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-200 text-sm sm:text-base">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 sm:mt-8 text-center text-gray-400 text-xs space-y-2 px-4">
          <p>
            🔒 All processing happens locally in your browser. No images are uploaded to any server.
          </p>
          <p>
            Made By Anil • All rights reserved @2026
          </p>
        </div>
      </div>
    </div>
  );
}
