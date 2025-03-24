import CredentialsProvider from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export default { 
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // const { authenticateUser } = await import("./lib/auth/credentials-auth")
        
        // const user = await authenticateUser(credentials.email as string, credentials.password as string);
        // console.log({user}) 

        // const user = await import("./lib/auth/credentials-auth").then(module => module.authenticateUser(credentials.email as string, credentials.password as string))

        const user = await fetch(`${process.env.NEXTAUTH_URL}/api/security/auth/users?email=${credentials.email}&password=${credentials.password}`).then(res => res.json())

        console.log({credentials,user})
        if (!user) {
          return null
        }

        return user;
        // return {
        //   id: user.UserId,
        //   email: user.Email,
        //   name: `${user.FirstName} ${user.LastNameFather}`.trim(),
        //   image: user.ImageUrl || null,
        //   role: user.Role?.RoleId
        // }

        // const userModel = new UserModel();
        // const user = await userModel.findUnique({ Email: credentials.email as string });
        // if (!user || !user.PasswordHash) return null;
        // const passwordsMatch = await compare(credentials.password as string, user.PasswordHash);
        
        // if (passwordsMatch) {
        //   // Return user in the expected Auth.js format
        //   return {
        //     id: user.UserId,
        //     email: user.Email,
        //     name: `${user.FirstName} ${user.LastNameFather}`.trim(),
        //     image: user.ImageUrl || null,
        //     role: user.Role
        //   };
        // }

        // if (typeof window === 'undefined') {
        //   const { authenticateUser } = await import("./lib/auth/credentials-auth");
        //   return authenticateUser(credentials.email as string, credentials.password as string);
        // }
        
        // return null;

      },
    })
  ],
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig