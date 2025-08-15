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
        bgClass: 'bg-success-900/30 backdrop-blur-sm',
        borderClass: 'border-success-600/50',
        textClass: 'text-success-200',
        iconBgClass: 'bg-success-600',
        badgeClass: 'bg-success-900/50 text-success-200 border-2 border-success-600/50',
        message: '¡Excelente trabajo!',
        icon: '🎉',
      };
    } else if (percentage >= 60) {
      return {
        bgClass: 'bg-warning-900/30 backdrop-blur-sm',
        borderClass: 'border-warning-600/50',
        textClass: 'text-warning-200',
        iconBgClass: 'bg-warning-600',
        badgeClass: 'bg-warning-900/50 text-warning-200 border-2 border-warning-600/50',
        message: '¡Buen intento!',
        icon: '👍',
      };
    } else {
      return {
        bgClass: 'bg-danger-900/30 backdrop-blur-sm',
        borderClass: 'border-danger-600/50',
        textClass: 'text-danger-200',
        iconBgClass: 'bg-danger-600',
        badgeClass: 'bg-danger-900/50 text-danger-200 border-2 border-danger-600/50',
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
        <div className={`inline-flex items-center justify-center w-20 h-20 ${theme.iconBgClass} rounded-full text-3xl border-4 border-dark-800 shadow-lg`}>
          {theme.icon}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">
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
            <p className="text-lg text-slate-200">
              <span className="font-bold text-slate-100">
                {correctAnswers} de {totalQuestions}
              </span>{' '}
              respuestas correctas
            </p>
            <p className="text-slate-300">
              Respuestas incorrectas: <span className="font-bold">{totalQuestions - correctAnswers}</span>
            </p>
          </div>
        </div>

        {/* Performance breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-dark-700/50 backdrop-blur-sm rounded-xl shadow-sm border border-dark-600/50">
            <div className="text-2xl font-bold text-success-400">
              {correctAnswers}
            </div>
            <div className="text-sm text-slate-400">Correctas</div>
          </div>
          <div className="p-4 bg-dark-700/50 backdrop-blur-sm rounded-xl shadow-sm border border-dark-600/50">
            <div className="text-2xl font-bold text-danger-400">
              {totalQuestions - correctAnswers}
            </div>
            <div className="text-sm text-slate-400">Incorrectas</div>
          </div>
          <div className="p-4 bg-dark-700/50 backdrop-blur-sm rounded-xl shadow-sm border border-dark-600/50">
            <div className={`text-2xl font-bold ${theme.textClass}`}>
              {percentage}%
            </div>
            <div className="text-sm text-slate-400">Precisión</div>
          </div>
        </div>

        {/* Progress visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold text-slate-200">
            <span>Tu puntuación</span>
            <span>{correctAnswers}/{totalQuestions}</span>
          </div>
          <div className="h-4 bg-dark-700/50 rounded-full overflow-hidden border-2 border-dark-600/50">
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
          className="flex-1 sm:flex-none bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 ease-in-out shadow-xl hover:shadow-2xl active:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300/50 border-2 border-primary-500"
        >
          🔄 Intentar de nuevo
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="flex-1 sm:flex-none bg-dark-700/50 border-2 border-primary-500/50 text-primary-200 hover:bg-dark-600/60 hover:border-primary-400 font-bold py-4 px-8 rounded-xl transition-all duration-200 ease-in-out shadow-xl hover:shadow-2xl active:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-200/50 backdrop-blur-sm"
        >
          🏠 Inicio
        </button>
      </div>
    </div>
  );
}
