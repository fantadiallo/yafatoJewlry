export function Skeleton({ className = "" }) {
  return <div className={`ske ${className}`} />;
}

export function HeroSkeleton() {
  return (
    <section className="ske-hero">
      <div className="ske-hero-left">
        <Skeleton className="h24 w60 mb12" />
        <Skeleton className="h14 w80 mb8" />
        <Skeleton className="h10 w40" />
      </div>
      <Skeleton className="ske-hero-img" />
    </section>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="ske-card">
      <Skeleton className="ske-card-img" />
      <Skeleton className="h12 w70 mt8" />
      <Skeleton className="h10 w40 mt6" />
    </div>
  );
}
