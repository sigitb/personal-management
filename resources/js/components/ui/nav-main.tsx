import { type NavGroup } from "@/types/nav";
import { Link, usePage } from "@inertiajs/react";
import { SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "./sidebar";
import { resolveUrl } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { ChevronRight } from "lucide-react";
import React from "react";

export function NavMain({ items = [] }: { items: NavGroup[] }) {
    const page = usePage();

    return (
        items.map((group) => (
            <React.Fragment key={group.title}>
                <SidebarGroupLabel className="opacity-90">{group.title}</SidebarGroupLabel>
                {group.items.map((menu) => {
                    const isActive = page.url.startsWith(resolveUrl(menu.href ?? '#'));
                    return (
                        <SidebarMenu key={menu.title}>
                            <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
                                <SidebarMenuItem>
                                    {menu.collapsible ? (
                                        <>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={menu.title} isActive={isActive} className="rounded-[7px]">
                                                    {menu.icon && <menu.icon className="mr-2 h-4 w-4" />}
                                                    <span>{menu.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {menu.subMenu?.map((subItem) => {
                                                        const isSubItemActive = menu.subMenu?.some(subMenu => page.url.startsWith(resolveUrl(subMenu.href ?? '#')));
                                                        return (
                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                <SidebarMenuSubButton asChild isActive={isSubItemActive} className="rounded-[7px]">
                                                                    <Link href={subItem.href ?? '#'} prefetch>
                                                                        <span>{subItem.title}</span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        );
                                                    })}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </>
                                    ) : (
                                        <SidebarMenuButton asChild tooltip={menu.title} isActive={isActive} className="rounded-[7px]">
                                            <Link href={menu.href ?? '#'} prefetch>
                                                {menu.icon && <menu.icon className="mr-2 h-4 w-4" />}
                                                <span>{menu.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenu>
                    );
                })}
            </React.Fragment>
        ))

    )
}