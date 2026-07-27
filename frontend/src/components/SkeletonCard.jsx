import "./SkeletonCard.css";

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skel skel-img" />
      <div className="skel skel-title" />
      <div className="skel skel-sub" />
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
