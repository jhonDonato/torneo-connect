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
import { Banknote, Upload, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Tournament = {
  id: string;
  name: string;
};

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tournament: Tournament | null;
}

export function PaymentDialog({ isOpen, onOpenChange, tournament }: PaymentDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: "Error",
        description: "Por favor, sube una evidencia de pago.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    // Simulate upload and validation
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Uploading file for tournament:", tournament?.name, file.name);

    setIsLoading(false);
    onOpenChange(false);
    setFile(null);

    toast({
      title: "¡Éxito!",
      description: `Tu evidencia de pago para "${tournament?.name}" ha sido enviada para validación.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary">Unirse a: {tournament?.name}</DialogTitle>
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
              />
              <p className="text-xs text-muted-foreground mt-1">Sube la captura de tu pago (JPG, PNG, WEBP).</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading ? "Enviando..." : "Enviar Evidencia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
