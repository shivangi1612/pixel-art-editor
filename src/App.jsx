import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { nanoid } from 'nanoid';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import Gallery from './components/Gallery';

function App() {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [tool, setTool] = useState('brush');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [brushSize, setBrushSize] = useState(1);
  const [savedArtworks, setSavedArtworks] = useState(() => {
    const saved = localStorage.getItem('pixelArtworks');
    return saved ? JSON.parse(saved) : [];
  });
  const [showGallery, setShowGallery] = useState(false);
  
  const canvasSize = 512;
  const pixelSize = 16;

  useEffect(() => {
    localStorage.setItem('pixelArtworks', JSON.stringify(savedArtworks));
  }, [savedArtworks]);

  const handleUpdateHistory = useCallback((pixels) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(pixels);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history.length]);

  const handleSave = useCallback((canvas) => {
    const dataUrl = canvas.toDataURL('image/png');
    const newArtwork = {
      id: nanoid(),
      dataUrl,
      date: new Date().toISOString(),
    };
    setSavedArtworks(prev => [newArtwork, ...prev]);
    toast.success('Artwork saved!');
  }, []);

  const handleDownload = useCallback((canvas) => {
    const link = document.createElement('a');
    link.download = `pixel-art-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Download started!');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[url(/src/assets/image.jpg)] bg-auto md:bg-cover bg-no-repeat p-8"
    >
      <div className="max-w-7xl mx-auto ">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-2xl md:text-4xl font-normal text-white mb-8 text-center"
        >
        <marquee>Pixel Art Editor</marquee>
        </motion.h1>
        
        <div className="flex flex-col md:flex-row gap-8 items-start justify-center opacity-90">
          <Toolbar
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            tool={tool}
            setTool={setTool}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onSave={handleSave}
            onDownload={handleDownload}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            onShowGallery={() => setShowGallery(true)}
          />
          
          <Canvas
            selectedColor={selectedColor}
            tool={tool}
            canvasSize={canvasSize}
            pixelSize={pixelSize}
            onUpdateHistory={handleUpdateHistory}
            historyState={history[historyIndex]}
            historyIndex={historyIndex}
            brushSize={brushSize}
          />
        </div>
      </div>

      <AnimatePresence>
        {showGallery && (
          <Gallery
            artworks={savedArtworks}
            onClose={() => setShowGallery(false)}
            onDelete={(id) => {
              setSavedArtworks(prev => prev.filter(art => art.id !== id));
              toast.success('Artwork deleted!');
            }}
          />
        )}
      </AnimatePresence>
      
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            fontFamily: '"Press Start 2P", system-ui',
            fontSize: '12px'
          }
        }}
      />
    </motion.div>
  );
}

export default App;