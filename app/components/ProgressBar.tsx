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
        <span className="text-slate-200">
          Pregunta {current} de {total}
        </span>
        <span className="text-primary-200 bg-primary-900/30 px-2 py-1 rounded-full border border-primary-700/50">
          {percentage}%
        </span>
      </div>
      <div className="relative h-4 bg-dark-700/50 rounded-full overflow-hidden border-2 border-dark-600/50 backdrop-blur-sm">
        <progress 
          className="sr-only"
          value={current}
          max={total}
          aria-label={`Progreso del cuestionario: ${current} de ${total} preguntas completadas`}
        />
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500 ease-out shadow-lg"
          style={{ width: progressWidth }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-soft rounded-full" />
      </div>
    </div>
  );
}
