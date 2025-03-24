import { MSSQLServer } from "@/lib/mssqlserver";
import { Role } from "./roles.model";

export interface User {
  id: string;
  UserId        : string;
	Email         : string;
  PasswordHash  : string;
	FirstName     : string;
	SecondName    : string;
	LastNameFather : string;
	LastNameMother : string;
  RoleId?: string;
  Role?: Role;
	ImageUrl : string;
	IsActive: boolean;
	CreatedAt: Date;
  InvitationToken?: string;
  InvitationTokenExpires?: Date;
}

export class UserModel {
  private sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany({ UserId, Email }: { UserId?: string, Email?: string }): Promise<User[]> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
      .input('UserId', this.sql.dataTypes.VarChar, UserId)
      .input('Email', this.sql.dataTypes.VarChar, Email)
      .execute(`[Security].[spGetUsers]`);
      let data =  result.recordset as User[];
      data = data.map(user => ({
        ...user,
        id: user.UserId,
        Role: typeof user.Role === 'string' ? JSON.parse(user.Role) : user.Role,
        CreatedAt: new Date(user.CreatedAt),
      }));
  
      return Promise.resolve(data || [])
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findUnique({ UserId, Email, InvitationToken }: { UserId?: string, Email?: string, InvitationToken ?: string }): Promise<User | null> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
      .input('UserId', this.sql.dataTypes.VarChar, UserId)
      .input('Email', this.sql.dataTypes.VarChar, Email)
      .input('InvitationToken', this.sql.dataTypes.VarChar, InvitationToken)
      .execute(`[Security].[spGetUsers]`);

      const data = (result.recordset[0] || null) as User || null;
      if(data) {
        data.id = data.UserId;
        data.CreatedAt = new Date(data.CreatedAt)
        data.Role = typeof data.Role === 'string' ? JSON.parse(data.Role) : data.Role
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async create(user: User): Promise<User> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('UserId', this.sql.dataTypes.VarChar, user.UserId)
        .input('Email', this.sql.dataTypes.VarChar, user.Email)
        .input('PasswordHash', this.sql.dataTypes.VarChar, user.PasswordHash)
        .input('FirstName', this.sql.dataTypes.VarChar, user.FirstName)
        .input('SecondName', this.sql.dataTypes.VarChar, user.SecondName)
        .input('LastNameFather', this.sql.dataTypes.VarChar, user.LastNameFather)
        .input('LastNameMother', this.sql.dataTypes.VarChar, user.LastNameMother)
        .input('ImageUrl', this.sql.dataTypes.VarChar, user.ImageUrl)
        .input('IsActive', this.sql.dataTypes.Int, user.IsActive)
        .input('RoleId', this.sql.dataTypes.VarChar, user.RoleId)
        .input('InvitationToken', this.sql.dataTypes.VarChar, user.InvitationToken)
        .input('InvitationTokenExpires', this.sql.dataTypes.DateTime, user.InvitationTokenExpires)
        .execute(`[Security].[spIUser]`);

      const data = (result.recordset[0] || null) as User || null;
      if(data) {
        data.id = data.UserId;
        data.CreatedAt = new Date(data.CreatedAt)
        data.Role = typeof data.Role === 'string' ? JSON.parse(data.Role) : data.Role
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async update(user: User): Promise<User> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('UserId', this.sql.dataTypes.VarChar, user.UserId)
        .input('Email', this.sql.dataTypes.VarChar, user.Email)
        .input('PasswordHash', this.sql.dataTypes.VarChar, user.PasswordHash)
        .input('FirstName', this.sql.dataTypes.VarChar, user.FirstName)
        .input('SecondName', this.sql.dataTypes.VarChar, user.SecondName)
        .input('LastNameFather', this.sql.dataTypes.VarChar, user.LastNameFather)
        .input('LastNameMother', this.sql.dataTypes.VarChar, user.LastNameMother)
        .input('ImageUrl', this.sql.dataTypes.VarChar, user.ImageUrl)
        .input('IsActive', this.sql.dataTypes.Int, user.IsActive)
        .input('RoleId', this.sql.dataTypes.VarChar, user.RoleId)
        .input('InvitationToken', this.sql.dataTypes.VarChar, user.InvitationToken)
        .input('InvitationTokenExpires', this.sql.dataTypes.DateTime, user.InvitationTokenExpires)
        .execute(`[Security].[spUUser]`);

      const data = (result.recordset[0] || null) as User || null;
      if(data) {
        data.id = data.UserId;
        data.CreatedAt = new Date(data.CreatedAt)
        data.Role = typeof data.Role === 'string' ? JSON.parse(data.Role) : data.Role
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async delete(userId: string): Promise<User> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('UserId', this.sql.dataTypes.VarChar, userId)
        .execute(`[Security].[spDeleteUser]`);

      const data = (result.recordset[0] || null) as User || null;
      if(data) {
        data.id = data.UserId;
        data.CreatedAt = new Date(data.CreatedAt)
        data.Role = typeof data.Role === 'string' ? JSON.parse(data.Role) : data.Role
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

}