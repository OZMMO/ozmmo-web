import mssql from 'mssql'

export const SQLDataTypes = {
  VarChar: mssql.VarChar,
  VarCharMAX: mssql.VarChar(mssql.MAX),
  MAX: mssql.MAX,
  NVarChar: mssql.NVarChar,
  Int: mssql.Int,
  Bit: mssql.Bit,
  DateTime: mssql.DateTime,
  VarBinary: mssql.VarBinary,
  TVP: mssql.TVP,
  Float: mssql.Float,
  BigInt: mssql.BigInt,
  Null: null
}
