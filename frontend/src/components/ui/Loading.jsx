const Loading = ({ size = 'md', text = '', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  );
};

// Full screen loading
export const FullScreenLoading = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <Loading size="xl" text={text} />
    </div>
  );
};

// Inline loading for buttons
export const ButtonLoading = () => {
  return <Loading size="sm" className="text-current" />;
};

export default Loading;