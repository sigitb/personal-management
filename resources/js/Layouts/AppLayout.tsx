import { AppSidebar } from "@/components/app-sidebar"
import Topbar from "@/components/app-topbar"
import { FlashNotification } from "@/components/toast/flash-notification"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <FlashNotification />
            <SidebarProvider>
                <div className="flex h-screen w-screen overflow-hidden bg-background">
                    {/* Sidebar */}
                    <AppSidebar />

                    {/* Main Content Area */}
                    <SidebarInset className="flex-1 flex flex-col min-w-0">
                        {/* Topbar */}
                        <Topbar />

                        {/* Main Content with Scroll */}
                        <main className="flex-1 overflow-y-auto overflow-x-hidden">
                            <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-full">
                                {children}
                            </div>
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </>
    )
}