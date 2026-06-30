import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
  listAdminBrands,
  saveBrand,
  deleteBrand,
  type AdminBrand,
} from "@/lib/api/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/brands")({
  head: () => ({ meta: [{ title: "Admin â€” Brands â€” GARHY | HYPER" }] }),
  loader: () => listAdminBrands(),
  component: RouteComponent,
});

type Form = {
  slug: string;
  name: string;
  logo_url: string;
  display_order: string;
  is_active: boolean;
};

const empty: Form = { slug: "", name: "", logo_url: "", display_order: "0", is_active: true };

function RouteComponent() {
  const { t } = useLanguage();
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
  function openEdit(b: AdminBrand) {
    setEditId(b.id);
    setForm({
      slug: b.slug,
      name: b.name,
      logo_url: b.logo_url ?? "",
      display_order: String(b.display_order ?? 0),
      is_active: b.is_active,
    });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await run(
      () =>
        saveBrand({
          data: {
            ...(editId ? { id: editId } : {}),
            slug: form.slug,
            name: form.name,
            logo_url: form.logo_url || null,
            display_order: Number(form.display_order) || 0,
            is_active: form.is_active,
          },
        }),
      editId ? "admin.crud.updated" : "admin.crud.created",
    );
    if (res) setOpen(false);
  }

  async function remove(b: AdminBrand) {
    if (!window.confirm(t("admin.crud.confirmDelete"))) return;
    await run(() => deleteBrand({ data: { id: b.id } }), "admin.crud.deleted");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader eyebrow={t("admin.title")} title={t("admin.brands")} />
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> {t("admin.crud.addBrand")}
        </Button>
      </div>

      {rows.length === 0 ? (
        <FadeIn>
          <EmptyState
            icon={<Star className="h-6 w-6" />}
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
                  {t("admin.crud.name")}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("admin.crud.slug")}
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
              {rows.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-hairline transition-colors hover:bg-surface/40"
                >
                  <td className="px-4 py-3 font-medium">{b.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.slug}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.display_order}</td>
                  <td className="px-4 py-3">
                    <Badge variant={b.is_active ? "default" : "secondary"}>
                      {b.is_active ? t("admin.crud.active") : t("admin.crud.inactive")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("common.edit")}
                        onClick={() => openEdit(b)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("common.delete")}
                        onClick={() => remove(b)}
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
        title={editId ? t("admin.crud.editBrand") : t("admin.crud.addBrand")}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="b-name"
              label={t("admin.crud.name")}
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              required
            />
            <TextField
              id="b-slug"
              label={t("admin.crud.slug")}
              value={form.slug}
              onChange={(v) => setForm((f) => ({ ...f, slug: v }))}
              required
            />
            <TextField
              id="b-logo"
              label={t("admin.crud.logoUrl")}
              value={form.logo_url}
              onChange={(v) => setForm((f) => ({ ...f, logo_url: v }))}
              placeholder="https://â€¦"
            />
            <TextField
              id="b-order"
              label={t("admin.crud.order")}
              type="number"
              min={0}
              value={form.display_order}
              onChange={(v) => setForm((f) => ({ ...f, display_order: v }))}
            />
          </div>
          <CheckboxField
            id="b-active"
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

