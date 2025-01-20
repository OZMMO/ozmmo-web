export interface SqlServerConnectionProps {
  server: string;
  database: string;
  user: string;
  password: string;
  port?: number;
}