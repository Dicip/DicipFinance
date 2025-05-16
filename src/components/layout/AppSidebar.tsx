
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
// Button import is not used, can be removed if not needed elsewhere.
// import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Panel de Control", icon: LayoutDashboard },
  { href: "/transactions", label: "Transacciones", icon: ArrowRightLeft },
  { href: "/categories", label: "Categorías", icon: Tags, disabled: true },
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
                   // Action Button (e.g., Logout)
                   <SidebarMenuButton
                     // asChild is false by default, SidebarMenuButton renders a <button>
                     tooltip={item.label}
                     disabled={item.disabled}
                     aria-disabled={item.disabled}
                     onClick={(e) => {
                       e.preventDefault();
                       // Placeholder for action:
                       console.log(`Action: ${item.label} clicked`);
                       // TODO: Implement actual logout logic or other action
                     }}
                   >
                     <item.icon />
                     <span>{item.label}</span>
                   </SidebarMenuButton>
                 ) : (
                   // Navigation Link
                   <Link href={item.href} passHref legacyBehavior>
                     <SidebarMenuButton
                       asChild // SidebarMenuButton renders a <Slot>
                       isActive={pathname === item.href}
                       tooltip={item.label}
                       disabled={item.disabled}
                       aria-disabled={item.disabled}
                     >
                       <a> {/* This <a> is the child of Slot and styled by SidebarMenuButton */}
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

