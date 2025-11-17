import { AppSidebar } from "@/components/app-sidebar"
import Topbar from "@/components/app-topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto p-4">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    )
}