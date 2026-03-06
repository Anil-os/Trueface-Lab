'use client';

import React, { useRef, useEffect, useState } from 'react';

interface CameraViewProps {
  onVideoReady: (video: HTMLVideoElement) => void;
  onError: (error: string) => void;
}

export default function CameraView({ onVideoReady, onError }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        setIsLoading(true);
        setPermissionDenied(false);

        // Detect mobile device for optimized settings
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Request camera access with optimal settings for face detection
        // Use lower resolution on mobile for better performance
        const constraints = {
          video: {
            width: { ideal: isMobile ? 480 : 640 },
            height: { ideal: isMobile ? 360 : 480 },
            facingMode: 'user',
            frameRate: { ideal: isMobile ? 24 : 30, max: 30 }
          },
          audio: false
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video metadata to be loaded
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play();
              setIsLoading(false);
              onVideoReady(videoRef.current);
            }
          };
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setIsLoading(false);
        setPermissionDenied(true);
        
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            onError('Camera permission denied. Please allow camera access to use this feature.');
          } else if (err.name === 'NotFoundError') {
            onError('No camera found. Please connect a camera to use this feature.');
          } else {
            onError('Failed to access camera. Please check your browser settings.');
          }
        }
      }
    }

    setupCamera();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [onVideoReady, onError]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-900 rounded-2xl overflow-hidden">
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover scale-x-[-1]"
        playsInline
        muted
        style={{ display: isLoading ? 'none' : 'block' }}
      />

      {/* Loading state */}
      {isLoading && !permissionDenied && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-white text-sm">Initializing camera...</p>
        </div>
      )}

      {/* Permission denied state */}
      {permissionDenied && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-6 text-center">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
          <h3 className="text-white text-lg font-semibold mb-2">Camera Access Required</h3>
          <p className="text-gray-400 text-sm max-w-md">
            Please allow camera access in your browser settings to use the Face Harmony Analyzer.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Scanning overlay */}
      {!isLoading && !permissionDenied && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner markers */}
          <div className="absolute top-8 left-8 w-12 h-12 border-l-4 border-t-4 border-blue-500"></div>
          <div className="absolute top-8 right-8 w-12 h-12 border-r-4 border-t-4 border-blue-500"></div>
          <div className="absolute bottom-8 left-8 w-12 h-12 border-l-4 border-b-4 border-blue-500"></div>
          <div className="absolute bottom-8 right-8 w-12 h-12 border-r-4 border-b-4 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
