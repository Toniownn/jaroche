import type { ReactNode } from 'react';

interface PageHeroProps {
  kicker?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
}

export function PageHero({ kicker, title, sub }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        {kicker && <span className="kicker">{kicker}</span>}
        <h1 className="page-hero-title">{title}</h1>
        {sub && <p className="page-hero-sub">{sub}</p>}
      </div>
    </section>
  );
}
