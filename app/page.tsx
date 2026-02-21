'use client';

import Link from 'next/link';
import { SymmetryBackground } from '@/components/SymmetryBackground';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Symmetry Engine Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <SymmetryBackground />
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-white border-2 border-gray-300 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight" style={{textShadow: '0 0 20px rgba(0,0,0,0.8)'}}>
            TrueFace
            <span className="block text-gray-300">
              Lab
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4" style={{textShadow: '0 0 15px rgba(0,0,0,0.8)'}}>
            Discover your facial harmony score using advanced AI and the golden ratio. 
            All processing happens in your browser—completely private and secure.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Link
              href="/scan"
              className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-black text-base sm:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-gray-200 touch-manipulation min-h-[48px] flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Scanning
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-800 backdrop-blur-sm text-white text-base sm:text-lg font-semibold rounded-full hover:bg-gray-700 active:bg-gray-600 transition-all duration-300 border border-gray-600 touch-manipulation min-h-[48px] flex items-center justify-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:bg-white/15 active:bg-white/20 transition-all duration-300 border border-gray-700">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Real-Time Analysis</h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Instant facial proportion measurements using advanced MediaPipe face detection technology.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:bg-white/15 active:bg-white/20 transition-all duration-300 border border-gray-700">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">100% Private</h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                All processing happens directly in your browser. No images are uploaded or stored anywhere.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:bg-white/15 active:bg-white/20 transition-all duration-300 border border-gray-700">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Golden Ratio Science</h3>
              <p className="text-gray-300 text-sm">
                Based on the mathematical golden ratio (φ ≈ 1.618) used in art and nature for millennia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12" style={{textShadow: '0 0 20px rgba(0,0,0,0.8)'}}>
            How It Works
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-bold text-xl border-2 border-gray-300">
                1
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-2">Face Detection</h3>
                <p className="text-gray-300">
                  MediaPipe FaceMesh detects 468 precise facial landmarks in real-time, mapping your unique facial structure with incredible accuracy.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-bold text-xl border-2 border-gray-300">
                2
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-2">Proportion Analysis</h3>
                <p className="text-gray-300">
                  Our algorithm calculates key facial measurements: face width, height, eye distance, and symmetry—comparing them against the golden ratio.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-bold text-xl border-2 border-gray-300">
                3
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-2">Harmony Score</h3>
                <p className="text-gray-300">
                  Receive a comprehensive harmony score (0-100) with detailed breakdowns of facial proportions, symmetry, and alignment metrics.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/scan"
              className="inline-block px-8 py-4 bg-white text-black text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-200"
            >
              Try It Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400 text-sm border-t border-white/10 relative z-10">
        <p className="mb-2" style={{textShadow: '0 0 10px rgba(0,0,0,0.8)'}}>
          Made By Anil • All rights reserved @2026
        </p>
        <p className="text-xs" style={{textShadow: '0 0 10px rgba(0,0,0,0.8)'}}>
          Results are for entertainment purposes only. Beauty is subjective and cannot be defined by numbers.
        </p>
      </footer>
    </div>
  );
}
