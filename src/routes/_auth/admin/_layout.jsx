import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "@tanstack/react-router";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/_auth/admin/_layout")({
  beforeLoad: ({ context }) => {
    const { data } = context.queryClient.getQueryState(["me"]);
    if (data.role !== "Super Admin") {
      throw redirect({
        to: "/403",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {/* <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"> */}
          {/* <SectionCards /> */}
          {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} /> */}
          {/* </div>
          </div>
        </div> */}
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
