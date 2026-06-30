import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminModal } from "@/components/admin/admin-modal";
import { TextField, CheckboxField } from "@/components/admin/form-fields";
import { useAdminCrud } from "@/components/admin/use-admin-crud";
import { FadeIn } from "@/components/motion";
import { useLanguage } from "@/hooks/use-language";
import {
  listAdminFlashDeals,
  saveFlashDeal,
  deleteFlashDeal,
  type AdminFlashDeal,
} from "@/lib/api/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/flash-deals")({
  head: () => ({ meta: [{ title: "Admin — Flash deals — GARHY | HYPER" }] }),
  loader: () => listAdminFlashDeals(),
  component: RouteComponent,
});

type Form = {
  label_ar: string;
  label_en: string;
  hint_ar: string;
  hint_en: string;
  discount_pct: string;
  display_order: string;
  is_active: boolean;
};

const empty: Form = {
  label_ar: "",
  label_en: "",
  hint_ar: "",
  hint_en: "",
  discount_pct: "",
  display_order: "0",
  is_active: true,
};

function RouteComponent() {
  const { t, lang } = useLanguage();
  const rows = Route.useLoaderData();
  const { busy, run } = useAdminCrud();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(empty);

  function openCreate() {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  }
  function openEdit(d: AdminFlashDeal) {
    setEditId(d.id);
    setForm({
      label_ar: d.label_ar,
      label_en: d.label_en,
      hint_ar: d.hint_ar,
      hint_en: d.hint_en,
      discount_pct: d.discount_pct,
      display_order: String(d.display_order ?? 0),
      is_active: d.is_active,
    });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await run(
      () =>
        saveFlashDeal({
          data: {
            ...(editId ? { id: editId } : {}),
            label_ar: form.label_ar,
            label_en: form.label_en,
            hint_ar: form.hint_ar,
            hint_en: form.hint_en,
            discount_pct: form.discount_pct,
            display_order: Number(form.display_order) || 0,
            is_active: form.is_active,
          },
        }),
      editId ? "admin.crud.updated" : "admin.crud.created",
    );
    if (res) setOpen(false);
  }

  async function remove(d: AdminFlashDeal) {
    if (!window.confirm(t("admin.crud.confirmDelete"))) return;
    await run(() => deleteFlashDeal({ data: { id: d.id } }), "admin.crud.deleted");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader eyebrow={t("admin.title")} title={t("admin.flashDeals")} />
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> {t("admin.crud.addFlashDeal")}
        </Button>
      </div>

      {rows.length === 0 ? (
        <FadeIn>
          <EmptyState
            icon={<Zap className="h-6 w-6" />}
            title={t("common.empty")}
            description={t("admin.crud.emptyHint")}
          />
        </FadeIn>
      ) : (
        <FadeIn className="mt-6 overflow-x-auto rounded-2xl border border-hairline bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("admin.crud.label")}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("admin.crud.discount")}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("admin.crud.order")}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("admin.crud.status")}
                </th>
                <th scope="col" className="px-4 py-3 text-end font-semibold">
                  {t("admin.crud.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr
                  key={d.id}
                  className="border-t border-hairline transition-colors hover:bg-surface/40"
                >
                  <td className="px-4 py-3 font-medium">
                    {lang === "ar" ? d.label_ar : d.label_en}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{d.discount_pct}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.display_order}</td>
                  <td className="px-4 py-3">
                    <Badge variant={d.is_active ? "default" : "secondary"}>
                      {d.is_active ? t("admin.crud.active") : t("admin.crud.inactive")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("common.edit")}
                        onClick={() => openEdit(d)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("common.delete")}
                        onClick={() => remove(d)}
                      >
                        <Trash2 className="h-4 w-4 text-conversion" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FadeIn>
      )}

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={editId ? t("admin.crud.editFlashDeal") : t("admin.crud.addFlashDeal")}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="fd-label-en"
              label={t("admin.crud.labelEn")}
              value={form.label_en}
              onChange={(v) => setForm((f) => ({ ...f, label_en: v }))}
              required
            />
            <TextField
              id="fd-label-ar"
              label={t("admin.crud.labelAr")}
              value={form.label_ar}
              onChange={(v) => setForm((f) => ({ ...f, label_ar: v }))}
              required
              dir="rtl"
            />
            <TextField
              id="fd-hint-en"
              label={t("admin.crud.hintEn")}
              value={form.hint_en}
              onChange={(v) => setForm((f) => ({ ...f, hint_en: v }))}
              required
            />
            <TextField
              id="fd-hint-ar"
              label={t("admin.crud.hintAr")}
              value={form.hint_ar}
              onChange={(v) => setForm((f) => ({ ...f, hint_ar: v }))}
              required
              dir="rtl"
            />
            <TextField
              id="fd-discount"
              label={t("admin.crud.discount")}
              value={form.discount_pct}
              onChange={(v) => setForm((f) => ({ ...f, discount_pct: v }))}
              required
              placeholder="50%"
            />
            <TextField
              id="fd-order"
              label={t("admin.crud.order")}
              type="number"
              min={0}
              value={form.display_order}
              onChange={(v) => setForm((f) => ({ ...f, display_order: v }))}
            />
          </div>
          <CheckboxField
            id="fd-active"
            label={t("admin.crud.active")}
            checked={form.is_active}
            onChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("common.save")}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
