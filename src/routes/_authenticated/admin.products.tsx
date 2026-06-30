import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminModal } from "@/components/admin/admin-modal";
import {
  TextField,
  TextareaField,
  SelectField,
  CheckboxField,
} from "@/components/admin/form-fields";
import { useAdminCrud } from "@/components/admin/use-admin-crud";
import { FadeIn } from "@/components/motion";
import { useLanguage } from "@/hooks/use-language";
import {
  listAdminProducts,
  listAdminCategories,
  saveProduct,
  deleteProduct,
  type AdminProduct,
} from "@/lib/api/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/products")({
  head: () => ({ meta: [{ title: "Admin â€” Products â€” GARHY | HYPER" }] }),
  loader: async () => {
    const [products, categories] = await Promise.all([listAdminProducts(), listAdminCategories()]);
    return { products, categories };
  },
  component: RouteComponent,
});

type Badge4 = "best-seller" | "trending" | "new" | "limited" | "";

type Form = {
  slug: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  brand_name: string;
  category_id: string;
  price: string;
  compare_at_price: string;
  image_url: string;
  gallery_urls: string;
  badge: Badge4;
  stock_quantity: string;
  is_active: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_trending: boolean;
  is_recommended: boolean;
  free_shipping: boolean;
  fast_delivery: boolean;
};

const empty: Form = {
  slug: "",
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  brand_name: "",
  category_id: "",
  price: "",
  compare_at_price: "",
  image_url: "",
  gallery_urls: "",
  badge: "",
  stock_quantity: "0",
  is_active: true,
  is_featured: false,
  is_best_seller: false,
  is_new_arrival: false,
  is_trending: false,
  is_recommended: false,
  free_shipping: false,
  fast_delivery: false,
};

