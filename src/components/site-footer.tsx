export function SiteFooter() {
  return (
    <footer className="border-t border-ink-line bg-paper py-3">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-0.5 px-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-10">
        <p className="text-[10px] leading-snug text-ink-soft/70">
          Yxclusive LLC is not an authorized reseller of any brand, maker, or designer
          referenced on this site.
        </p>
        <p className="text-[10px] leading-snug text-ink-soft/70">
          Any questions? Contact us at{" "}
          <a href="mailto:team@yxclusive.com" className="underline underline-offset-2">
            team@yxclusive.com
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
