"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gamepad2, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

type AuthState = {
  type: "success" | "error";
  message: string;
} | null;

export default function AuthPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [authState, setAuthState] = useState<AuthState>(null);
    const { login, register, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { username: "", email: "", password: "" },
    });

    const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
        setIsLoading(true);
        setAuthState(null);
        try {
            await login(values.email, values.password);
            // The useEffect will handle redirection
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
            setAuthState({ type: "error", message: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
        setIsLoading(true);
        setAuthState(null);
        try {
            await register(values.username, values.email, values.password);
            // The useEffect will handle redirection
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
            setAuthState({ type: "error", message: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    if (user) {
        return null; // Don't render anything if user is logged in, useEffect will redirect
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center mb-8">
                <Gamepad2 className="h-12 w-12 mx-auto text-primary" />
                <h1 className="font-headline text-4xl font-bold mt-4">Bienvenido a TorneoConnect</h1>
                <p className="text-muted-foreground mt-2">Inicia sesión o crea una cuenta para unirte a la acción.</p>
            </div>
            
            {authState && (
                <Alert variant={authState.type === "error" ? "destructive" : "default"} className="w-full max-w-md mb-6">
                    {authState.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    <AlertTitle>{authState.type === "error" ? "Error" : "Éxito"}</AlertTitle>
                    <AlertDescription>{authState.message}</AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="login" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" onClick={() => setAuthState(null)}>Iniciar Sesión</TabsTrigger>
                    <TabsTrigger value="register" onClick={() => setAuthState(null)}>Crear Cuenta</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Iniciar Sesión</CardTitle>
                            <CardDescription>Ingresa a tu cuenta para ver tus torneos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                                    <FormField
                                        control={loginForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="tu@email.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={loginForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isLoading ? "Ingresando..." : "Ingresar"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crear Cuenta</CardTitle>
                            <CardDescription>Completa el formulario para registrarte.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...registerForm}>
                                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                                     <FormField
                                        control={registerForm.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre de Usuario</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="GamerPro123" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="tu@email.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isLoading ? "Creando cuenta..." : "Registrarse"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