function RouteComponent() {
  const { t, lang } = useLanguage();
  const { products, categories } = Route.useLoaderData();
  const { busy, run } = useAdminCrud();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(empty);

  function openCreate() {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  }
  function openEdit(p: AdminProduct) {
    setEditId(p.id);
    setForm({
      slug: p.slug,
      title_ar: p.title_ar,
      title_en: p.title_en,
      description_ar: p.description_ar ?? "",
      description_en: p.description_en ?? "",
      brand_name: p.brand_name ?? "",
      category_id: p.category_id ?? "",
      price: String(p.price),
      compare_at_price: p.compare_at_price != null ? String(p.compare_at_price) : "",
      image_url: p.image_url,
      gallery_urls: (p.gallery_urls ?? []).join("\n"),
      badge: (p.badge ?? "") as Badge4,
      stock_quantity: String(p.stock_quantity ?? 0),
      is_active: p.is_active,
      is_featured: p.is_featured,
      is_best_seller: p.is_best_seller,
      is_new_arrival: p.is_new_arrival,
      is_trending: p.is_trending,
      is_recommended: p.is_recommended,
      free_shipping: p.free_shipping,
      fast_delivery: p.fast_delivery,
    });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const gallery = form.gallery_urls
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await run(
      () =>
        saveProduct({
          data: {
            ...(editId ? { id: editId } : {}),
            slug: form.slug,
            title_ar: form.title_ar,
            title_en: form.title_en,
            description_ar: form.description_ar || null,
            description_en: form.description_en || null,
            brand_name: form.brand_name || null,
            category_id: form.category_id || null,
            price: Number(form.price) || 0,
            compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
            image_url: form.image_url,
            gallery_urls: gallery,
            badge: form.badge ? form.badge : null,
            stock_quantity: Number(form.stock_quantity) || 0,
            is_active: form.is_active,
            is_featured: form.is_featured,
            is_best_seller: form.is_best_seller,
            is_new_arrival: form.is_new_arrival,
            is_trending: form.is_trending,
            is_recommended: form.is_recommended,
            free_shipping: form.free_shipping,
            fast_delivery: form.fast_delivery,
          },
        }),
      editId ? "admin.crud.updated" : "admin.crud.created",
    );
    if (res) setOpen(false);
  }

  async function remove(p: AdminProduct) {
    if (!window.confirm(t("admin.crud.confirmDelete"))) return;
    await run(() => deleteProduct({ data: { id: p.id } }), "admin.crud.deleted");
  }

  const categoryOptions = [
    { value: "", label: t("admin.crud.none") },
    ...categories.map((c) => ({ value: c.id, label: lang === "ar" ? c.name_ar : c.name_en })),
  ];

  const badgeOptions = [
    { value: "", label: t("admin.crud.none") },
    { value: "best-seller", label: t("admin.crud.badgeBestSeller") },
    { value: "trending", label: t("admin.crud.badgeTrending") },
    { value: "new", label: t("admin.crud.badgeNew") },
    { value: "limited", label: t("admin.crud.badgeLimited") },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader eyebrow={t("admin.title")} title={t("admin.inventory")} />
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> {t("admin.crud.addProduct")}
        </Button>
      </div>

      {products.length === 0 ? (
        <FadeIn>
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title={t("common.empty")}
            description={t("admin.crud.emptyHint")}
          />
        </FadeIn>
      ) : (
        <FadeIn className="mt-6 overflow-x-auto rounded-2xl border border-hairline bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-surface/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("admin.crud.product")}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("admin.crud.price")}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("admin.crud.stock")}
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
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-hairline transition-colors hover:bg-surface/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt=""
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          className="h-10 w-10 shrink-0 rounded-md border border-hairline object-cover"
                        />
                      ) : (
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-hairline text-muted-foreground">
                          <Package className="h-4 w-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {lang === "ar" ? p.title_ar : p.title_en}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.price}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.stock_quantity}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.is_active ? "default" : "secondary"}>
                      {p.is_active ? t("admin.crud.active") : t("admin.crud.inactive")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("common.edit")}
                        onClick={() => openEdit(p)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("common.delete")}
                        onClick={() => remove(p)}
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
        title={editId ? t("admin.crud.editProduct") : t("admin.crud.addProduct")}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="p-title-en"
              label={t("admin.crud.titleEn")}
              value={form.title_en}
              onChange={(v) => setForm((f) => ({ ...f, title_en: v }))}
              required
            />
            <TextField
              id="p-title-ar"
              label={t("admin.crud.titleAr")}
              value={form.title_ar}
              onChange={(v) => setForm((f) => ({ ...f, title_ar: v }))}
              required
              dir="rtl"
            />
            <TextField
              id="p-slug"
              label={t("admin.crud.slug")}
              value={form.slug}
              onChange={(v) => setForm((f) => ({ ...f, slug: v }))}
              required
            />
            <TextField
              id="p-brand"
              label={t("admin.crud.brandName")}
              value={form.brand_name}
              onChange={(v) => setForm((f) => ({ ...f, brand_name: v }))}
            />
            <TextField
              id="p-price"
              label={t("admin.crud.price")}
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(v) => setForm((f) => ({ ...f, price: v }))}
              required
            />
            <TextField
              id="p-compare"
              label={t("admin.crud.compareAt")}
              type="number"
              min={0}
              step="0.01"
              value={form.compare_at_price}
              onChange={(v) => setForm((f) => ({ ...f, compare_at_price: v }))}
            />
            <SelectField
              id="p-category"
              label={t("admin.categories")}
              value={form.category_id}
              onChange={(v) => setForm((f) => ({ ...f, category_id: v }))}
              options={categoryOptions}
            />
            <SelectField
              id="p-badge"
              label={t("admin.crud.badge")}
              value={form.badge}
              onChange={(v) => setForm((f) => ({ ...f, badge: v as Badge4 }))}
              options={badgeOptions}
            />
            <TextField
              id="p-stock"
              label={t("admin.crud.stock")}
              type="number"
              min={0}
              value={form.stock_quantity}
              onChange={(v) => setForm((f) => ({ ...f, stock_quantity: v }))}
            />
            <TextField
              id="p-image"
              label={t("admin.crud.imageUrl")}
              value={form.image_url}
              onChange={(v) => setForm((f) => ({ ...f, image_url: v }))}
              required
              placeholder="https://â€¦"
            />
          </div>

          <TextareaField
            id="p-gallery"
            label={t("admin.crud.galleryUrls")}
            value={form.gallery_urls}
            onChange={(v) => setForm((f) => ({ ...f, gallery_urls: v }))}
          />
          <TextareaField
            id="p-desc-en"
            label={t("admin.crud.descEn")}
            value={form.description_en}
            onChange={(v) => setForm((f) => ({ ...f, description_en: v }))}
          />
          <TextareaField
            id="p-desc-ar"
            label={t("admin.crud.descAr")}
            value={form.description_ar}
            onChange={(v) => setForm((f) => ({ ...f, description_ar: v }))}
            dir="rtl"
          />

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <CheckboxField
              id="p-active"
              label={t("admin.crud.active")}
              checked={form.is_active}
              onChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
            />
            <CheckboxField
              id="p-featured"
              label={t("admin.crud.featured")}
              checked={form.is_featured}
              onChange={(v) => setForm((f) => ({ ...f, is_featured: v }))}
            />
            <CheckboxField
              id="p-best"
              label={t("admin.crud.bestSeller")}
              checked={form.is_best_seller}
              onChange={(v) => setForm((f) => ({ ...f, is_best_seller: v }))}
            />
            <CheckboxField
              id="p-new"
              label={t("admin.crud.newArrival")}
              checked={form.is_new_arrival}
              onChange={(v) => setForm((f) => ({ ...f, is_new_arrival: v }))}
            />
            <CheckboxField
              id="p-trending"
              label={t("admin.crud.trending")}
              checked={form.is_trending}
              onChange={(v) => setForm((f) => ({ ...f, is_trending: v }))}
            />
            <CheckboxField
              id="p-recommended"
              label={t("admin.crud.recommended")}
              checked={form.is_recommended}
              onChange={(v) => setForm((f) => ({ ...f, is_recommended: v }))}
            />
            <CheckboxField
              id="p-shipping"
              label={t("admin.crud.freeShipping")}
              checked={form.free_shipping}
              onChange={(v) => setForm((f) => ({ ...f, free_shipping: v }))}
            />
            <CheckboxField
              id="p-fast"
              label={t("admin.crud.fastDelivery")}
              checked={form.fast_delivery}
              onChange={(v) => setForm((f) => ({ ...f, fast_delivery: v }))}
            />
          </div>

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


