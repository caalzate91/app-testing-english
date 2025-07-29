interface QuizResultProps {
  readonly correctAnswers: number;
  readonly totalQuestions: number;
  readonly onRestart: () => void;
}

export default function QuizResult({ correctAnswers, totalQuestions, onRestart }: QuizResultProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Determine color scheme based on performance thresholds
  const getResultTheme = () => {
    if (percentage >= 80) {
      return {
        bgClass: 'bg-success-100 dark:bg-success-900/30',
        borderClass: 'border-success-300 dark:border-success-700',
        textClass: 'text-success-900 dark:text-success-100',
        iconBgClass: 'bg-success-600',
        badgeClass: 'bg-success-200 text-success-900 dark:bg-success-800 dark:text-success-100 border-2 border-success-400 dark:border-success-600',
        message: '¡Excelente trabajo!',
        icon: '🎉',
      };
    } else if (percentage >= 60) {
      return {
        bgClass: 'bg-warning-100 dark:bg-warning-900/30',
        borderClass: 'border-warning-300 dark:border-warning-700',
        textClass: 'text-warning-900 dark:text-warning-100',
        iconBgClass: 'bg-warning-600',
        badgeClass: 'bg-warning-200 text-warning-900 dark:bg-warning-800 dark:text-warning-100 border-2 border-warning-400 dark:border-warning-600',
        message: '¡Buen intento!',
        icon: '👍',
      };
    } else {
      return {
        bgClass: 'bg-danger-100 dark:bg-danger-900/30',
        borderClass: 'border-danger-300 dark:border-danger-700',
        textClass: 'text-danger-900 dark:text-danger-100',
        iconBgClass: 'bg-danger-600',
        badgeClass: 'bg-danger-200 text-danger-900 dark:bg-danger-800 dark:text-danger-100 border-2 border-danger-400 dark:border-danger-600',
        message: 'Sigue practicando',
        icon: '💪',
      };
    }
  };

  const getProgressBarClass = () => {
    if (percentage >= 80) {
      return 'bg-gradient-to-r from-success-600 to-success-500';
    } else if (percentage >= 60) {
      return 'bg-gradient-to-r from-warning-600 to-warning-500';
    } else {
      return 'bg-gradient-to-r from-danger-600 to-danger-500';
    }
  };

  const theme = getResultTheme();

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header with icon and message */}
      <div className="text-center space-y-4">
        <div className={`inline-flex items-center justify-center w-20 h-20 ${theme.iconBgClass} rounded-full text-3xl border-4 border-white dark:border-slate-800 shadow-lg`}>
          {theme.icon}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-700 dark:text-slate-100 mb-2">
            ¡Cuestionario Completado!
          </h2>
          <p className={`text-xl font-bold ${theme.textClass}`}>
            {theme.message}
          </p>
        </div>
      </div>

      {/* Results card */}
      <div className={`p-8 rounded-2xl border-2 ${theme.bgClass} ${theme.borderClass} space-y-6`}>
        {/* Score display */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center px-6 py-3 rounded-full ${theme.badgeClass} text-2xl font-bold`}>
            {percentage}%
          </div>
          <div className="space-y-2">
            <p className="text-lg text-gray-700 dark:text-slate-200">
              <span className="font-bold text-gray-800 dark:text-slate-100">
                {correctAnswers} de {totalQuestions}
              </span>{' '}
              respuestas correctas
            </p>
            <p className="text-gray-600 dark:text-slate-300">
              Respuestas incorrectas: <span className="font-bold">{totalQuestions - correctAnswers}</span>
            </p>
          </div>
        </div>

        {/* Performance breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-success-600 dark:text-success-400">
              {correctAnswers}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Correctas</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-danger-600 dark:text-danger-400">
              {totalQuestions - correctAnswers}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Incorrectas</div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <div className={`text-2xl font-bold ${theme.textClass}`}>
              {percentage}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Precisión</div>
          </div>
        </div>

        {/* Progress visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-slate-300">
            <span>Tu puntuación</span>
            <span>{correctAnswers}/{totalQuestions}</span>
          </div>
          <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden border-2 border-slate-400 dark:border-slate-500">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressBarClass()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-900 active:bg-black text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 ease-in-out shadow-xl hover:shadow-2xl active:shadow-lg focus:outline-none focus:ring-4 focus:ring-slate-300 border-2 border-slate-900"
        >
          🔄 Intentar de nuevo
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="flex-1 sm:flex-none bg-white border-3 border-slate-800 text-slate-800 hover:bg-slate-100 font-bold py-4 px-8 rounded-xl transition-all duration-200 ease-in-out shadow-xl hover:shadow-2xl active:shadow-lg focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          🏠 Inicio
        </button>
      </div>
    </div>
  );
}
