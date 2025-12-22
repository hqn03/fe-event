import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Link,
  MatchRoute,
  useLocation,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

export function NavMain({ items }) {
  const { pathname } = useLocation({});
  const isEventDetail = pathname.startsWith("/manager/events/");
  const { eventId } = useParams({});
  const navigate = useNavigate({});

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname.startsWith(item.url + "/");
            return (
              <SidebarMenuItem key={item.title}>
                <Link
                  to={item.url}
                  activeProps={{
                    className: "text-blue-600 font-semibold",
                  }}
                >
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
                {/* SUB MENU */}
                {item.children && isActive && (
                  <SidebarMenuSub>
                    {/* <SidebarMenuSubItem>
                      <SidebarMenuSubButton>aaa</SidebarMenuSubButton>
                    </SidebarMenuSubItem> */}

                    {item.children.map((child) => (
                      <SidebarMenuSubItem key={child.title}>
                        <SidebarMenuSubButton
                          onClick={() => {
                            navigate({
                              to: child.url,
                              params: eventId,
                              search: child.search,
                            });
                          }}
                        >
                          {child.title}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                  // <div className="ml-6 mt-1 flex flex-col gap-1">
                  //   {item.children.map((child) => (
                  //     <Link
                  //       key={child.title}
                  //       to={child.url}
                  //       params={eventId}
                  //       search={child.search}
                  //       className="text-sm text-muted-foreground hover:text-foreground"
                  //     >
                  //       {child.title}
                  //     </Link>
                  //   ))}
                  // </div>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
