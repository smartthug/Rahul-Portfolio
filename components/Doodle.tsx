/**
 * Hand-drawn stick figure with the cat avatar's head, holding a "HI!" sign.
 * Original artwork; sways gently unless reduced motion is requested.
 */
export default function Doodle() {
  return (
    <svg
      viewBox="0 0 90 150"
      className="h-[150px] w-[90px] origin-bottom animate-sway drop-shadow-[2px_2px_0_rgba(0,0,0,0.25)]"
      role="img"
      aria-label="Doodle of Rahul's cat avatar waving a HI sign"
    >
      {/* sign */}
      <line x1="62" y1="22" x2="70" y2="96" stroke="#111" strokeWidth="2.5" />
      <g transform="rotate(-8 62 18)">
        <rect x="44" y="4" width="34" height="22" fill="#ff8fab" stroke="#111" strokeWidth="2.5" />
        <text x="61" y="20" textAnchor="middle" fontFamily="ui-monospace, monospace" fontWeight="900" fontSize="12" fill="#111">
          HI!
        </text>
      </g>
      {/* head: cat silhouette */}
      <path d="M16 54 L20 30 L30 42 L40 42 L50 30 L54 54 Q54 70 35 70 Q16 70 16 54 Z" fill="#111" />
      <circle cx="28" cy="54" r="3.2" fill="#f5f1e8" />
      <circle cx="42" cy="54" r="3.2" fill="#f5f1e8" />
      {/* body: black tee with R */}
      <path d="M22 72 L48 72 L52 112 L18 112 Z" fill="#111" />
      <text x="35" y="98" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="14" fill="#f5f1e8">
        R
      </text>
      {/* arms */}
      <path d="M48 78 L66 70" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 78 L8 96" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      {/* legs */}
      <path d="M28 112 L24 146 M42 112 L46 146" stroke="#111" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
