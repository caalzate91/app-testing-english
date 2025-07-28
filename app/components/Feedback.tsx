interface FeedbackProps {
  readonly message: string;
  readonly isCorrect: boolean;
  readonly className?: string;
}

export default function Feedback({ message, isCorrect, className = '' }: FeedbackProps) {
  return (
    <div 
      className={`animate-slide-in p-6 rounded-xl border-2 text-center shadow-lg ${
        isCorrect 
          ? 'bg-success-50 border-success-200 text-success-800 dark:bg-success-900/20 dark:border-success-800 dark:text-success-200' 
          : 'bg-danger-50 border-danger-200 text-danger-800 dark:bg-danger-900/20 dark:border-danger-800 dark:text-danger-200'
      } ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isCorrect ? 'bg-success-500' : 'bg-danger-500'
        }`}>
          <span className="text-white text-xl font-bold">
            {isCorrect ? '✓' : '✗'}
          </span>
        </div>
        <div className="flex-grow">
          <p className="font-semibold text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
}
