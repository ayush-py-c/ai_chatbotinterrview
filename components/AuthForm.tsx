"use client"
import Image from "next/image"
import { zodResolver} from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import {z} from "zod"


import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import Link from "next/dist/client/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { Import } from "lucide-react"
import { useRouter } from "next/navigation"



const authFormSchema = (type: FormType) => {
    return z.object({
        username: z.string().min(2).max(50),
        email: type === "sign-in" ? z.string().email() : z.string().email().optional(),
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
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form submitted", values);
        try {
           if (type === "sign-up") {
            toast.success("Account created successfully! Please sign in to continue.");
            router.push("/sign-in");
           }else {
            toast.success("Sign in successful!");  
            console.log("Redirecting to home page...");
            // router.push("/");
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
                    /> 
                    <FormField 
                        control={form.control}
                        name = "password" 
                        label="password" 
                        placeholder = "Your Password"
                        type="password"
                    />
                    <Button className="btn" type="submit">{isSignIn?'Sign in':'Create an account'}</Button>
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