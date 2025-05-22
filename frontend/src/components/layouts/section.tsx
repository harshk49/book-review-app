import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function Section({
  children,
  className = "",
  title,
  description,
}: SectionProps) {
  return (
    <section className={`container py-12 md:py-16 lg:py-24 ${className}`}>
      {title && (
        <div className="mb-8 text-center md:mb-12">
          <h2 className="mb-2 text-2xl font-bold md:text-3xl lg:text-4xl md:mb-4">
            {title}
          </h2>
          {description && (
            <p className="max-w-3xl mx-auto text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
