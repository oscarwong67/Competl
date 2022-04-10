import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import { addUserToDbIfNotExist } from '../../../lib/users';
//import TwitterProvider from "next-auth/providers/twitter"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    //TwitterProvider({
    //  clientId: process.env.TWITTER_ID,
    //  clientSecret: process.env.TWITTER_SECRET,
    //}),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log("Fetching session details for " + token.email);

      // Persist the OAuth access_token to the token right after signin
      if (account) {
        // Deal with user creation only on sign-in
        token.accessToken = account.access_token;
      }
      const { email } = token;
      token.user = await addUserToDbIfNotExist(email);
      // console.log(token.user);
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});