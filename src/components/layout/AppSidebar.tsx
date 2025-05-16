
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { DicipFinanceLogo } from "@/components/icons/Logo";
import { LayoutDashboard, Tags, Target, Settings, LogOut, ArrowRightLeft } from "lucide-react";

const navItems = [
  { href: "/", label: "Panel de Control", icon: LayoutDashboard },
  { href: "/transactions", label: "Transacciones", icon: ArrowRightLeft },
  { href: "/categories", label: "Categorías", icon: Tags, disabled: false },
  { href: "/budgets", label: "Presupuestos", icon: Target, disabled: true },
];

const footerNavItems = [
    { href: "/settings", label: "Configuración", icon: Settings, disabled: false },
    { href: "#logout", label: "Cerrar Sesión", icon: LogOut, disabled: true }, //  Simulando un enlace de cierre de sesión
];


export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <DicipFinanceLogo className="h-8 w-auto group-data-[collapsible=icon]:hidden" />
          <span className="sr-only group-data-[collapsible=icon]:not-sr-only">
             <DicipFinanceLogo className="h-8 w-auto hidden group-data-[collapsible=icon]:block" />
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  disabled={item.disabled}
                  aria-disabled={item.disabled}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            {footerNavItems.map((item) => (
                 <SidebarMenuItem key={item.label}>
                 {item.href.startsWith("#") ? (
                   <SidebarMenuButton
                     tooltip={item.label}
                     disabled={item.disabled}
                     aria-disabled={item.disabled}
                     onClick={(e) => {
                       e.preventDefault();
                       console.log(`Action: ${item.label} clicked`);
                     }}
                   >
                     <item.icon />
                     <span>{item.label}</span>
                   </SidebarMenuButton>
                 ) : (
                   <Link href={item.href} passHref legacyBehavior>
                     <SidebarMenuButton
                       asChild
                       isActive={pathname === item.href}
                       tooltip={item.label}
                       disabled={item.disabled}
                       aria-disabled={item.disabled}
                     >
                       <a>
                         <item.icon />
                         <span>{item.label}</span>
                       </a>
                     </SidebarMenuButton>
                   </Link>
                 )}
               </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
