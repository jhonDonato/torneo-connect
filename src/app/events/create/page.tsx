
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarIcon, CalendarPlus, Eye, EyeOff } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Combobox } from "@/components/ui/combobox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEvents, Event } from "@/context/EventContext";

const games = [
    { value: "free fire", label: "Free Fire" },
    { value: "dota 2", label: "Dota 2" },
    { value: "valorant", label: "Valorant" },
    { value: "gta v", label: "GTA V" },
    { value: "cs:go", label: "CS:GO" },
    { value: "league of legends", label: "League of Legends" },
];

const createEventSchema = z.object({
  name: z.string().min(5, { message: "El nombre del evento debe tener al menos 5 caracteres." }),
  type: z.enum(["tournament", "raffle"], { required_error: "Debes seleccionar un tipo de evento." }),
  game: z.string({ required_error: "Debes seleccionar un juego." }),
  prizeType: z.enum(["money", "object"]),
  prizeMoney: z.coerce.number().optional(),
  prizeObject: z.string().optional(),
  gameMode: z.string().optional(),
  fee: z.coerce.number().min(0, { message: "El costo de entrada no puede ser negativo." }),
  slots: z.coerce.number().min(2, { message: "Debe haber al menos 2 cupos." }),
  eventDate: z.date({ required_error: "La fecha del evento es requerida." }),
  description: z.string().optional(),
}).refine(data => {
    if (data.prizeType === 'money') return data.prizeMoney !== undefined && data.prizeMoney > 0;
    return true;
}, { message: "El monto del premio es requerido.", path: ["prizeMoney"] })
.refine(data => {
    if (data.prizeType === 'object') return data.prizeObject && data.prizeObject.length > 2;
    return true;
}, { message: "La descripción del premio es requerida.", path: ["prizeObject"] })
.refine(data => {
    if (data.type === 'tournament' && data.game === 'free fire') return !!data.gameMode;
    return true;
}, { message: "Debes seleccionar un modo de juego.", path: ["gameMode"] });


export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { events, addEvent, toggleEventStatus } = useEvents();

  useEffect(() => {
    if (!user || !['admin', 'employee'].includes(user.role)) {
      router.push('/');
    }
  }, [user, router]);
  
  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      prizeType: "money",
      fee: 0,
      slots: 16,
    },
  });

  const watchEventType = form.watch("type");
  const watchGame = form.watch("game");
  const watchPrizeType = form.watch("prizeType");

  function onSubmit(values: z.infer<typeof createEventSchema>) {
    addEvent(values);
    toast({
      title: "¡Evento Creado!",
      description: `El evento "${values.name}" ha sido creado exitosamente.`,
    });
    form.reset({
      name: "",
      type: undefined,
      game: undefined,
      prizeType: "money",
      prizeMoney: 0,
      prizeObject: "",
      gameMode: undefined,
      fee: 0,
      slots: 16,
      eventDate: undefined,
      description: "",
    });
  }

  const togglePublishStatus = (eventId: string) => {
    toggleEventStatus(eventId);
  };

  if (!user || !['admin', 'employee'].includes(user.role)) {
    return null; // or a loading/unauthorized component
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><CalendarPlus /> Crear Nuevo Evento</CardTitle>
          <CardDescription>Rellena los detalles para configurar un nuevo torneo o sorteo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Tipo de Evento</FormLabel>
                        <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="tournament" /></FormControl>
                                <FormLabel className="font-normal">Torneo</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="raffle" /></FormControl>
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
                    name="game"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Juego</FormLabel>
                        <Combobox
                            options={games}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Selecciona un juego..."
                            searchPlaceholder="Buscar juego..."
                        />
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

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
              
              {watchEventType === "tournament" && watchGame === "free fire" && (
                 <FormField
                    control={form.control}
                    name="gameMode"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Modo de Juego (Free Fire)</FormLabel>
                        <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="solitario" /></FormControl>
                                <FormLabel className="font-normal">Solitario</FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="duo" /></FormControl>
                                <FormLabel className="font-normal">Dúo</FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="escuadron" /></FormControl>
                                <FormLabel className="font-normal">Escuadrón</FormLabel>
                            </FormItem>
                        </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}

              <div>
                <FormField
                    control={form.control}
                    name="prizeType"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Tipo de Premio</FormLabel>
                        <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="money" /></FormControl>
                                <FormLabel className="font-normal">Dinero</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="object" /></FormControl>
                                <FormLabel className="font-normal">Objeto</FormLabel>
                            </FormItem>
                        </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="mt-4">
                    {watchPrizeType === 'money' ? (
                        <FormField
                            control={form.control}
                            name="prizeMoney"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monto del Premio (S/)</FormLabel>
                                <FormControl><Input type="number" placeholder="500" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    ) : (
                         <FormField
                            control={form.control}
                            name="prizeObject"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción del Objeto</FormLabel>
                                <FormControl><Input placeholder="Skin 'Glitchpop'" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    )}
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="fee"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Costo de Entrada (S/)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="slots"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cupos Disponibles</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                >
                                {field.value ? (format(field.value, "PPP")) : (<span>Elige una fecha</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
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
                      <Textarea placeholder="Añade reglas, información adicional, etc." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creando..." : "Crear Evento"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Lista de Eventos Creados</CardTitle>
          <CardDescription>Gestiona la visibilidad de tus eventos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Juego</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Publicar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell className="capitalize">{event.game}</TableCell>
                  <TableCell>{format(event.eventDate, "dd/MM/yyyy")}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={event.published ? "secondary" : "outline"}>
                      {event.published ? <Eye className="mr-2 h-3 w-3" /> : <EyeOff className="mr-2 h-3 w-3" />}
                      {event.published ? "Público" : "Oculto"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={event.published}
                      onCheckedChange={() => togglePublishStatus(event.id)}
                      aria-label="Publicar evento"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
