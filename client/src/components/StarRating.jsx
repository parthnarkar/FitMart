/**
 * StarRating Component
 * Displays a 5-star rating with support for half stars
 * 
 * @param {Object} props
 * @param {number} props.rating - Rating value (0-5, supports decimals)
 * @param {string} props.size - Size variant: "sm" (default) or "lg"
 * @param {string} props.color - Star color variant: "default" (stone-500) or "dark" (stone-700)
 */
const StarRating = ({ rating = 0, size = "sm", color = "default" }) => {
  const full = Math.floor(rating || 0);
  const half = (rating || 0) % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const starPath = "M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.595 0 9.748l8.332-1.73L12 .587z";
  const sizeClass = size === "lg" ? "w-4 h-4" : "w-3 h-3";
  const fillColor = color === "dark" ? "text-stone-700" : "text-stone-500";

  return (
    <span className={`inline-flex items-center gap-0.5 ${size === "lg" ? "text-base" : "text-xs"}`} aria-hidden>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`full-${i}`} className={`${sizeClass} ${fillColor}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d={starPath} fill="currentColor" />
        </svg>
      ))}

      {half ? (() => {
        const id = `half-${Math.random().toString(36).slice(2)}`;
        return (
          <svg key="half" className={`${sizeClass} ${fillColor}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id={id}><rect x="0" y="0" width="12" height="24" /></clipPath>
            </defs>
            {/* faint empty star behind */}
            <path d={starPath} fill="currentColor" className="text-stone-300" style={{ fill: 'currentColor', opacity: 0.28 }} />
            {/* filled half */}
            <path d={starPath} fill="currentColor" clipPath={`url(#${id})`} />
          </svg>
        );
      })() : null}

      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`empty-${i}`} className={`${sizeClass} text-stone-300`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d={starPath} fill="currentColor" style={{ opacity: 0.28 }} />
        </svg>
      ))}
    </span>
  );
};

export default StarRating;
