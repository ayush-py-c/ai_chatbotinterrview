'use server';

import { db,auth } from "@/firebase/admin";
import { cookies } from "next/headers";
export async function signUp(params: SignUpParams){
    const{uid,name,email} = params;
    try{
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return{
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }
        await db.collection('users').doc(uid).set({
            name,
            email,
            // createdAt: new Date().toISOString()
        });

        return{
            success: true,
            message: 'User created successfully'
        }
    }catch(e:any){
        console.error('Error creating a user', e);

        if(e.code === 'auth/email-already-exists'){
            return{
                success:false,
                message: 'This email is already in use.'
            }
        }
        return{
            success: false,
            message: 'Failed to create an account'
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return { success: false, message: 'No user found with this email. Please sign up first.' };
        }
        
        await setSessionCookie(idToken);
        
        // Return success after setting the cookie
        return {
            success: true,
            message: 'Successfully signed in'
        };
    } catch (e) {
        console.error('Sign in error:', e); 
        return { 
            success: false,   
            message: 'Failed to sign in. Please try again.'
        };
    }
}

export async function setSessionCookie(idToken: string) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = await auth.createSessionCookie(idToken, {expiresIn: 60 * 60 * 24 * 7 * 1000}); //7 days

        if (!sessionCookie) {
            throw new Error('Failed to create session cookie');
        }

        cookieStore.set("session", sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            sameSite: "lax"
        });
    } catch (error) {
        console.error('Error setting session cookie:', error);
        throw error; // Re-throw to be handled by the calling function
    }
}

export async function getCurrentUser(){
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if(!sessionCookie){
        return null;
    }

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie,true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if(!userRecord.exists) return null;
        return {...userRecord.data(), id: userRecord.id} as User;
    }catch(e){
        console.error('Error verifying session cookie', e);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    return !!user; //to convert truthy and falsy values to boolean
}
