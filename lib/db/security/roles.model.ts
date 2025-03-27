import { MSSQLServer } from "@/lib/mssqlserver";

export interface Role {
  RoleId: string;
  Name: string;
  Description: string;
}

export enum RoleEnum {
  ADMIN = "admin",
  ALMACENISTA = "almacenista",
  VENTAS = "ventas",
  INSTALADOR = "instalador",
  CLIENTE = "cliente",
}

export class RoleModel {
  private sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany({UserId }: { UserId: string }): Promise<Role[]> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
      .input('UserId', this.sql.dataTypes.VarChar, UserId)
      .execute(`[Security].[spGetRoles]`);
      let data =  result.recordset as Role[];
      
      return Promise.resolve(data || [])
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findUnique({ RoleId, UserId }: { RoleId: string, UserId: string }): Promise<Role | null> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
      .input('RoleId', this.sql.dataTypes.VarChar, RoleId)
      .input('UserId', this.sql.dataTypes.VarChar, UserId)
      .execute(`[Security].[spGetRoles]`); 
      const data = result.recordset as Role[];
      return Promise.resolve(data[0] || null)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  
}