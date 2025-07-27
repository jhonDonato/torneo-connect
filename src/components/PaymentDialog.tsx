"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, Upload, Smartphone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/context/EventContext";

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  event: Event | null;
}

export function PaymentDialog({ isOpen, onOpenChange, event }: PaymentDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !event) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un archivo de evidencia.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('eventId', event.id);
    formData.append('amount', String(event.fee));

    try {
        const response = await fetch('/api/payments/submit', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al subir la evidencia.');
        }

        toast({
            title: "¡Éxito!",
            description: `Tu evidencia de pago para "${event.name}" ha sido enviada para validación.`,
        });
        onOpenChange(false);
        setFile(null);
    } catch (error) {
        toast({
            title: "Error de Envío",
            description: error instanceof Error ? error.message : "Un error inesperado ocurrió.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    if (!isLoading) {
        onOpenChange(false);
        setFile(null);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary">Unirse a: {event?.name}</DialogTitle>
            <DialogDescription>
              Realiza el pago y sube la evidencia para completar tu inscripción.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><Smartphone /> Pago con Yape</h3>
                <p className="text-sm text-muted-foreground">Número: <span className="font-mono text-foreground">987 654 321</span></p>
                <p className="text-sm text-muted-foreground">Nombre: <span className="font-mono text-foreground">TorneoConnect SAC</span></p>
            </div>
             <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><Banknote /> Transferencia Bancaria</h3>
                <p className="text-sm text-muted-foreground">Banco: <span className="font-mono text-foreground">BCP</span></p>
                <p className="text-sm text-muted-foreground">CCI: <span className="font-mono text-foreground">00219300123456789015</span></p>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture" className="flex items-center gap-2 font-semibold"><Upload />Subir Evidencia</Label>
              <Input 
                id="picture" 
                type="file" 
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="file:text-primary"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Sube la captura de tu pago (JPG, PNG, WEBP).</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>Cancelar</Button>
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Enviando..." : "Enviar Evidencia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
