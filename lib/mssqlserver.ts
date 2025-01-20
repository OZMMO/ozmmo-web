import mssql, { 
    config, 
    ISqlTypeFactoryWithLength, 
    ISqlTypeFactoryWithNoParams, 
    ISqlTypeWithLength, 
    UniqueIdentifier,
    ConnectionPool,
    Table
} from 'mssql'
import { SqlServerConnectionProps } from './interfaces/sql-server-connection-props';

interface DateTypesSQLServer {
  VarChar: ISqlTypeFactoryWithLength,
  VarCharMAX: ISqlTypeWithLength,
  MAX: number,
  NVarChar: ISqlTypeFactoryWithLength,
  Int: ISqlTypeFactoryWithNoParams,
  Bit: ISqlTypeFactoryWithNoParams,
  DateTime: ISqlTypeFactoryWithNoParams,
  VarBinary: ISqlTypeFactoryWithLength,
  TVP: ISqlTypeFactoryWithNoParams,
  Table: typeof Table
}


export class MSSQLServer {
  private conn: config;
  public dataTypes: DateTypesSQLServer;

  private static connection: ConnectionPool;

  constructor() {
    this.conn = {
      user: encodeURIComponent(process.env.DB_USER as string),
      password: process.env.DB_PWD as string,
      database: encodeURIComponent(process.env.DB_NAME as string),
      server: encodeURIComponent(process.env.DB_SERVER as string),
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
      },
      parseJSON: true
    }

    this.dataTypes = {
      VarChar: mssql.VarChar,
      VarCharMAX: mssql.VarChar(mssql.MAX),
      MAX: mssql.MAX,
      NVarChar: mssql.NVarChar,
      Int: mssql.Int,
      Bit: mssql.Bit,
      DateTime: mssql.DateTime,
      VarBinary: mssql.VarBinary,
      TVP: mssql.TVP,
      Table: mssql.Table
    }
  }

  async connect() {
    try {
      if (!MSSQLServer.connection) {
        MSSQLServer.connection = await mssql.connect(this.conn)

        return Promise.resolve(MSSQLServer.connection)
      }

      return Promise.resolve(MSSQLServer.connection)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const getExtraSQLServerConnectionPool = async (props: SqlServerConnectionProps) => {
  try {
    // Crear un nuevo pool con configuración única
    const pool = new mssql.ConnectionPool({
      user: encodeURIComponent(props.user),
      password: props.password,
      database: encodeURIComponent(props.database),
      server: encodeURIComponent(props.server),
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: true,
        trustServerCertificate: true
      },
      parseJSON: true
    });

    // Conectar el pool
    await pool.connect();
    return pool;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw new Error('No se pudo conectar a la base de datos.');
  }
}
