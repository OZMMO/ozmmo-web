export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  almacen: {
    Tables: {
      tbl_bodega: {
        Row: {
          codigo: string
          created_at: string | null
          descripcion: string | null
          empresa_id: number | null
          esta_activo: boolean | null
          id: number
          sucursal_id: number | null
          updated_at: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: number | null
          esta_activo?: boolean | null
          id?: number
          sucursal_id?: number | null
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: number | null
          esta_activo?: boolean | null
          id?: number
          sucursal_id?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tbl_cat_estado_ubicacion: {
        Row: {
          created_at: string | null
          descripcion: string
          disponible: boolean | null
          esta_activo: boolean | null
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion: string
          disponible?: boolean | null
          esta_activo?: boolean | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string
          disponible?: boolean | null
          esta_activo?: boolean | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tbl_cat_estados_lote: {
        Row: {
          created_at: string | null
          descripcion: string | null
          esta_activo: boolean | null
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          esta_activo?: boolean | null
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          esta_activo?: boolean | null
          id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tbl_cat_tipos_movimiento: {
        Row: {
          categoria: string | null
          created_at: string | null
          descripcion: string | null
          esta_activo: boolean | null
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          descripcion?: string | null
          esta_activo?: boolean | null
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          descripcion?: string | null
          esta_activo?: boolean | null
          id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tbl_detalle_recepciones: {
        Row: {
          cantidad: number | null
          created_at: string | null
          esta_activo: boolean | null
          id: number
          producto_id: number | null
          recepcion_id: number | null
          ubicacion_id: number | null
          updated_at: string | null
        }
        Insert: {
          cantidad?: number | null
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          producto_id?: number | null
          recepcion_id?: number | null
          ubicacion_id?: number | null
          updated_at?: string | null
        }
        Update: {
          cantidad?: number | null
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          producto_id?: number | null
          recepcion_id?: number | null
          ubicacion_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_detalle_recepciones_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "tbl_productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_detalle_recepciones_recepcion_id_fkey"
            columns: ["recepcion_id"]
            isOneToOne: false
            referencedRelation: "tbl_recepciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_detalle_recepciones_ubicacion_id_fkey"
            columns: ["ubicacion_id"]
            isOneToOne: false
            referencedRelation: "tbl_ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_lista_materiales: {
        Row: {
          cantidad_necesaria: number | null
          created_at: string | null
          esta_activo: boolean | null
          id: number
          nota: string | null
          producto_id: number | null
          unidad_medida_id: number | null
          updated_at: string | null
        }
        Insert: {
          cantidad_necesaria?: number | null
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          nota?: string | null
          producto_id?: number | null
          unidad_medida_id?: number | null
          updated_at?: string | null
        }
        Update: {
          cantidad_necesaria?: number | null
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          nota?: string | null
          producto_id?: number | null
          unidad_medida_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_lista_materiales_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "tbl_productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_lista_materiales_unidad_medida_id_fkey"
            columns: ["unidad_medida_id"]
            isOneToOne: false
            referencedRelation: "tbl_unidades_medida"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_lotes: {
        Row: {
          cantidad_disponible: number | null
          cantidad_inicial: number | null
          codigo_lote: string
          created_at: string | null
          esta_activo: boolean | null
          estado_lote_id: number | null
          fecha_expiracion: string | null
          fecha_fabricacion: string | null
          id: number
          producto_id: number | null
          recepcion_id: number | null
          updated_at: string | null
        }
        Insert: {
          cantidad_disponible?: number | null
          cantidad_inicial?: number | null
          codigo_lote: string
          created_at?: string | null
          esta_activo?: boolean | null
          estado_lote_id?: number | null
          fecha_expiracion?: string | null
          fecha_fabricacion?: string | null
          id?: number
          producto_id?: number | null
          recepcion_id?: number | null
          updated_at?: string | null
        }
        Update: {
          cantidad_disponible?: number | null
          cantidad_inicial?: number | null
          codigo_lote?: string
          created_at?: string | null
          esta_activo?: boolean | null
          estado_lote_id?: number | null
          fecha_expiracion?: string | null
          fecha_fabricacion?: string | null
          id?: number
          producto_id?: number | null
          recepcion_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_lotes_estado_lote_id_fkey"
            columns: ["estado_lote_id"]
            isOneToOne: false
            referencedRelation: "tbl_cat_estados_lote"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_lotes_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "tbl_productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_lotes_recepcion_id_fkey"
            columns: ["recepcion_id"]
            isOneToOne: false
            referencedRelation: "tbl_recepciones"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_lotes_ubicaciones: {
        Row: {
          cantidad: number | null
          created_at: string | null
          esta_activo: boolean | null
          id: number
          lote_id: number | null
          ubicacion_id: number | null
          updated_at: string | null
        }
        Insert: {
          cantidad?: number | null
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          lote_id?: number | null
          ubicacion_id?: number | null
          updated_at?: string | null
        }
        Update: {
          cantidad?: number | null
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          lote_id?: number | null
          ubicacion_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_lotes_ubicaciones_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "tbl_lotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_lotes_ubicaciones_ubicacion_id_fkey"
            columns: ["ubicacion_id"]
            isOneToOne: false
            referencedRelation: "tbl_ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_productos: {
        Row: {
          codigo: string
          codigo_proveedor: string
          created_at: string | null
          descripcion: string | null
          es_ensamble: boolean | null
          esta_activo: boolean | null
          id: number
          peso: number | null
          unidad_medida_id: number | null
          updated_at: string | null
          volumen: number | null
        }
        Insert: {
          codigo: string
          codigo_proveedor: string
          created_at?: string | null
          descripcion?: string | null
          es_ensamble?: boolean | null
          esta_activo?: boolean | null
          id?: number
          peso?: number | null
          unidad_medida_id?: number | null
          updated_at?: string | null
          volumen?: number | null
        }
        Update: {
          codigo?: string
          codigo_proveedor?: string
          created_at?: string | null
          descripcion?: string | null
          es_ensamble?: boolean | null
          esta_activo?: boolean | null
          id?: number
          peso?: number | null
          unidad_medida_id?: number | null
          updated_at?: string | null
          volumen?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_productos_unidad_medida_id_fkey"
            columns: ["unidad_medida_id"]
            isOneToOne: false
            referencedRelation: "tbl_unidades_medida"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_proveedores: {
        Row: {
          contacto: string | null
          created_at: string | null
          direccion: string | null
          email: string | null
          esta_activo: boolean | null
          id: number
          nombre: string
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          contacto?: string | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          esta_activo?: boolean | null
          id?: number
          nombre: string
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          contacto?: string | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          esta_activo?: boolean | null
          id?: number
          nombre?: string
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tbl_recepciones: {
        Row: {
          completado: boolean | null
          created_at: string | null
          esta_activo: boolean | null
          fecha_recepcion: string | null
          id: number
          proveedor_id: number | null
          updated_at: string | null
        }
        Insert: {
          completado?: boolean | null
          created_at?: string | null
          esta_activo?: boolean | null
          fecha_recepcion?: string | null
          id?: number
          proveedor_id?: number | null
          updated_at?: string | null
        }
        Update: {
          completado?: boolean | null
          created_at?: string | null
          esta_activo?: boolean | null
          fecha_recepcion?: string | null
          id?: number
          proveedor_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_recepciones_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "tbl_proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_trazabilidad_lotes: {
        Row: {
          cantidad: number | null
          created_at: string | null
          esta_activo: boolean | null
          id: number
          lote_id: number | null
          notas: string | null
          producto_id: number | null
          referencia_movimiento: string | null
          tipo_movimiento_id: number | null
          ubicacion_destino_id: number | null
          ubicacion_origen_id: number | null
          updated_at: string | null
        }
        Insert: {
          cantidad?: number | null
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          lote_id?: number | null
          notas?: string | null
          producto_id?: number | null
          referencia_movimiento?: string | null
          tipo_movimiento_id?: number | null
          ubicacion_destino_id?: number | null
          ubicacion_origen_id?: number | null
          updated_at?: string | null
        }
        Update: {
          cantidad?: number | null
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          lote_id?: number | null
          notas?: string | null
          producto_id?: number | null
          referencia_movimiento?: string | null
          tipo_movimiento_id?: number | null
          ubicacion_destino_id?: number | null
          ubicacion_origen_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_trazabilidad_lotes_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "tbl_lotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_trazabilidad_lotes_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "tbl_productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_trazabilidad_lotes_tipo_movimiento_id_fkey"
            columns: ["tipo_movimiento_id"]
            isOneToOne: false
            referencedRelation: "tbl_cat_tipos_movimiento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_trazabilidad_lotes_ubicacion_destino_id_fkey"
            columns: ["ubicacion_destino_id"]
            isOneToOne: false
            referencedRelation: "tbl_ubicaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_trazabilidad_lotes_ubicacion_origen_id_fkey"
            columns: ["ubicacion_origen_id"]
            isOneToOne: false
            referencedRelation: "tbl_ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_ubicaciones: {
        Row: {
          capacidad_maxima: number | null
          codigo: string
          created_at: string | null
          descripcion: string | null
          esta_activo: boolean | null
          estado_ubicacion_id: number | null
          id: number
          updated_at: string | null
        }
        Insert: {
          capacidad_maxima?: number | null
          codigo: string
          created_at?: string | null
          descripcion?: string | null
          esta_activo?: boolean | null
          estado_ubicacion_id?: number | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          capacidad_maxima?: number | null
          codigo?: string
          created_at?: string | null
          descripcion?: string | null
          esta_activo?: boolean | null
          estado_ubicacion_id?: number | null
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_ubicaciones_estado_ubicacion_id_fkey"
            columns: ["estado_ubicacion_id"]
            isOneToOne: false
            referencedRelation: "tbl_cat_estado_ubicacion"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_unidades_medida: {
        Row: {
          abreviatura: string
          created_at: string | null
          esta_activo: boolean | null
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          abreviatura: string
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          abreviatura?: string
          created_at?: string | null
          esta_activo?: boolean | null
          id?: number
          nombre?: string
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
      tbl_sucursal: {
        Row: {
          codigo: string | null
          correo_electronico: string
          empresa_id: number
          estatus: boolean | null
          fecha_registro: string | null
          id: number
          nombre: string
          responsable: string | null
          telefono: string | null
        }
        Insert: {
          codigo?: string | null
          correo_electronico: string
          empresa_id: number
          estatus?: boolean | null
          fecha_registro?: string | null
          id?: number
          nombre: string
          responsable?: string | null
          telefono?: string | null
        }
        Update: {
          codigo?: string | null
          correo_electronico?: string
          empresa_id?: number
          estatus?: boolean | null
          fecha_registro?: string | null
          id?: number
          nombre?: string
          responsable?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_sucursal_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "tbl_empresas"
            referencedColumns: ["id"]
          },
        ]
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

