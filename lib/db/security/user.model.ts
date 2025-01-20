import { MSSQLServer } from "@/lib/mssqlserver";

export interface User {
  UserId        : string;
	Email         : string;
  PasswordHash  : string;
	FirstName     : string;
	SecondName    : string;
	LastNameFather : string;
	LastNameMother : string;
	ImageUrl : string;
	IsActive: boolean;
	CreatedAt: Date
}

export class UserModel {
  private sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany({ UserId, Email }: { UserId: string, Email: string }): Promise<User[]> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
      .input('UserId', this.sql.dataTypes.VarChar, UserId)
      .input('Email', this.sql.dataTypes.VarChar, Email)
      .execute(`[Security].[spGetUsers]`);
      let data =  result.recordset as User[];
      data = data.map(user => ({
        ...user,
        CreatedAt: new Date(user.CreatedAt),
      }));
  
      return Promise.resolve(data || [])
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findUnique({ UserId, Email }: { UserId?: string, Email?: string }): Promise<User | null> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
      .input('UserId', this.sql.dataTypes.VarChar, UserId)
      .input('Email', this.sql.dataTypes.VarChar, Email)
      .execute(`[Security].[spGetUsers]`);

      const data = (result.recordset[0] || null) as User || null;
      if(data) {
        data.CreatedAt = new Date(data.CreatedAt)
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
        .execute(`[Security].[spIUser]`);

      const data = (result.recordset[0] || null) as User || null;
      if(data) {
        data.CreatedAt = new Date(data.CreatedAt)
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
        .execute(`[Security].[spIUser]`);

      const data = (result.recordset[0] || null) as User || null;
      if(data) {
        data.CreatedAt = new Date(data.CreatedAt)
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async dalete(userId: string): Promise<User> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('UserId', this.sql.dataTypes.VarChar, userId)
        .execute(`[Security].[spDeleteUser]`);

      const data = (result.recordset[0] || null) as User || null;
      if(data) {
        data.CreatedAt = new Date(data.CreatedAt)
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

}