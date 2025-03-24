import type { Adapter, AdapterAccount, AdapterSession, AdapterUser } from "next-auth/adapters"
import { Profile } from "next-auth"
import { UserModel, User } from "../security/user.model"
import { SessionModel, Session } from "../security/session.model"
import { AccountModel, Account } from "../security/account.model"

// Interfaces extendidas para cumplir con los requisitos de Auth.js
interface ExtendedAdapterUser extends AdapterUser {
  secondName?: string
  lastNameFather?: string
  lastNameMother?: string
  imageUrl?: string
}

interface ExtendedAdapterAccount extends AdapterAccount {
  accountId: string
}

export function MSSQLServerAdapter(): Adapter {
  const userModel = new UserModel()
  const sessionModel = new SessionModel()
  const accountModel = new AccountModel()

  return {
    createUser: async (user) => {
      const newUser: User = {
        id: user.id,
        UserId: user.id,
        Email: user.email,
        RoleId: user.role || 'cliente',
        PasswordHash: '', // Auth.js no maneja PasswordHash directamente
        FirstName: user.name?.split(' ')[0] || '',
        SecondName: (user as ExtendedAdapterUser).secondName || '',
        LastNameFather: user.name?.split(' ')[1] || '',// (user as ExtendedAdapterUser).lastNameFather || '',
        LastNameMother: (user as ExtendedAdapterUser).lastNameMother || '',
        ImageUrl: user.image || '',
        IsActive: true,
        CreatedAt: new Date(),
      }
      const createdUser = await userModel.create(newUser)
      return adaptUser(createdUser)
    },

    getUser: async (id) => {
      const user = await userModel.findUnique({ UserId: id })
      return user ? adaptUser(user) : null
    },

    getUserByEmail: async (email) => {
      const user = await userModel.findUnique({ Email: email })
      return user ? adaptUser(user) : null
    },

    getUserByAccount: async ({ provider, providerAccountId }) => {
      const account = await accountModel.findUnique({ Provider: provider, ProviderAccountId: providerAccountId })
      if (!account) return null
      const user = await userModel.findUnique({ UserId: account.UserId })
      return user ? adaptUser(user) : null
    },

    updateUser: async (user) => {
      const updatedUser = await userModel.update({
        id: user.id,
        UserId: user.id,
        Email: user.email!,
        RoleId: user.role || 'cliente',
        FirstName: user.name?.split(' ')[0] || '',
        SecondName: (user as ExtendedAdapterUser).secondName || '',
        LastNameFather: user.name?.split(' ')[1] || '', //(user as ExtendedAdapterUser).lastNameFather || '',
        LastNameMother: (user as ExtendedAdapterUser).lastNameMother || '',
        ImageUrl: user.image || '',
        IsActive: true,
        PasswordHash: '', // Mantener el hash existente
        CreatedAt: new Date(), // Este campo no debería cambiar en una actualización
      })
      return adaptUser(updatedUser)
    },

    deleteUser: async (userId) => {
      await userModel.delete(userId)
    },

    linkAccount: async (account) => {
      const newAccount: Account = {
        AccountId: (account as ExtendedAdapterAccount).accountId || '',
        UserId: account.userId,
        Type: account.type,
        Provider: account.provider,
        ProviderAccountId: account.providerAccountId,
        RefreshToken: account.refresh_token || '',
        AccessToken: account.access_token || '',
        ExpiresAt: account.expires_at || 0,
        TokenType: account.token_type || '',
        Scope: account.scope || '',
        TokenId: account.id_token || '',
        SessionState: account.session_state || '',
      }
      await accountModel.create(newAccount)
    },

    unlinkAccount: async ({ provider, providerAccountId }) => {
      // Nota: El modelo actual no tiene un método de eliminación para cuentas.
      // Deberías agregar un método delete al AccountModel para implementar esto correctamente.
      console.warn('unlinkAccount no implementado en el adaptador actual')
    },

    createSession: async (session) => {
      const newSession: Session = {
        SessionId: session.sessionToken,
        UserId: session.userId,
        Expires: session.expires,
        SessionToken: session.sessionToken,
      }
      const createdSession = await sessionModel.create(newSession)
      return adaptSession(createdSession)
    },

    getSessionAndUser: async (sessionToken) => {
      const session = await sessionModel.findUnique(sessionToken)
      if (!session) return null
      const user = await userModel.findUnique({ UserId: session.UserId })
      if (!user) return null
      return {
        session: adaptSession(session),
        user: adaptUser(user),
      }
    },

    updateSession: async (session) => {
      const updatedSession = await sessionModel.update({
        SessionId: session.sessionToken,
        UserId: session.userId,
        Expires: session.expires,
        SessionToken: session.sessionToken,
      })
      return adaptSession(updatedSession)
    },

    deleteSession: async (sessionToken) => {
      await sessionModel.delete(sessionToken)
    },
  }
}

// Funciones auxiliares para adaptar los modelos a los tipos esperados por Auth.js
function adaptUser(user: User): AdapterUser {
  return {
    id: user.UserId,
    name: `${user.FirstName} ${user.LastNameFather}`.trim(),
    email: user.Email,
    image: user.ImageUrl,
    role: user.Role?.RoleId || 'cliente',
    emailVerified: null, // Auth.js espera este campo, pero no está en nuestro modelo
  }
}

function adaptSession(session: Session): AdapterSession {
  return {
    sessionToken: session.SessionToken,
    userId: session.UserId as string,
    expires: session.Expires as Date,
  }
}