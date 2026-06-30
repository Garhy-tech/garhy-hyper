import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Tag, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
  listAdminCategories,
  saveCategory,
  deleteCategory,
  type AdminCategory,
} from "@/lib/api/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  head: () => ({ meta: [{ title: "Admin — Categories — GARHY | HYPER" }] }),
  loader: () => listAdminCategories(),
  component: RouteComponent,
});

type Form = {
  slug: string;
  name_ar: string;
  name_en: string;
  display_order: string;
  is_active: boolean;
};

const empty: Form = { slug: "", name_ar: "", name_en: "", display_order: "0", is_active: true };

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
  function openEdit(c: AdminCategory) {
    setEditId(c.id);
    setForm({
      slug: c.slug,
      name_ar: c.name_ar,
      name_en: c.name_en,
      display_order: String(c.display_order ?? 0),
      is_active: c.is_active,
    });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await run(
      () =>
        saveCategory({
          data: {
            ...(editId ? { id: editId } : {}),
            slug: form.slug,
            name_ar: form.name_ar,
            name_en: form.name_en,
            display_order: Number(form.display_order) || 0,
            is_active: form.is_active,
          },
        }),
      editId ? "admin.crud.updated" : "admin.crud.created",
    );
    if (res) setOpen(false);
  }

  async function remove(c: AdminCategory) {
    if (!window.confirm(t("admin.crud.confirmDelete"))) return;
    await run(() => deleteCategory({ data: { id: c.id } }), "admin.crud.deleted");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader eyebrow={t("admin.title")} title={t("admin.categories")} />
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> {t("admin.crud.addCategory")}
        </Button>
      </div>

      {rows.length === 0 ? (
        <FadeIn>
          <EmptyState
            icon={<Tag className="h-6 w-6" />}
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
              {rows.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-hairline transition-colors hover:bg-surface/40"
                >
                  <td className="px-4 py-3 font-medium">{lang === "ar" ? c.name_ar : c.name_en}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.display_order}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.is_active ? "default" : "secondary"}>
                      {c.is_active ? t("admin.crud.active") : t("admin.crud.inactive")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("common.edit")}
                        onClick={() => openEdit(c)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("common.delete")}
                        onClick={() => remove(c)}
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
        title={editId ? t("admin.crud.editCategory") : t("admin.crud.addCategory")}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="name_en"
              label={t("admin.crud.nameEn")}
              value={form.name_en}
              onChange={(v) => setForm((f) => ({ ...f, name_en: v }))}
              required
            />
            <TextField
              id="name_ar"
              label={t("admin.crud.nameAr")}
              value={form.name_ar}
              onChange={(v) => setForm((f) => ({ ...f, name_ar: v }))}
              required
              dir="rtl"
            />
            <TextField
              id="slug"
              label={t("admin.crud.slug")}
              value={form.slug}
              onChange={(v) => setForm((f) => ({ ...f, slug: v }))}
              required
            />
            <TextField
              id="display_order"
              label={t("admin.crud.order")}
              type="number"
              min={0}
              value={form.display_order}
              onChange={(v) => setForm((f) => ({ ...f, display_order: v }))}
            />
          </div>
          <CheckboxField
            id="is_active"
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
