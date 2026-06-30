import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AccountSidebar } from "@/components/layout/account-sidebar";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountLayout,
});

function AccountLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <AccountSidebar />
            <div className="min-w-0 flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
