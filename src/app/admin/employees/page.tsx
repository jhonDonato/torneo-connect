
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Lock, Unlock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { EditEmployeeDialog } from "@/components/EditEmployeeDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const createEmployeeSchema = z.object({
  username: z.string().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  permissions: z.object({
    manageEvents: z.boolean().default(false),
    validatePayments: z.boolean().default(false),
    moderateMessages: z.boolean().default(false),
  }),
});

const initialEmployees = [
  { id: "2", username: "EmpleadoUno", email: "empleado@test.com", permissions: { manageEvents: true, validatePayments: false, moderateMessages: true } },
  { id: "3", username: "EmpleadoDos", email: "empleado2@test.com", permissions: { manageEvents: false, validatePayments: true, moderateMessages: false } },
];

export type Employee = {
    id: string;
    username: string;
    email: string;
    permissions: {
        manageEvents: boolean;
        validatePayments: boolean;
        moderateMessages: boolean;
    }
}

export default function ManageEmployeesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);
  
  useEffect(() => {
    try {
      const storedEmployees = localStorage.getItem('employees');
      if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
      } else {
        setEmployees(initialEmployees);
        localStorage.setItem('employees', JSON.stringify(initialEmployees));
      }
    } catch (error) {
      console.error("Failed to parse employees from localStorage", error);
      setEmployees(initialEmployees);
    }
  }, []);

  const updateAndStoreEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  }

  const form = useForm<z.infer<typeof createEmployeeSchema>>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      permissions: {
        manageEvents: false,
        validatePayments: false,
        moderateMessages: false,
      },
    },
  });

  function onSubmit(values: z.infer<typeof createEmployeeSchema>) {
    setFormError(null);
    const emailExists = employees.some(emp => emp.email === values.email);
    if (emailExists) {
        setFormError("Ya existe un empleado con este correo electrónico.");
        return;
    }

    const newEmployee: Employee = {
        id: String(Date.now()),
        ...values,
    };

    updateAndStoreEmployees([...employees, newEmployee]);
    console.log("Creating new employee:", newEmployee);
    form.reset();
  }

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditDialogOpen(true);
  }

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    const updatedList = employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp);
    updateAndStoreEmployees(updatedList);
  }

  if (user?.role !== 'admin') {
    return null; // Or a loading/unauthorized component
  }

  return (
    <>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Crear Nuevo Empleado</CardTitle>
              <CardDescription>Rellena el formulario para añadir un nuevo miembro al equipo.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {formError && (
                      <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error al crear empleado</AlertTitle>
                          <AlertDescription>{formError}</AlertDescription>
                      </Alert>
                  )}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de Usuario</FormLabel>
                        <FormControl>
                          <Input placeholder="NuevoEmpleado123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="empleado@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
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
                  <div>
                    <h3 className="mb-4 text-sm font-medium">Permisos</h3>
                    <div className="space-y-4">
                      <FormField
                          control={form.control}
                          name="permissions.manageEvents"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel>Gestionar Eventos</FormLabel>
                            </FormItem>
                          )}
                        />
                      <FormField
                          control={form.control}
                          name="permissions.validatePayments"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel>Validar Pagos</FormLabel>
                            </FormItem>
                          )}
                        />
                      <FormField
                          control={form.control}
                          name="permissions.moderateMessages"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel>Moderar Mensajes</FormLabel>
                            </FormItem>
                          )}
                        />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Crear Empleado</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Users /> Lista de Empleados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Permisos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.username}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell className="flex flex-wrap gap-2">
                        <Button size="sm" variant={employee.permissions.manageEvents ? "secondary" : "outline"} className="cursor-default">
                            {employee.permissions.manageEvents ? <Unlock className="mr-2 h-3 w-3" /> : <Lock className="mr-2 h-3 w-3" />}
                            Eventos
                        </Button>
                         <Button size="sm" variant={employee.permissions.validatePayments ? "secondary" : "outline"} className="cursor-default">
                            {employee.permissions.validatePayments ? <Unlock className="mr-2 h-3 w-3" /> : <Lock className="mr-2 h-3 w-3" />}
                            Pagos
                        </Button>
                         <Button size="sm" variant={employee.permissions.moderateMessages ? "secondary" : "outline"} className="cursor-default">
                            {employee.permissions.moderateMessages ? <Unlock className="mr-2 h-3 w-3" /> : <Lock className="mr-2 h-3 w-3" />}
                            Moderación
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(employee)}>Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      {editingEmployee && (
        <EditEmployeeDialog 
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            employee={editingEmployee}
            onUpdateEmployee={handleUpdateEmployee}
        />
      )}
    </>
  );
}

    