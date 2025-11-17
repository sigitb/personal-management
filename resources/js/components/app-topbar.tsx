import { SidebarTrigger } from "./ui/sidebar";
import { Bell, LogOut, UserRoundPen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

export default function Topbar() {
    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-sidebar border-b shadow-sm w-full">
            <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6 max-w-full">
                {/* Logo + Toggle (mobile) */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <SidebarTrigger className="h-8 w-8 sm:h-10 sm:w-10" />
                    {/* Optional: Add logo or title here */}
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
                    {/* Notification Bell */}
                    <button 
                        className="relative text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>

                    {/* User Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary rounded-full">
                                <img
                                    src="https://ui-avatars.com/api/?name=John+Doe"
                                    alt="User Avatar"
                                    className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full ring-2 ring-gray-200 hover:ring-primary transition-all cursor-pointer"
                                />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 sm:w-64 rounded-lg" align="end" sideOffset={8}>
                            {/* User Info Header */}
                            <div className="flex gap-3 p-3 hover:bg-accent/50 rounded-t-lg transition-colors">
                                <img
                                    src="https://ui-avatars.com/api/?name=John+Doe"
                                    alt="User Avatar" 
                                    className="h-10 w-10 rounded-lg ring-2 ring-gray-200 flex-shrink-0" 
                                />
                                <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
                                    <span className="truncate font-semibold text-foreground">John Doe</span>
                                    <span className="truncate text-xs text-muted-foreground">john.doe@email.com</span>
                                </div>
                            </div>
                            
                            <DropdownMenuSeparator />

                            {/* Menu Items */}
                            <DropdownMenuItem className="cursor-pointer gap-3 py-2.5">
                                <UserRoundPen className="h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="cursor-pointer gap-3 py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50">
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}