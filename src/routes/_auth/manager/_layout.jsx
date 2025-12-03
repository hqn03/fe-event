import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "@tanstack/react-router";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/manager/_layout")({
  beforeLoad: ({ context }) => {
    const { data } = context.queryClient.getQueryState(["me"]);
    if (data.role !== "Nhân viên") {
      throw redirect({
        to: "/403",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
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
        <div className="px-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
