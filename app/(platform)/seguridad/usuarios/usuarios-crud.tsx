"use client";

import { Column, CRUD } from "@/components/crud";
import { InfoExtraUsuario, UsuarioForm } from "./usuario-form";
import { createUsuario, updateUsuario, deleteUsuario } from "./actions";
import { User } from "@/lib/db/security/user.model";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/lib/db/security/roles.model";

type UsuariosCRUDProps = {
  initialUsers: User[];
  initialRoles: Role[];
};

export function UsuariosCRUD({ initialUsers, initialRoles }: UsuariosCRUDProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    setRoles(initialRoles);
  }, [initialRoles]);

  const columns: Column<User>[] = [
    // { key: "UserId", label: "ID", sortable: true },
    { key: "Email", label: "Correo Electrónico", sortable: true },
    { key: "FirstName", label: "Primer Nombre", sortable: true },
    { key: "SecondName", label: "Segundo Nombre", sortable: true },
    { key: "LastNameFather", label: "Apellido Paterno", sortable: true },
    // { key: "LastNameMother", label: "Apellido Materno", sortable: true },
    { key: "Role", label: "Rol", sortable: true,
      render: (value: any) => {
        if (typeof value === 'object' && value !== null) {
          return value.Name ? <Badge variant="default">{value.Name}</Badge> : <Badge variant="destructive">Sin Rol</Badge>;
        }
        return value ? <Badge variant="default">{value?.Name}</Badge> : <Badge variant="destructive">Sin Rol</Badge>;
      }
     },
    { key: 'IsActive', label: 'Estatus', sortable: true,
      render: (value: any) => {
        if (typeof value === 'object' && value !== null && 'IsActive' in value) {
          return value.IsActive ? <Badge variant="default">Activo</Badge> : <Badge variant="destructive">Inactivo</Badge>;
        }
        return value ? <Badge variant="default">Activo</Badge> : <Badge variant="destructive">Inactivo</Badge>;
      }
     },
    { 
      key: "CreatedAt", 
      label: "Fecha Creación", 
      sortable: true,
      render: (value) => {
        const date = value instanceof Date ? value : typeof value === 'string' ? new Date(value) : null;
        if (!date) return '-';
        return date.toLocaleString('en-US', { 
          year: 'numeric',
          month: 'numeric', 
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true
        });
      }
    },
  ];

  return (
    <CRUD<User, InfoExtraUsuario>
      title="Administración de Usuarios"
      columns={columns}
      data={users}
      totalCount={users.length}
      totalPages={1}
      currentPage={1}
      pageSize={10}
      actions={{
        create: createUsuario,
        update: updateUsuario,
        delete: deleteUsuario,
      }}
      formComponent={UsuarioForm}
      searchable={true}
      path="/seguridad/usuarios"
      infoExtra={{
        roles: roles,
      }}
    />
  );
} 