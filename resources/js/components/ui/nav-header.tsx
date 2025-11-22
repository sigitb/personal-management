import { SidebarHeader } from "./sidebar";

export function NavHeader() {
    return (
        <SidebarHeader className="p-5">
            <h1 className="group-data-[collapsible=icon]:hidden font-bold text-2xl text-primary">ADMIN PANEL</h1>
        </SidebarHeader>
    )
}