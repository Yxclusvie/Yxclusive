export function BrandMark({
  className,
  signedIn = false,
}: {
  className?: string;
  signedIn?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="48" fill={signedIn ? "#16a34a" : "var(--color-mark-red)"} />
      <circle cx="38" cy="42" r="4" fill="var(--color-ink)" />
      <circle cx="62" cy="42" r="4" fill="var(--color-ink)" />
      <path
        d="M34 60c5 8 27 8 32 0"
        stroke="var(--color-ink)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
