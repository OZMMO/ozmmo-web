import { MSSQLServer } from "@/lib/mssqlserver";

export interface Session {
  SessionId: string;
  UserId?: string;
  Expires?: Date;
  SessionToken: string;
}

export class SessionModel {
  private sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(SessionToken: string): Promise<Session | null> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
      .input('SessionToken', this.sql.dataTypes.VarChar, SessionToken)
      .execute(`[Security].[spGetSession]`);

      const data = (result.recordset[0] || null) as Session || null;
      if (data) {
        data.Expires = data?.Expires ? new Date(data.Expires) : undefined
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async create(session: Session): Promise<Session> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('SessionId', this.sql.dataTypes.VarChar, session.SessionId)
        .input('UserId', this.sql.dataTypes.VarChar, session.UserId)
        .input('Expires', this.sql.dataTypes.DateTime, session.Expires)
        .input('SessionToken', this.sql.dataTypes.VarChar, session.SessionToken)
        .execute(`[Security].[spIUSession]`);

      const data = (result.recordset[0] || null) as Session || null;
      if (data) {
        data.Expires = data?.Expires ? new Date(data.Expires) : undefined
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async update(session: Session): Promise<Session> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('SessionId', this.sql.dataTypes.VarChar, session.SessionId)
        .input('UserId', this.sql.dataTypes.VarChar, session.UserId)
        .input('Expires', this.sql.dataTypes.DateTime, session.Expires)
        .input('SessionToken', this.sql.dataTypes.VarChar, session.SessionToken)
        .execute(`[Security].[spIUSession]`);
        
      const data = (result.recordset[0] || null) as Session || null;
      if (data) {
        data.Expires = data?.Expires ? new Date(data.Expires) : undefined
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async dalete(SessionId: string): Promise<Session> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('SessionId', this.sql.dataTypes.VarChar, SessionId)
        .execute(`[Security].[spDeleteSession]`);

      const data = (result.recordset[0] || null) as Session || null;
      if (data) {
        data.Expires = data?.Expires ? new Date(data.Expires) : undefined
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}