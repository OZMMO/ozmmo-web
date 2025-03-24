import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components"

interface InvitationEmailProps {
  name: string
  invitationUrl: string
  tempPassword: string
}

export const InvitationEmail = ({ name, invitationUrl, tempPassword }: InvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Has sido invitado a unirte a nuestra plataforma</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bienvenido a nuestra plataforma</Heading>
          <Text style={text}>Hola {name},</Text>
          <Text style={text}>
            Has sido invitado a unirte a nuestra plataforma. Para completar tu registro, por favor haz clic en el botón
            de abajo.
          </Text>
          <Section style={buttonContainer}>
            <Button style={{...button, padding: '12px 20px'}} href={invitationUrl}>
              Completar Registro
            </Button>
          </Section>
          <Text style={text}>
            O copia y pega esta URL en tu navegador: <br />
            <a href={invitationUrl} style={link}>
              {invitationUrl}
            </a>
          </Text>
          <Text style={text}>
            Tu contraseña temporal es: <strong>{tempPassword}</strong>
          </Text>
          <Text style={text}>Este enlace expirará en 24 horas.</Text>
          <Text style={text}>
            Saludos,
            <br />
            El equipo de la plataforma
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "40px 0",
}

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20, 50, 70, 0.2)",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "20px",
}

const h1 = {
  color: "#484848",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  backgroundColor: "#4F46E5",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
}

const link = {
  color: "#4F46E5",
  textDecoration: "underline",
}

export default InvitationEmail

