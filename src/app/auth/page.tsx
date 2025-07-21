"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Gamepad2 } from "lucide-react";

export default function AuthPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        // Lógica de autenticación aquí...
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center mb-8">
                <Gamepad2 className="h-12 w-12 mx-auto text-primary" />
                <h1 className="font-headline text-4xl font-bold mt-4">Bienvenido a TorneoConnect</h1>
                <p className="text-muted-foreground mt-2">Inicia sesión o crea una cuenta para unirte a la acción.</p>
            </div>
            <Tabs defaultValue="login" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                    <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Iniciar Sesión</CardTitle>
                            <CardDescription>
                                Ingresa a tu cuenta para ver tus torneos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-login">Email</Label>
                                    <Input id="email-login" type="email" placeholder="tu@email.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-login">Contraseña</Label>
                                    <Input id="password-login" type="password" required />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Ingresando..." : "Ingresar"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crear Cuenta</CardTitle>
                            <CardDescription>
                                Completa el formulario para registrarte.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username-register">Nombre de Usuario</Label>
                                    <Input id="username-register" type="text" placeholder="GamerPro123" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email-register">Email</Label>
                                    <Input id="email-register" type="email" placeholder="tu@email.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-register">Contraseña</Label>
                                    <Input id="password-register" type="password" required />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Creando cuenta..." : "Registrarse"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
