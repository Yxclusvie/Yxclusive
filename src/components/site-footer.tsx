export function SiteFooter() {
  return (
    <footer className="border-t border-ink-line bg-paper py-8 sm:py-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft sm:px-10">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p>&copy; {new Date().getFullYear()} Yxclusive LLC. Passed it on, not put away.</p>
          <p>Browsing is open to all. Selling is a Yxmember privilege.</p>
        </div>
        <p className="text-[10px] normal-case tracking-normal text-ink-soft/70">
          Yxclusive LLC is not an authorized reseller of any brand, maker, or designer
          referenced on this site.
        </p>
        <p className="text-[10px] normal-case tracking-normal text-ink-soft/70">
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
