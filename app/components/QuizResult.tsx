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
        bgClass: 'bg-success-50 dark:bg-success-900/20',
        borderClass: 'border-success-200 dark:border-success-800',
        textClass: 'text-success-800 dark:text-success-200',
        iconBgClass: 'bg-success-500',
        badgeClass: 'bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-200',
        message: '¡Excelente trabajo!',
        icon: '🎉',
      };
    } else if (percentage >= 60) {
      return {
        bgClass: 'bg-warning-50 dark:bg-warning-900/20',
        borderClass: 'border-warning-200 dark:border-warning-800',
        textClass: 'text-warning-800 dark:text-warning-200',
        iconBgClass: 'bg-warning-500',
        badgeClass: 'bg-warning-100 text-warning-800 dark:bg-warning-900/50 dark:text-warning-200',
        message: '¡Buen intento!',
        icon: '👍',
      };
    } else {
      return {
        bgClass: 'bg-danger-50 dark:bg-danger-900/20',
        borderClass: 'border-danger-200 dark:border-danger-800',
        textClass: 'text-danger-800 dark:text-danger-200',
        iconBgClass: 'bg-danger-500',
        badgeClass: 'bg-danger-100 text-danger-800 dark:bg-danger-900/50 dark:text-danger-200',
        message: 'Sigue practicando',
        icon: '💪',
      };
    }
  };

  const getProgressBarClass = () => {
    if (percentage >= 80) {
      return 'bg-gradient-to-r from-success-500 to-success-400';
    } else if (percentage >= 60) {
      return 'bg-gradient-to-r from-warning-500 to-warning-400';
    } else {
      return 'bg-gradient-to-r from-danger-500 to-danger-400';
    }
  };

  const theme = getResultTheme();

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header with icon and message */}
      <div className="text-center space-y-4">
        <div className={`inline-flex items-center justify-center w-20 h-20 ${theme.iconBgClass} rounded-full text-3xl`}>
          {theme.icon}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            ¡Cuestionario Completado!
          </h2>
          <p className={`text-xl font-semibold ${theme.textClass}`}>
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
            <p className="text-lg text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {correctAnswers} de {totalQuestions}
              </span>{' '}
              respuestas correctas
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Respuestas incorrectas: <span className="font-semibold">{totalQuestions - correctAnswers}</span>
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
          <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
            <span>Tu puntuación</span>
            <span>{correctAnswers}/{totalQuestions}</span>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
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
          className="flex-1 sm:flex-none bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl active:shadow-md focus:outline-none focus:ring-4 focus:ring-primary-200"
        >
          🔄 Intentar de nuevo
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="flex-1 sm:flex-none bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-semibold py-4 px-8 rounded-xl transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl active:shadow-md focus:outline-none focus:ring-4 focus:ring-primary-200"
        >
          🏠 Inicio
        </button>
      </div>
    </div>
  );
}
