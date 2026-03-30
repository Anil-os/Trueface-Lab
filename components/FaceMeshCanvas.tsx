'use client';

import React, { useRef, useEffect, useState } from 'react';
import { FaceLandmarks } from '@/lib/faceMath';

interface FaceMeshCanvasProps {
  width: number;
  height: number;
  landmarks: FaceLandmarks[] | null;
  showMesh?: boolean;
}

const MOBILE_KEY_POINTS = [10, 152, 1];
const DESKTOP_KEY_POINTS = [10, 152, 234, 454, 1, 33, 263];

export default function FaceMeshCanvas({ 
  width, 
  height, 
  landmarks, 
  showMesh = true 
}: FaceMeshCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile] = useState(() => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (!landmarks || !showMesh) return;

    // Simplified rendering on mobile for better performance
    if (isMobile) {
      // Only draw key points and lines on mobile
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
      ctx.lineWidth = 2;

      // Draw key measurement lines only
      if (landmarks.length >= 468) {
        // Face width line (234 to 454)
        drawLine(ctx, landmarks[234], landmarks[454], width, height);
        
        // Face height line (10 to 152)
        drawLine(ctx, landmarks[10], landmarks[152], width, height);
        
        // Eye distance line (33 to 263)
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
        drawLine(ctx, landmarks[33], landmarks[263], width, height);
      }

      // Highlight key facial points only
      MOBILE_KEY_POINTS.forEach((index) => {
        if (!landmarks[index]) return;
        const x = landmarks[index].x * width;
        const y = landmarks[index].y * height;
        
        ctx.fillStyle = index === 1 ? 'rgba(0, 255, 255, 0.9)' : 'rgba(255, 0, 0, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    } else {
      // Full rendering on desktop
      // Draw landmarks
      ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.lineWidth = 1;

      // Draw a reduced subset of points to keep desktop responsive.
      for (let i = 0; i < landmarks.length; i += 2) {
        const landmark = landmarks[i];
        const x = landmark.x * width;
        const y = landmark.y * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw key measurement lines
      if (landmarks.length >= 468) {
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
        ctx.lineWidth = 2;

        // Face width line (234 to 454)
        drawLine(ctx, landmarks[234], landmarks[454], width, height);
        
        // Face height line (10 to 152)
        drawLine(ctx, landmarks[10], landmarks[152], width, height);
        
        // Eye distance line (33 to 263)
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
        drawLine(ctx, landmarks[33], landmarks[263], width, height);
        
        // Highlight key facial points
        DESKTOP_KEY_POINTS.forEach((index) => {
          if (!landmarks[index]) return;
          const x = landmarks[index].x * width;
          const y = landmarks[index].y * height;
          
          if (index === 10 || index === 152) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
          } else if (index === 234 || index === 454) {
            ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
          } else if (index === 1) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
          } else {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
          }

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw label
          ctx.fillStyle = 'white';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText(index.toString(), x + 6, y - 6);
        });
      }

      // Draw face contour connections
      if (landmarks.length >= 468) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.lineWidth = 1;
        
        // Face oval (simplified - connecting key contour points)
        const faceOval = [
          10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
          397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
          172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10
        ];
        
        for (let i = 0; i < faceOval.length - 1; i++) {
          drawLine(ctx, landmarks[faceOval[i]], landmarks[faceOval[i + 1]], width, height);
        }
      }
    }
  }, [landmarks, width, height, showMesh, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 pointer-events-none scale-x-[-1]"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

/**
 * Helper function to draw a line between two landmarks
 */
function drawLine(
  ctx: CanvasRenderingContext2D,
  p1: FaceLandmarks,
  p2: FaceLandmarks,
  width: number,
  height: number
) {
  ctx.beginPath();
  ctx.moveTo(p1.x * width, p1.y * height);
  ctx.lineTo(p2.x * width, p2.y * height);
  ctx.stroke();
}
