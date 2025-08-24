import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Portal-like overlay with high z-index */}
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal container */}
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div 
            className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 px-6 pb-6 pt-5 text-left shadow-2xl transition-all duration-300 w-full max-w-md mx-auto animate-in fade-in-0 zoom-in-95"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="absolute right-4 top-4">
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Header */}
            <div className="flex items-start gap-4 mb-6 pr-8">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800/50">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1"
                >
                  Delete Task
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to permanently delete this task?
              </p>
              
              {/* Task preview */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-red-400 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                      {taskTitle || "Untitled Task"}
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                All associated data will be permanently removed
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg bg-white dark:bg-gray-700 px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 px-6 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Trash2 size={16} />
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;