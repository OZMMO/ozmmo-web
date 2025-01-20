import { MSSQLServer } from "@/lib/mssqlserver";
import { JsonValue } from "next-auth/adapters";

export interface Account {
  AccountId           : string;
	UserId              : string;
	Type              : string;
	Provider          : string;
	ProviderAccountId   : string;
	RefreshToken        : string;
	AccessToken         : string;
	ExpiresAt           : number;
	TokenType     : string;
	Scope         : string;
	TokenId       : string;
	SessionState  : JsonValue;
}

export class AccountModel {
  private sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique({ Provider, ProviderAccountId }: { Provider: string, ProviderAccountId: string }): Promise<Account | null> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
      .input('Provider', this.sql.dataTypes.VarChar, Provider)
      .input('ProviderAccountId', this.sql.dataTypes.VarChar, ProviderAccountId)
      .execute(`[Security].[spGetAccounts]`);

      const data = (result.recordset[0] || null) as Account || null;

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async create(account: Account): Promise<Account> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('AccountId', this.sql.dataTypes.VarChar, account.AccountId)
        .input('UserId', this.sql.dataTypes.VarChar, account.UserId)
        .input('Type', this.sql.dataTypes.VarChar, account.Type)
        .input('Provider', this.sql.dataTypes.VarChar, account.Provider)
        .input('ProviderAccountId', this.sql.dataTypes.VarChar, account.ProviderAccountId)
        .input('RefreshToken', this.sql.dataTypes.VarChar, account.RefreshToken)
        .input('AccessToken', this.sql.dataTypes.VarChar, account.AccessToken)
        .input('ExpiresAt', this.sql.dataTypes.Int, account.ExpiresAt)
        .input('TokenType', this.sql.dataTypes.VarChar, account.TokenType)
        .input('Scope', this.sql.dataTypes.VarChar, account.Scope)
        .input('TokenId', this.sql.dataTypes.VarChar, account.TokenId)
        .input('SessionState', this.sql.dataTypes.VarChar, account.SessionState)
        .execute(`[Security].[spIAccount]`);
      const data = (result.recordset[0] || null) as Account || null;

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

}