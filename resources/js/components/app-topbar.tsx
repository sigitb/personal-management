
import { SidebarTrigger } from "./ui/sidebar";
import { Bell, LogOut, UserRoundPen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

export default function Topbar() {
    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-sidebar border-gray-200 shadow-sm">
            <div className="flex h-16 items-center justify-between px-4">
                {/* Logo + Toggle (mobile) */}
                <div className="flex items-center gap-3">
                    <SidebarTrigger />
                </div>


                {/* Right section */}
                <div className="flex items-center space-x-6">
                    <button className="relative text-gray-600 hover:text-gray-800">
                        <Bell />
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <img
                                src="https://ui-avatars.com/api/?name=John+Doe"
                                alt="User Avatar"
                                className="h-8 w-8 rounded-full ring-2 ring-gray-200"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 rounded-[10px]" align="end" >
                                <div className="flex gap-4 hover:bg-none p-2">
                                        <img
                                            src="https://ui-avatars.com/api/?name=John+Doe"
                                            alt="User Avatar" className="h-8 w-8 rounded-[5px] ring-2 ring-gray-200" />
                                    {/* <div>
                                    </di> */}
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">shadcn</span>
                                        <span className="truncate text-xs">shadcn</span>
                                    </div>
                                </div>
                            {/* <DropdownMenuItem>
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <UserRoundPen />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <LogOut />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
