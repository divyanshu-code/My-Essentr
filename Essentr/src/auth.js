import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./Config/Db";
import UserModel from "./Models/userModel";
import bcrypt from 'bcryptjs';
import GoogleProvider from "next-auth/providers/google";
import { TbArrowAutofitContentFilled } from "react-icons/tb";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                try {
                    await connectDB();

                    const email = credentials.email;
                    const password = credentials.password;

                    const user = await UserModel.findOne({ email });

                    if (!user) {
                        throw new Error("User does not exist");
                    }

                    const isPasswordCorrect = await bcrypt.compare(password, user.password);

                    if (!isPasswordCorrect) {
                        throw new Error("Incorrect password");
                    }

                    return {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };

                } catch (err) {

                    console.error("Auth Error:", err.message);
                    throw new Error("Authentication failed: " + err.message);

                }
            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    // callbacks is used to customize JWT token and session . it means when user sign in we can add more info to token

    callbacks: {

        async signIn({ account, user }) {
            if (account?.provider === "google") {

               await connectDB();

                let dbuser = await UserModel.findOne({ email: user.email });

                if (!dbuser) {

                    // google will only provide name email image
                    dbuser = await UserModel.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    });

                }
                user.id = dbuser._id.toString();                   // google will not provide id so we are getting id from our db
                user.role = dbuser.role;                            // getting role from db

            }
            return true
        },

        // jwt is used to put user info in token
        jwt({ token, user, trigger , session }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
            }

            if (trigger === 'update') {
                token.role = session.role;
            }

            return token;
        },
        // session used to put user info in session

        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.role = token.role;
            }
            return session;
        }
    },

    pages: {
        signIn: '/auth/signin',
        error: '/auth/signin',
    },

    session: {
        strategy: 'jwt',
        maxAge: 10 * 24 * 60 * 60 * 1000, //  10day * hour * minute * second * millisecond
    },

    secret: process.env.AUTH_SECRET

})