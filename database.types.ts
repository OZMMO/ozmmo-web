export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  catalogos: {
    Tables: {
      tbl_empresas: {
        Row: {
          certificado_csd: string | null
          codigo: string
          contrasena_csd: string | null
          correo_electronico: string
          curp: string | null
          estatus: boolean | null
          fecha_registro: string | null
          id: number
          llave_privada_csd: string | null
          nombre_comercial: string | null
          razon_social: string
          regimen_fiscal: string | null
          representante_legal: string | null
          rfc: string
          telefono: string | null
          tipo_contribuyente: Database["catalogos"]["Enums"]["tipo_contribuyente"]
        }
        Insert: {
          certificado_csd?: string | null
          codigo: string
          contrasena_csd?: string | null
          correo_electronico: string
          curp?: string | null
          estatus?: boolean | null
          fecha_registro?: string | null
          id?: number
          llave_privada_csd?: string | null
          nombre_comercial?: string | null
          razon_social: string
          regimen_fiscal?: string | null
          representante_legal?: string | null
          rfc: string
          telefono?: string | null
          tipo_contribuyente: Database["catalogos"]["Enums"]["tipo_contribuyente"]
        }
        Update: {
          certificado_csd?: string | null
          codigo?: string
          contrasena_csd?: string | null
          correo_electronico?: string
          curp?: string | null
          estatus?: boolean | null
          fecha_registro?: string | null
          id?: number
          llave_privada_csd?: string | null
          nombre_comercial?: string | null
          razon_social?: string
          regimen_fiscal?: string | null
          representante_legal?: string | null
          rfc?: string
          telefono?: string | null
          tipo_contribuyente?: Database["catalogos"]["Enums"]["tipo_contribuyente"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tipo_contribuyente: "Física" | "Moral"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  sat: {
    Tables: {
      tbl_codigos_postales: {
        Row: {
          codigo_postal: string
          created_at: string | null
          esta_activo: boolean | null
          estado_id: number | null
          id: number
          localidad_id: number | null
          municipio_id: number | null
          updated_at: string | null
        }
        Insert: {
          codigo_postal: string
          created_at?: string | null
          esta_activo?: boolean | null
          estado_id?: number | null
          id?: number
          localidad_id?: number | null
          municipio_id?: number | null
          updated_at?: string | null
        }
        Update: {
          codigo_postal?: string
          created_at?: string | null
          esta_activo?: boolean | null
          estado_id?: number | null
          id?: number
          localidad_id?: number | null
          municipio_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_codigos_postales_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "tbl_estados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_codigos_postales_localidad_id_fkey"
            columns: ["localidad_id"]
            isOneToOne: false
            referencedRelation: "tbl_localidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_codigos_postales_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "tbl_municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_colonias: {
        Row: {
          clave_colonia: string
          codigo_postal_id: number | null
          created_at: string | null
          esta_activo: boolean | null
          id: number
          nombre_asentamiento: string | null
          updated_at: string | null
        }
        Insert: {
          clave_colonia: string
          codigo_postal_id?: number | null
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          nombre_asentamiento?: string | null
          updated_at?: string | null
        }
        Update: {
          clave_colonia?: string
          codigo_postal_id?: number | null
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          nombre_asentamiento?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_colonias_codigo_postal_id_fkey"
            columns: ["codigo_postal_id"]
            isOneToOne: false
            referencedRelation: "tbl_codigos_postales"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_estados: {
        Row: {
          clave_estado: string
          created_at: string | null
          descripcion: string
          esta_activo: boolean | null
          id: number
          pais_id: number | null
          updated_at: string | null
        }
        Insert: {
          clave_estado: string
          created_at?: string | null
          descripcion: string
          esta_activo?: boolean | null
          id?: number
          pais_id?: number | null
          updated_at?: string | null
        }
        Update: {
          clave_estado?: string
          created_at?: string | null
          descripcion?: string
          esta_activo?: boolean | null
          id?: number
          pais_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_estados_pais_id_fkey"
            columns: ["pais_id"]
            isOneToOne: false
            referencedRelation: "tbl_paises"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_localidades: {
        Row: {
          clave_localidad: string | null
          created_at: string | null
          descripcion: string
          esta_activo: boolean | null
          estado_id: number
          id: number
          updated_at: string | null
        }
        Insert: {
          clave_localidad?: string | null
          created_at?: string | null
          descripcion: string
          esta_activo?: boolean | null
          estado_id: number
          id?: number
          updated_at?: string | null
        }
        Update: {
          clave_localidad?: string | null
          created_at?: string | null
          descripcion?: string
          esta_activo?: boolean | null
          estado_id?: number
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_localidades_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "tbl_estados"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_municipios: {
        Row: {
          clave_municipio: string
          created_at: string | null
          descripcion: string
          esta_activo: boolean | null
          estado_id: number | null
          id: number
          updated_at: string | null
        }
        Insert: {
          clave_municipio: string
          created_at?: string | null
          descripcion: string
          esta_activo?: boolean | null
          estado_id?: number | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          clave_municipio?: string
          created_at?: string | null
          descripcion?: string
          esta_activo?: boolean | null
          estado_id?: number | null
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_municipios_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "tbl_estados"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_paises: {
        Row: {
          clave_pais: string
          created_at: string | null
          descripcion: string
          esta_activo: boolean | null
          id: number
          updated_at: string | null
        }
        Insert: {
          clave_pais: string
          created_at?: string | null
          descripcion: string
          esta_activo?: boolean | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          clave_pais?: string
          created_at?: string | null
          descripcion?: string
          esta_activo?: boolean | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

