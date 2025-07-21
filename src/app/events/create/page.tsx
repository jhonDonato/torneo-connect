"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarIcon, CalendarPlus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const createEventSchema = z.object({
  name: z.string().min(5, { message: "El nombre del evento debe tener al menos 5 caracteres." }),
  type: z.enum(["tournament", "raffle"], { required_error: "Debes seleccionar un tipo de evento." }),
  game: z.string().min(2, { message: "El nombre del juego es requerido." }),
  prize: z.string().min(3, { message: "El premio es requerido." }),
  fee: z.coerce.number().min(0, { message: "El costo de entrada no puede ser negativo." }),
  slots: z.coerce.number().min(2, { message: "Debe haber al menos 2 cupos." }),
  eventDate: z.date({ required_error: "La fecha del evento es requerida." }),
  description: z.string().optional(),
});

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !['admin', 'employee'].includes(user.role)) {
      router.push('/');
    }
  }, [user, router]);
  
  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      game: "",
      prize: "",
      fee: 0,
      slots: 16,
    },
  });

  function onSubmit(values: z.infer<typeof createEventSchema>) {
    console.log("Creating new event:", values);
    // Here you would add the logic to save the event to your backend
  }

  if (!user || !['admin', 'employee'].includes(user.role)) {
    return null; // or a loading/unauthorized component
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><CalendarPlus /> Crear Nuevo Evento</CardTitle>
          <CardDescription>Rellena los detalles para configurar un nuevo torneo o sorteo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Evento</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="tournament" />
                          </FormControl>
                          <FormLabel className="font-normal">Torneo</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="raffle" />
                          </FormControl>
                          <FormLabel className="font-normal">Sorteo</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Torneo de Verano - Valorant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="game"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Juego</FormLabel>
                    <FormControl>
                      <Input placeholder="Valorant, Dota 2, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="prize"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Premio Principal</FormLabel>
                        <FormControl>
                        <Input placeholder="S/ 500" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="fee"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Costo de Entrada (S/)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="slots"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cupos Disponibles</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Fecha del Evento</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Elige una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
               </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Añade reglas, información adicional, etc."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Crear Evento</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
