import { motion } from 'framer-motion';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/solid';

const Gallery = ({ artworks, onClose, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-editor-light rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-white">Saved Artwork</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {artworks.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No saved artwork yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {artworks.map((art) => (
              <div
                key={art.id}
                className="relative group"
              >
                <img
                  src={art.dataUrl}
                  alt="Pixel Art"
                  className="w-full aspect-square object-contain bg-white rounded-lg pixel-art"
                />
                <button
                  onClick={() => onDelete(art.id)}
                  className="absolute top-2 right-2 bg-red-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="w-4 h-4 text-white" />
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(art.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Gallery;