import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { FadeIn } from "@/components/motion";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/orders/$id")({
  head: ({ params }) => ({ meta: [{ title: `Order ${params.id} â€” GARHY | HYPER` }] }),
  component: OrderTracking,
});

function OrderTracking() {
  const { id } = Route.useParams();
  const { t } = useLanguage();
  const steps = ["Placed", "Confirmed", "Shipped", "Delivered"];
  return (
    <div>
      <PageHeader eyebrow={`#${id}`} title={t("account.orderTracking")} />
      <FadeIn>
        <div className="max-w-2xl rounded-2xl border border-hairline bg-card p-6 shadow-soft sm:p-8">
          <ol className="space-y-0">
            {steps.map((step, i) => {
              const done = i === 0;
              const isLast = i === steps.length - 1;
              return (
                <li key={step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${done ? "border-gold bg-gold text-gold-foreground" : "border-hairline text-muted-foreground"}`}
                    >
                      {done ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-semibold">{i + 1}</span>
                      )}
                    </div>
                    {!isLast && <span className="mt-1 w-px flex-1 bg-hairline" aria-hidden />}
                  </div>
                  <div className={isLast ? "" : "pb-6"}>
                    <p className="font-medium">{step}</p>
                    <p className="text-xs text-muted-foreground">â€”</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </FadeIn>
    </div>
  );
}

