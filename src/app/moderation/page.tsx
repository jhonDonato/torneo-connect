"use client";

import { useActionState, useFormStatus } from "react-dom";
import { checkMessageModeration, ModerationState } from "./actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThumbsUp, ThumbsDown, ShieldCheck, Loader2 } from "lucide-react";
import { useEffect, useRef, useActionState as useFormStateReact } from "react";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "Verificando..." : "Verificar Mensaje"}
    </Button>
  );
}

export default function ModerationPage() {
  const initialState: ModerationState = {};
  const [state, dispatch] = useFormStateReact(checkMessageModeration, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.isSafe !== undefined && state.isSafe === true) {
      // Reset form only on successful and safe message
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Moderación con IA</h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Prueba nuestro sistema de moderación de mensajes. Escribe un texto para ver si cumple con nuestras guías de la comunidad.
            </p>
        </div>
      <Card className="shadow-lg">
        <form action={dispatch} ref={formRef}>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><ShieldCheck/> Analizador de Mensajes</CardTitle>
            <CardDescription>
              El contenido será analizado por una IA para detectar texto inapropiado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-2">
              <Label htmlFor="message">Mensaje a verificar</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Escribe algo aquí..."
                rows={5}
                required
              />
              {state.errors?.message && (
                 <p className="text-sm font-medium text-destructive">{state.errors.message[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.isSafe !== undefined && (
        <Alert variant={state.isSafe ? "default" : "destructive"}>
            {state.isSafe ? (
                 <ThumbsUp className="h-4 w-4" />
            ) : (
                <ThumbsDown className="h-4 w-4" />
            )}
          <AlertTitle className="font-headline">{state.isSafe ? "Mensaje Aprobado" : "Mensaje Rechazado"}</AlertTitle>
          <AlertDescription>
            {state.isSafe ? "Este mensaje parece seguro y cumple con las guías." : `Razón: ${state.reason}`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
