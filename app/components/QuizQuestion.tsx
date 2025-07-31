import { Question } from '@/app/types';

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
  const handleSubmit = () => {
    // Verificar que onSubmit está definido antes de llamarlo
    if (typeof onSubmit === 'function') {
      onSubmit();
    } else {
      console.error('onSubmit is not a function:', onSubmit);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isAnswerValid) {
      handleSubmit();
    }
  };

  const getButtonContent = () => {
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
                    ? 'bg-slate-800 border-slate-900 text-white shadow-xl ring-2 ring-slate-600'
                    : 'bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-600 hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 shadow-md hover:shadow-lg'
                }`}
                aria-pressed={userAnswer === option}
              >
                <span className="text-lg font-semibold">{option}</span>
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
              className="w-full p-4 text-lg rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:border-primary-600 focus:ring-4 focus:ring-primary-200 transition-all duration-200 ease-in-out placeholder:text-slate-500 dark:placeholder:text-slate-400 shadow-md focus:shadow-lg"
              placeholder="Escribe tu traducción aquí..."
              aria-label="Campo de respuesta para traducción"
            />
            <p className="text-sm text-slate-600 dark:text-slate-300">
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
              className={`quiz-option px-8 py-4 rounded-xl border-2 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-success-200 cursor-pointer select-none ${
                userAnswer === 'true'
                  ? 'bg-slate-800 border-slate-900 text-white shadow-xl ring-2 ring-slate-600'
                  : 'bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-600 hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 shadow-md hover:shadow-lg'
              }`}
              aria-pressed={userAnswer === 'true'}
            >
              <span className="text-xl font-bold">✓ True</span>
            </button>
            <button
              type="button"
              onClick={() => onAnswerChange('false')}
              className={`quiz-option px-8 py-4 rounded-xl border-2 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-danger-200 cursor-pointer select-none ${
                userAnswer === 'false'
                  ? 'bg-slate-800 border-slate-900 text-white shadow-xl ring-2 ring-slate-600'
                  : 'bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-600 hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 shadow-md hover:shadow-lg'
              }`}
              aria-pressed={userAnswer === 'false'}
            >
              <span className="text-xl font-bold">✗ False</span>
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
              className="w-full p-4 text-lg rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:border-primary-600 focus:ring-4 focus:ring-primary-200 transition-all duration-200 ease-in-out placeholder:text-slate-500 dark:placeholder:text-slate-400 shadow-md focus:shadow-lg"
              placeholder="Completa la oración..."
              aria-label="Campo de respuesta para completar la oración"
            />
            <p className="text-sm text-slate-600 dark:text-slate-300">
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
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-600 dark:text-gray-400 text-balance leading-tight">
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
          {/* Solo mostrar el botón de envío si no hay feedback */}
          {feedback === null && (
            <button
              onClick={handleSubmit}
              disabled={!isAnswerValid}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 ${
                isAnswerValid
                  ? 'bg-slate-800 hover:bg-slate-900 active:bg-black text-white shadow-xl hover:shadow-2xl active:shadow-lg focus:ring-slate-300 border-2 border-slate-900'
                  : 'bg-slate-400 dark:bg-slate-600 text-slate-600 dark:text-slate-400 cursor-not-allowed shadow-none border-2 border-slate-500 dark:border-slate-500'
              }`}
              aria-label={isAnswerValid ? 'Enviar respuesta' : 'Respuesta requerida para continuar'}
            >
              {getButtonContent()}
            </button>
          )}
          
          {/* Helper text */}
          {!isAnswerValid && (
            <p className="text-center text-sm text-slate-600 dark:text-slate-300">
              El botón se habilitará cuando proporciones una respuesta
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
