interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`
        relative border border-rule bg-sheet/60
        ${hover ? "transition-colors duration-150 hover:border-rule-2 hover:bg-board" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-b border-rule px-4 py-3 sm:px-5 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 py-4 sm:px-5 sm:py-5 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`font-display text-base font-bold tracking-[-0.025em] text-ink ${className}`}>
      {children}
    </h3>
  );
}
