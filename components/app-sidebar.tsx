"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Shield,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/server"
import { User } from "@supabase/supabase-js"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: PieChart,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        }
      ]
    },
    {
      title: "Catálogos",
      url: "/catalogos",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Empresas",
          url: "/catalogos/empresas",
          items: [
            { title: "CRUD", url: "/catalogos/empresas/crud" },
            { title: "Datos Fiscales", url: "/catalogos/empresas/datos-fiscales" },
            { title: "Configuración", url: "/catalogos/empresas/configuracion" }
          ]
        },
        {
          title: "Sucursales",
          url: "/catalogos/sucursales",
          items: [
            { title: "CRUD", url: "/catalogos/sucursales/crud" },
            { title: "Vinculación", url: "/catalogos/sucursales/vinculacion" }
          ]
        }
      ]
    },
    {
      title: "Inventario y Equipos",
      url: "/inventario",
      icon: Frame,
      items: [
        {
          title: "Órdenes de Compra",
          url: "/inventario/ordenes",
          items: [
            { title: "Proveedores", url: "/inventario/ordenes/proveedores" },
            { title: "Gestión", url: "/inventario/ordenes/gestion" },
            { title: "Seguimiento", url: "/inventario/ordenes/seguimiento" }
          ]
        },
        {
          title: "Recepción",
          url: "/inventario/recepcion",
          items: [
            { title: "Escaneo/Registro", url: "/inventario/recepcion/escaneo" },
            { title: "Etiquetado", url: "/inventario/recepcion/etiquetado" },
            { title: "Control", url: "/inventario/recepcion/control" }
          ]
        },
        {
          title: "Telemetría",
          url: "/inventario/telemetria",
          items: [
            { title: "Instalación Sensores", url: "/inventario/telemetria/sensores" },
            { title: "Control Calidad", url: "/inventario/telemetria/calidad" }
          ]
        },
        {
          title: "Equipos",
          url: "/inventario/equipos",
          items: [
            { title: "Dashboard", url: "/inventario/equipos/dashboard" },
            { title: "Alertas Stock", url: "/inventario/equipos/alertas" }
          ]
        }
      ]
    },
    {
      title: "Ventas y Contratos",
      url: "/ventas",
      icon: PieChart,
      items: [
        {
          title: "Contratos",
          url: "/ventas/contratos",
          items: [
            { title: "Clientes y Planes", url: "/ventas/contratos/clientes" },
            { title: "Descuentos", url: "/ventas/contratos/descuentos" },
            { title: "Domiciliación", url: "/ventas/contratos/domiciliacion" }
          ]
        },
        {
          title: "Vendedores",
          url: "/ventas/vendedores",
          items: [
            { title: "Gestión", url: "/ventas/vendedores/gestion" },
            { title: "Comisiones", url: "/ventas/vendedores/comisiones" }
          ]
        },
        {
          title: "Precios",
          url: "/ventas/precios",
          items: [
            { title: "Historial", url: "/ventas/precios/historial" },
            { title: "Bonificaciones", url: "/ventas/precios/bonificaciones" }
          ]
        }
      ]
    },
    {
      title: "Instalación",
      url: "/instalacion",
      icon: Settings2,
      items: [
        {
          title: "App Móvil",
          url: "/instalacion/app",
          items: [
            { title: "Interfaz", url: "/instalacion/app/interfaz" },
            { title: "Equipos Asignados", url: "/instalacion/app/equipos" },
            { title: "Registro", url: "/instalacion/app/registro" }
          ]
        },
        {
          title: "Monitoreo",
          url: "/instalacion/monitoreo",
          items: [
            { title: "Recolección Datos", url: "/instalacion/monitoreo/datos" },
            { title: "Calidad Agua", url: "/instalacion/monitoreo/calidad" },
            { title: "Estado Filtros", url: "/instalacion/monitoreo/filtros" }
          ]
        },
        {
          title: "Dashboard",
          url: "/instalacion/dashboard",
          items: [
            { title: "Visualización", url: "/instalacion/dashboard/vista" },
            { title: "Alertas", url: "/instalacion/dashboard/alertas" },
            { title: "Reportes", url: "/instalacion/dashboard/reportes" }
          ]
        }
      ]
    },
    {
      title: "Seguridad",
      url: "/seguridad", 
      icon: Shield,
      items: [
        {
          title: "Roles y Permisos",
          url: "/seguridad/roles",
          items: [
            { title: "Implementación", url: "/seguridad/roles/implementacion" },
            { title: "Auditoría", url: "/seguridad/roles/auditoria" }
          ]
        },
        {
          title: "Control de Usuarios",
          url: "/seguridad/usuarios",
          items: [
            { title: "Gestión", url: "/seguridad/usuarios/gestion" },
            { title: "Accesos", url: "/seguridad/usuarios/accesos" }
          ]
        },
        {
          title: "Logs",
          url: "/seguridad/logs",
          items: [
            { title: "Registro de Actividad", url: "/seguridad/logs/actividad" },
            { title: "Alertas", url: "/seguridad/logs/alertas" }
          ]
        }
      ]
    }
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

// Fix the type definition by separating the props
type AppSidebarProps = React.ComponentProps<typeof Sidebar> & { user: User }

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
