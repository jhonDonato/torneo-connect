"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Gamepad2 } from "lucide-react";

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/auth');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <Gamepad2 className="h-12 w-12 text-primary" />
          <DialogTitle className="font-headline text-2xl">¡Un momento!</DialogTitle>
          <DialogDescription className="text-center">
            Necesitas iniciar sesión o crear una cuenta para poder participar en este evento.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
            <Button onClick={handleNavigate}>
                Ir a Iniciar Sesión / Registro
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
