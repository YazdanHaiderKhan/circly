
import React, { useRef, useEffect, useState } from 'react';

interface CircleCanvasProps {
  onCircleComplete: (score: number) => void;
  isActive: boolean;
  attemptNumber: number;
  onDrawingStart: () => void;
}

export const CircleCanvas: React.FC<CircleCanvasProps> = ({
  onCircleComplete,
  isActive,
  attemptNumber,
  onDrawingStart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas with dark background
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw guide circle (faint)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(rect.width, rect.height) / 4;
    
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw user's drawing
    if (points.length > 1) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }
  }, [points, attemptNumber]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const startDrawing = (pos: { x: number; y: number }) => {
    if (!isActive) return;
    
    setIsDrawing(true);
    setHasStarted(true);
    setPoints([pos]);
    onDrawingStart();
  };

  const draw = (pos: { x: number; y: number }) => {
    if (!isDrawing || !hasStarted) return;
    
    setPoints(prev => [...prev, pos]);
  };

  const stopDrawing = () => {
    if (!isDrawing || !hasStarted) return;
    
    setIsDrawing(false);
    
    if (points.length > 10) {
      const score = calculateCircleScore(points);
      onCircleComplete(score);
    }
    
    // Reset for next attempt
    setTimeout(() => {
      setPoints([]);
      setHasStarted(false);
    }, 2000);
  };

  const calculateCircleScore = (drawPoints: { x: number; y: number }[]): number => {
    if (drawPoints.length < 10) return 0;

    // Find center of drawn shape
    const centerX = drawPoints.reduce((sum, p) => sum + p.x, 0) / drawPoints.length;
    const centerY = drawPoints.reduce((sum, p) => sum + p.y, 0) / drawPoints.length;

    // Calculate distances from center
    const distances = drawPoints.map(p => 
      Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
    );

    // Find average radius
    const avgRadius = distances.reduce((sum, d) => sum + d, 0) / distances.length;

    // Calculate variance (how much distances deviate from average)
    const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgRadius, 2), 0) / distances.length;
    const standardDeviation = Math.sqrt(variance);

    // Score based on how consistent the radius is (lower deviation = higher score)
    const consistencyScore = Math.max(0, 100 - (standardDeviation * 2));

    // Check if shape is reasonably closed
    const firstPoint = drawPoints[0];
    const lastPoint = drawPoints[drawPoints.length - 1];
    const closingDistance = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) + Math.pow(lastPoint.y - firstPoint.y, 2)
    );
    
    const closingPenalty = Math.min(20, closingDistance / 2);
    
    return Math.round(Math.max(0, consistencyScore - closingPenalty));
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    startDrawing(getMousePos(e));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    draw(getMousePos(e));
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    startDrawing(getTouchPos(e));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    draw(getTouchPos(e));
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        className={`border-2 border-purple-500/50 rounded-lg bg-slate-900 cursor-crosshair touch-none ${
          isActive ? 'shadow-lg shadow-purple-500/25' : 'opacity-50'
        }`}
        style={{ width: '300px', height: '300px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
};
