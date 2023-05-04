import { onSignup } from '@/lib/on-signup'
import { StravaAccountSchema } from '@/lib/strava-schema'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import StravaProvider from 'next-auth/providers/strava'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID ?? '',
      clientSecret: process.env.STRAVA_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken
      // @ts-ignore
      session.userId = token.id
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        const stravaAccount = StravaAccountSchema.parse(account)
        await onSignup(stravaAccount)

        token.accessToken = account.access_token
        token.id = user.id
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
