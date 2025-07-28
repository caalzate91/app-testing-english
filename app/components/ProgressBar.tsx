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
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-slate-600 dark:text-slate-400">
          Pregunta {current} de {total}
        </span>
        <span className="text-primary-600 dark:text-primary-400">
          {percentage}%
        </span>
      </div>
      <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <progress 
          className="sr-only"
          value={current}
          max={total}
          aria-label={`Progreso del cuestionario: ${current} de ${total} preguntas completadas`}
        />
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: progressWidth }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-soft rounded-full" />
      </div>
    </div>
  );
}
