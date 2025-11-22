import { Calendar, CalendarCheck, ClipboardCheck, FolderKanban, FolderKanbanIcon, HandCoins, Home, Inbox, Receipt, Search, Settings, Wallet, WalletCards, WalletMinimal } from "lucide-react"

import {
  Sidebar,
  SidebarContent
} from "@/components/ui/sidebar"
import { NavMain } from "./ui/nav-main"
import { NavGroup } from "@/types/nav"
import { NavHeader } from "./ui/nav-header"

// Menu items.
const MainNavMenu:NavGroup[] = [
  {
    title:"Dashboard",
    items:[
      {
        title:"Dashboard",
        href:"/admin-panel/dashboard",
        icon:Home
      }
    ]
  },
  {
    title:"Master Data",
    items:[
      {
        title:"Finance",
        icon:Receipt,
        collapsible:true,
        subMenu:[
          {
            title:"Finance Type",
            href:"/admin-panel/finance/type"
          },
          {
            title:"Finance Category",
            href:"#"
          }
        ]
      },
      {
        title:"Project",
        icon:FolderKanban,
        collapsible:true,
        subMenu:[
          {
            title:"Project",
            href:"#"
          },
          {
            title:"Project Board",
            href:"#"
          }
        ]
      },
    ]
  },
  {
    title:"Transaction",
    items:[
      {
        title:"Finance Personal",
        href:"#",
        icon:Wallet
      },
      {
        title:"Finance Project",
        href:"#",
        icon:HandCoins
      }
    ]
  },
  {
    title:"Project",
    items:[
      {
        title:"Project Issue",
        href:"#",
        icon: ClipboardCheck
      },
      {
        title:"Project Calender",
        href:"#",
        icon:CalendarCheck
      },
    ]
  },
  {
    title:"Report",
    items:[
      {
        title:"Report Finance Personal",
        href:"#",
        icon:WalletCards
      },
      {
        title:"Report Finance Project",
        href:"#",
        icon:WalletMinimal
      },
    ]
  }
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <NavHeader/>
      <SidebarContent className="px-2">
        <NavMain items={MainNavMenu} />
      </SidebarContent>
    </Sidebar>
  )
}