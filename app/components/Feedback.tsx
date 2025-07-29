interface FeedbackProps {
  readonly message: string;
  readonly isCorrect: boolean;
  readonly className?: string;
}

export default function Feedback({ message, isCorrect, className = '' }: FeedbackProps) {
  return (
    <div 
      className={`animate-slide-in p-6 rounded-xl border-2 text-center shadow-xl ${
        isCorrect 
          ? 'bg-success-100 border-success-300 text-success-900 dark:bg-success-900/30 dark:border-success-700 dark:text-success-100' 
          : 'bg-danger-100 border-danger-300 text-danger-900 dark:bg-danger-900/30 dark:border-danger-700 dark:text-danger-100'
      } ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-3">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
          isCorrect ? 'bg-success-600 border-success-700' : 'bg-danger-600 border-danger-700'
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
