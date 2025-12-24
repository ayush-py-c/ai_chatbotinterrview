"use client"
import Image from "next/image"
import { zodResolver} from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import {z} from "zod"
// import { Auth } from "firebase-admin/auth"
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; //changes done in the next line also. 
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import Link from "next/dist/client/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { Import } from "lucide-react"
import { useRouter } from "next/navigation"
import { create } from "domain"
import { sign } from "crypto"
import { signUp, signIn } from "@/lib/actions/auth.action"


const authFormSchema = (type: FormType) => {
    return z.object({
        ...(type === "sign-in" && { username: z.string().min(2).max(50) }),
        email:  z.string().email(),
        password: z.string().min(6),
    })
    }

const AuthForm = ({type}:{type:FormType}) => {
    // define the form
    const router = useRouter();
    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        username: "",
        email: "",
        password: "",
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form submitted", values);
        try {
           if (type === "sign-up") {
            const {username,email,password} = values;
            const userCredentials = await createUserWithEmailAndPassword(auth,email,password);
            const result = await signUp({
                uid: userCredentials.user.uid,
                name: typeof username === 'string' ? username : "",
                email,
                password,
            })
            if(!result?.success){
                toast.error(result?.message);
                return;
            }
            
            toast.success("Account created successfully! Please sign in to continue.");
            router.push("/sign-in");
           }else {
            const {email,password} = values;
            try {
                // First ensure auth is initialized
                if (!auth) {
                    toast.error("Authentication service not initialized");
                    return;
                }

                // Attempt sign in
                console.log("Attempting sign in...");
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("Sign in successful, getting user...");
                
                if (!userCredential?.user) {
                    toast.error("Sign in failed - no user data received");
                    return;
                }

                console.log("Getting ID token...");
                const idToken = await userCredential.user.getIdToken();
                
                if (!idToken) {
                    toast.error("Failed to get authentication token");
                    return;
                }

                console.log("Calling server-side sign in...");
                const signInResult = await signIn({email, idToken});
                
                if (!signInResult?.success) {
                    toast.error(signInResult?.message || "Sign in failed");
                    return;
                }

                toast.success("Sign in successful!");
                console.log("Redirecting to home page...");
                router.push("/");
            } catch (signInError: any) {
                console.error("Sign in error:", signInError);
                let errorMessage = "Sign in failed";
                
                if (signInError.code === "auth/user-not-found") {
                    errorMessage = "No account found with this email";
                } else if (signInError.code === "auth/wrong-password") {
                    errorMessage = "Incorrect password";
                } else if (signInError.code === "auth/invalid-email") {
                    errorMessage = "Invalid email format";
                }
                
                toast.error(errorMessage);
            }
              }
            // Handle form submission logic here
        } catch (error) {
            console.error( error);
            toast.error(`Error submitting form. Please try again.${error}`)
        }
    }
    const isSignIn = type === "sign-in"
  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src = "./logo.svg" alt="logo" height={32} width={38} />            
                <h2 className="text-primary-100">interview_prep</h2>
            </div>
            <h3>Practice job interview with AI</h3>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4 form space-y-6">
                    {!isSignIn && (
                        <FormField control={form.control}
                            name="username"
                            label="Name"
                            placeholder="Your Name"
                        />
                    )}
                    <FormField 
                        control={form.control}
                        name = "email" 
                        label="Email" 
                        placeholder = "Your Email"
                        type="email"
                        // type  = "email"/
                    /> 
                    <FormField 
                        control={form.control}
                        name = "password" 
                        label="password" 
                        placeholder = "Your Password"
                        type="password"
                    />
                    <Button className="btn" type="button" onClick={()=>onSubmit(form.getValues())}>{isSignIn?'Sign in':'Create an account'}</Button>
                </form>
            </FormProvider>
            <p className="text-center">
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-user-primary ml-1">
                    {!isSignIn ? "Sign in" : "Sign up"}
                </Link>
            </p>
        </div>
    </div>
  )
}

export default AuthForm