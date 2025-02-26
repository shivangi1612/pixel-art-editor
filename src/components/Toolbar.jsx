import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import {
  PaintBrushIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  MinusIcon,
  PlusIcon,
  PhotoIcon
} from '@heroicons/react/24/solid';

const Toolbar = ({
  selectedColor,
  setSelectedColor,
  tool,
  setTool,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  onDownload,
  brushSize,
  setBrushSize,
  onShowGallery
}) => {
  const tools = [
    { id: 'brush', icon: PaintBrushIcon, label: 'Brush' },
    { id: 'eraser', icon: TrashIcon, label: 'Eraser' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 bg-editor-light p-4 rounded-lg shadow-lg w-full md:w-auto"
    >
      <div className="flex flex-col gap-2">
        <HexColorPicker
          color={selectedColor}
          onChange={setSelectedColor}
          className="!w-full"
        />
        <div className="flex justify-center gap-2 mt-2">
          {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {tools.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              tool === id
                ? 'bg-editor-accent text-white'
                : 'hover:bg-editor-accent/50 text-gray-300'
            }`}
            onClick={() => setTool(id)}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
        
        <div className="flex items-center justify-between px-4 py-2 text-gray-300">
          <span className="text-sm">Size: {brushSize}</span>
          <div className="flex gap-2">
            <button
              className="p-1 hover:bg-editor-accent/50 rounded"
              onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-editor-accent/50 rounded"
              onClick={() => setBrushSize(Math.min(5, brushSize + 1))}
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className={`p-2 rounded-lg ${
            canUndo ? 'hover:bg-editor-accent/50 text-gray-300' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={onUndo}
          disabled={!canUndo}
        >
          <ArrowUturnLeftIcon className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-lg ${
            canRedo ? 'hover:bg-editor-accent/50 text-gray-300' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={onRedo}
          disabled={!canRedo}
        >
          <ArrowUturnRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-editor-accent/50 text-gray-300"
          onClick={() => onSave(document.querySelector('canvas'))}
        >
          <DocumentDuplicateIcon className="w-5 h-5" />
          <span className="text-sm">Save</span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-editor-accent/50 text-gray-300"
          onClick={() => onDownload(document.querySelector('canvas'))}
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          <span className="text-sm">Download</span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-editor-accent/50 text-gray-300"
          onClick={onShowGallery}
        >
          <PhotoIcon className="w-5 h-5" />
          <span className="text-sm">Gallery</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Toolbar;