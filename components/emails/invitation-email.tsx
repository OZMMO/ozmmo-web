import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components"

interface InvitationEmailProps {
  name: string
  role: string
  invitationUrl: string
  tempPassword: string
}

export const InvitationEmailCliente = ({ name, role, invitationUrl, tempPassword }: InvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>¡Bienvenido a OZMMO! Tu cuenta está lista para ser activada</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={header}>
            <img 
              src="https://ozmmo.com/wp-content/uploads/2024/02/Recurso-1.png" 
              alt="OZMMO Logo" 
              style={logo}
            />
          </div>
          
          <Heading style={h1}>¡Bienvenido a OZMMO!</Heading>
          
          <div style={welcomeSection}>
            <Text style={text}>
              Hola <strong>{name}</strong>,
            </Text>
            <Text style={text}>
              ¡Nos emociona mucho que hayas elegido OZMMO para tus necesidades de filtración de agua! 
              Estamos aquí para proporcionarte la mejor solución en equipos de ósmosis inversa.
            </Text>
          </div>

          <div style={card}>
            <Text style={cardTitle}>¿Qué podrás hacer?</Text>
            <Text style={cardText}>
              • Gestionar tus equipos de filtración
              <br />
              • Dar seguimiento al mantenimiento de tus filtros
              <br />
              • Solicitar servicio técnico cuando lo necesites
              <br />
              • Acceder a tu historial de servicios
            </Text>
          </div>

          <Section style={buttonContainer}>
            <Button style={button} href={invitationUrl}>
              Activar mi cuenta
            </Button>
          </Section>

          <div style={infoBox}>
            <Text style={infoTitle}>Información importante:</Text>
            <Text style={infoText}>
              {tempPassword && <>• Tu contraseña temporal es: <strong>{tempPassword}</strong></>}
              <br />
              • El enlace de activación expira en 48 horas
              <br />
              • Si el botón no funciona, copia este enlace:
            </Text>
            <a href={invitationUrl} style={link}>
              {invitationUrl}
            </a>
          </div>

          <div style={footer}>
            <Text style={footerText}>
              ¿Tienes dudas? Nuestro equipo de atención al cliente está para ayudarte.
              <br />
              <a href="mailto:atencion@ozmmo.com" style={footerLink}>
                atencion@ozmmo.com
              </a>
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  )
}

export const InvitationEmailUser = ({ name, role, invitationUrl, tempPassword }: InvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>¡Bienvenido a OZMMO! Tu cuenta de {role} está lista para ser activada</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={header}>
            <img 
              src="https://ozmmo.com/wp-content/uploads/2024/02/Recurso-1.png" 
              alt="OZMMO Logo" 
              style={logo}
            />
          </div>
          
          <Heading style={h1}>¡Bienvenido al equipo de OZMMO!</Heading>
          
          <div style={welcomeSection}>
            <Text style={text}>
              Hola <strong>{name}</strong>,
            </Text>
            <Text style={text}>
              ¡Nos emociona mucho que te unas a nuestro equipo como <strong>{role}</strong>! 
              Estamos seguros de que juntos haremos grandes cosas.
            </Text>
          </div>

          <div style={card}>
            <Text style={cardTitle}>Próximos pasos</Text>
            <Text style={cardText}>
              1. Activa tu cuenta usando el botón de abajo
              <br />
              2. Establece tu nueva contraseña
              <br />
              3. ¡Comienza a explorar la plataforma!
            </Text>
          </div>

          <Section style={buttonContainer}>
            <Button style={button} href={invitationUrl}>
              Activar mi cuenta
            </Button>
          </Section>

          <div style={infoBox}>
            <Text style={infoTitle}>Información importante:</Text>
            <Text style={infoText}>
              {tempPassword && <>• Tu contraseña temporal es: <strong>{tempPassword}</strong></>}
              <br />
              • El enlace de activación expira en 48 horas
              <br />
              • Si el botón no funciona, copia este enlace:
            </Text>
            <a href={invitationUrl} style={link}>
              {invitationUrl}
            </a>
          </div>

          <div style={footer}>
            <Text style={footerText}>
              ¿Necesitas ayuda? Nuestro equipo de soporte está aquí para ti.
              <br />
              <a href="mailto:soporte@ozmmo.com" style={footerLink}>
                soporte@ozmmo.com
              </a>
            </Text>
          </div>
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
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "40px",
}

const header = {
  textAlign: "center" as const,
  marginBottom: "30px",
}

const logo = {
  width: "150px",
  height: "auto",
}

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
}

const welcomeSection = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "30px",
}

const text = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
}

const card = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "30px",
}

const cardTitle = {
  color: "#2d3748",
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "16px",
}

const cardText = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "24px",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  backgroundColor: "#4F46E5",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 32px",
  transition: "background-color 0.2s",
}

const infoBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "24px",
  marginTop: "30px",
}

const infoTitle = {
  color: "#2d3748",
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "16px",
}

const infoText = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "24px",
}

const link = {
  color: "#4F46E5",
  textDecoration: "none",
  wordBreak: "break-all" as const,
  fontSize: "14px",
  lineHeight: "20px",
}

const footer = {
  marginTop: "40px",
  paddingTop: "20px",
  borderTop: "1px solid #e2e8f0",
}

const footerText = {
  color: "#718096",
  fontSize: "14px",
  lineHeight: "20px",
  textAlign: "center" as const,
}

const footerLink = {
  color: "#4F46E5",
  textDecoration: "none",
  fontWeight: "bold",
}