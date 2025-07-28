import { Question } from '../types';

interface QuizQuestionProps {
  readonly question: Question;
  readonly userAnswer: string;
  readonly onAnswerChange: (answer: string) => void;
  readonly onSubmit: () => void;
  readonly isAnswerValid: boolean;
  readonly feedback: string | null;
  readonly className?: string;
}

export default function QuizQuestion({ 
  question, 
  userAnswer, 
  onAnswerChange, 
  onSubmit, 
  isAnswerValid,
  feedback,
  className = '' 
}: QuizQuestionProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isAnswerValid) {
      onSubmit();
    }
  };

  const getButtonContent = () => {
    if (feedback !== null) {
      return (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin">⏳</span>{' '}
          Procesando...
        </span>
      );
    } 
    if (!isAnswerValid) {
      return (
        <span className="flex items-center justify-center gap-2">
          <span>⚠️</span>{' '}
          Selecciona una respuesta para continuar
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center gap-2">
        <span>📤</span>{' '}
        Enviar respuesta
      </span>
    );
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.options?.map((option: string) => (
              <button
                key={option}
                type="button"
                onClick={() => onAnswerChange(option)}
                className={`quiz-option p-4 rounded-xl border-2 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary-200 cursor-pointer select-none ${
                  userAnswer === option
                    ? 'bg-primary-500 border-primary-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                }`}
                aria-pressed={userAnswer === option}
              >
                <span className="text-lg font-medium">{option}</span>
              </button>
            ))}
          </div>
        );

      case 'translation':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 text-lg rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition-all duration-200 ease-in-out placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Escribe tu traducción aquí..."
              aria-label="Campo de respuesta para traducción"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              💡 Presiona Enter para enviar tu respuesta
            </p>
          </div>
        );

      case 'true-false':
        return (
          <div className="flex justify-center gap-6">
            <button
              type="button"
              onClick={() => onAnswerChange('true')}
              className={`quiz-option px-8 py-4 rounded-xl border-2 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary-200 cursor-pointer select-none ${
                userAnswer === 'true'
                  ? 'bg-success-500 border-success-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-success-300 hover:bg-success-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
              }`}
              aria-pressed={userAnswer === 'true'}
            >
              <span className="text-xl font-semibold">✓ True</span>
            </button>
            <button
              type="button"
              onClick={() => onAnswerChange('false')}
              className={`quiz-option px-8 py-4 rounded-xl border-2 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary-200 cursor-pointer select-none ${
                userAnswer === 'false'
                  ? 'bg-danger-500 border-danger-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-danger-300 hover:bg-danger-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
              }`}
              aria-pressed={userAnswer === 'false'}
            >
              <span className="text-xl font-semibold">✗ False</span>
            </button>
          </div>
        );

      case 'fill-in-the-blank':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 text-lg rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition-all duration-200 ease-in-out placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Completa la oración..."
              aria-label="Campo de respuesta para completar la oración"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              💡 Presiona Enter para enviar tu respuesta
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Question */}
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 text-balance leading-tight">
          {question.question}
        </h2>
        
        {/* Question type indicator */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200">
          {question.type === 'multiple-choice' && '📝 Opción múltiple'}
          {question.type === 'translation' && '🔄 Traducción'}
          {question.type === 'true-false' && '⚖️ Verdadero o Falso'}
          {question.type === 'fill-in-the-blank' && '✏️ Completar'}
        </div>
      </div>

      {/* Answer input */}
      <div className="space-y-6">
        {renderQuestionContent()}
        
        {/* Submit button */}
        <div className="space-y-4">
          <button
            onClick={onSubmit}
            disabled={!isAnswerValid || feedback !== null}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 ${
              isAnswerValid && feedback === null
                ? 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-lg hover:shadow-xl active:shadow-md focus:ring-primary-200'
                : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none'
            }`}
            aria-label={isAnswerValid ? 'Enviar respuesta' : 'Respuesta requerida para continuar'}
          >
            {getButtonContent()}
          </button>
          
          {/* Helper text */}
          {!isAnswerValid && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              El botón se habilitará cuando proporciones una respuesta
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
