"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Employee } from "@/app/admin/employees/page";

interface EditEmployeeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  employee: Employee | null;
  onUpdateEmployee: (updatedEmployee: Employee) => void;
}

export function EditEmployeeDialog({ isOpen, onOpenChange, employee, onUpdateEmployee }: EditEmployeeDialogProps) {
    const [permissions, setPermissions] = useState(employee?.permissions || {
        manageEvents: false,
        validatePayments: false,
        moderateMessages: false,
    });

    useEffect(() => {
        if (employee) {
            setPermissions(employee.permissions);
        }
    }, [employee]);

    if (!employee) return null;

    const handlePermissionChange = (permission: keyof typeof permissions, checked: boolean) => {
        setPermissions(prev => ({ ...prev, [permission]: checked }));
    }

    const handleSave = () => {
        const updatedEmployee = { ...employee, permissions };
        onUpdateEmployee(updatedEmployee);
        onOpenChange(false);
    }
  
    return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Editar Permisos de {employee.username}</DialogTitle>
          <DialogDescription>
            Activa o desactiva las tareas que este empleado puede realizar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="flex items-center space-x-3">
                <Checkbox
                    id="manageEvents"
                    checked={permissions.manageEvents}
                    onCheckedChange={(checked) => handlePermissionChange('manageEvents', !!checked)}
                />
                <Label htmlFor="manageEvents" className="font-medium">Gestionar Eventos</Label>
            </div>
             <div className="flex items-center space-x-3">
                <Checkbox
                    id="validatePayments"
                    checked={permissions.validatePayments}
                    onCheckedChange={(checked) => handlePermissionChange('validatePayments', !!checked)}
                />
                <Label htmlFor="validatePayments" className="font-medium">Validar Pagos</Label>
            </div>
             <div className="flex items-center space-x-3">
                <Checkbox
                    id="moderateMessages"
                    checked={permissions.moderateMessages}
                    onCheckedChange={(checked) => handlePermissionChange('moderateMessages', !!checked)}
                />
                <Label htmlFor="moderateMessages" className="font-medium">Moderar Mensajes</Label>
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
