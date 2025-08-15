interface FeedbackProps {
  readonly message: string;
  readonly isCorrect: boolean;
  readonly className?: string;
}

export default function Feedback({ message, isCorrect, className = '' }: FeedbackProps) {
  return (
    <div 
      className={`animate-slide-in p-6 rounded-xl border-2 text-center shadow-xl backdrop-blur-sm ${
        isCorrect 
          ? 'bg-success-900/30 border-success-600/50 text-success-200' 
          : 'bg-danger-900/30 border-danger-600/50 text-danger-200'
      } ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-3">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
          isCorrect ? 'bg-success-600 border-success-500' : 'bg-danger-600 border-danger-500'
        }`}>
          <span className="text-white text-2xl font-bold">
            {isCorrect ? '✓' : '✗'}
          </span>
        </div>
        <div className="flex-grow">
          <p className="font-bold text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
}
