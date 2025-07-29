interface ProgressBarProps {
  readonly current: number;
  readonly total: number;
  readonly className?: string;
}

export default function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);
  const progressWidth = `${percentage}%`;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-sm font-semibold">
        <span className="text-gray-700 dark:text-slate-300">
          Pregunta {current} de {total}
        </span>
        <span className="text-slate-800 dark:text-primary-300 bg-slate-100 dark:bg-primary-900/50 px-2 py-1 rounded-full border border-slate-300 dark:border-primary-700">
          {percentage}%
        </span>
      </div>
      <div className="relative h-4 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden border-2 border-slate-400 dark:border-slate-500">
        <progress 
          className="sr-only"
          value={current}
          max={total}
          aria-label={`Progreso del cuestionario: ${current} de ${total} preguntas completadas`}
        />
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full transition-all duration-500 ease-out shadow-inner"
          style={{ width: progressWidth }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse-soft rounded-full" />
      </div>
    </div>
  );
}
