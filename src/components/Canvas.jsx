import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const Canvas = ({ 
  selectedColor, 
  tool, 
  canvasSize, 
  pixelSize,
  onUpdateHistory,
  historyState,
  historyIndex,
  brushSize
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [pixels, setPixels] = useState([]);
  const initializedRef = useRef(false);

  // Initialize canvas only once
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    
    if (!initializedRef.current) {
      // Initialize white canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      
      // Initialize pixels array
      const initialPixels = Array(canvasSize / pixelSize)
        .fill()
        .map(() => Array(canvasSize / pixelSize).fill('#ffffff'));
      setPixels(initialPixels);
      onUpdateHistory(initialPixels);
      initializedRef.current = true;
    }
  }, [canvasSize, pixelSize, onUpdateHistory]);

  // Restore canvas state when history changes
  useEffect(() => {
    if (!context || !historyState) return;

    // Redraw the entire canvas based on history state
    historyState.forEach((row, y) => {
      row.forEach((color, x) => {
        context.fillStyle = color;
        context.fillRect(
          x * pixelSize,
          y * pixelSize,
          pixelSize,
          pixelSize
        );
      });
    });

    // Only update pixels if they're different from the current state
    if (JSON.stringify(pixels) !== JSON.stringify(historyState)) {
      setPixels(historyState);
    }
  }, [context, historyState, historyIndex, pixelSize]);

  const drawPixel = (x, y) => {
    if (!context) return;
    
    const centerPixelX = Math.floor(x / pixelSize);
    const centerPixelY = Math.floor(y / pixelSize);
    
    const color = tool === 'eraser' ? '#ffffff' : selectedColor;
    const newPixels = pixels.map(row => [...row]);
    
    // Draw pixels in a square around the center point based on brush size
    for (let offsetY = -Math.floor(brushSize/2); offsetY < Math.ceil(brushSize/2); offsetY++) {
      for (let offsetX = -Math.floor(brushSize/2); offsetX < Math.ceil(brushSize/2); offsetX++) {
        const pixelX = centerPixelX + offsetX;
        const pixelY = centerPixelY + offsetY;
        
        if (pixelX >= 0 && pixelX < canvasSize / pixelSize && 
            pixelY >= 0 && pixelY < canvasSize / pixelSize) {
          context.fillStyle = color;
          context.fillRect(
            pixelX * pixelSize,
            pixelY * pixelSize,
            pixelSize,
            pixelSize
          );
          newPixels[pixelY][pixelX] = color;
        }
      }
    }
    
    setPixels(newPixels);
    onUpdateHistory(newPixels);
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawPixel(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawPixel(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative border-4 border-editor-accent rounded-lg overflow-hidden shadow-xl"
    >
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="bg-white cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </motion.div>
  );
};

export default Canvas;