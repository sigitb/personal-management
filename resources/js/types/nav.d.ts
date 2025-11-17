import { InertiaLinkProps } from "@inertiajs/react"
import { LucideIcon } from "lucide-react"

export interface NavGroup {
    title: string
    items: NavItem[]
}

export interface NavItem {
    title: string
    href?: InertiaLinkProps['href']
    icon?: LucideIcon | null
    isActive?: boolean
    collapsible?: boolean
    subMenu?: SubMenuItem[]
}

export interface SubMenuItem {
    title: string
    href: InertiaLinkProps['href']
    isActive?: boolean
}