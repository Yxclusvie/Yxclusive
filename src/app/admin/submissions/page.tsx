import { SubmissionActions } from "@/components/admin/submission-actions";
import { getSubmissionsForAdmin, type SubmissionStatus } from "@/lib/submissions";

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined",
};

export default async function AdminSubmissionsPage() {
  const submissions = await getSubmissionsForAdmin();
  const pendingCount = submissions.filter((entry) => entry.status === "pending").length;

  return (
    <div>
      <p className="font-display text-2xl text-ink">
        Submissions ({submissions.length})
        {pendingCount > 0 && (
          <span className="ml-3 align-middle font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep">
            {pendingCount} pending
          </span>
        )}
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        Pieces members have sent in to sell. Approving one opens the product form pre-filled.
      </p>

      {submissions.length === 0 ? (
        <div className="mt-6 rounded-sm border border-ink-line bg-paper px-5 py-10 text-center text-sm text-ink-soft">
          No submissions yet.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {submissions.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-sm border border-ink-line bg-paper p-4 ${
                entry.status === "declined" ? "opacity-60" : ""
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg text-ink">{entry.itemName}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] ${
                        entry.status === "pending"
                          ? "bg-ink text-cream"
                          : "border border-ink-line text-ink-soft"
                      }`}
                    >
                      {STATUS_LABEL[entry.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                    {entry.designer} · {entry.category}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    <a href={`mailto:${entry.email}`} className="underline underline-offset-2">
                      {entry.email}
                    </a>{" "}
                    · {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <SubmissionActions
                  id={entry.id}
                  status={entry.status}
                  productId={entry.productId}
                />
              </div>

              {entry.details && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                  {entry.details}
                </p>
              )}
              {entry.adminNote && (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                  Note: {entry.adminNote}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {entry.images.map((image) => (
                  <a key={image.url} href={image.url} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt=""
                      className="h-24 w-24 rounded-sm border border-ink-line object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
