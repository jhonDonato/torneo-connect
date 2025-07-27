import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/session';

// Placeholder for your database logic
let employeesDB: any[] = [
    { id: "2", userId: "2", username: "EmpleadoUno", email: "empleado@test.com", passwordHash: "password123", permissions: { manageEvents: true, validatePayments: false, moderateMessages: true } },
    { id: "3", userId: "3", username: "EmpleadoDos", email: "empleado2@test.com", passwordHash: "password123", permissions: { manageEvents: false, validatePayments: true, moderateMessages: false } },
];

const updatePermissionsSchema = z.object({
  permissions: z.object({
    manageEvents: z.boolean(),
    validatePayments: z.boolean(),
    moderateMessages: z.boolean(),
  }),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    
    try {
        const body = await req.json();
        const { permissions } = updatePermissionsSchema.parse(body);

        const employeeIndex = employeesDB.findIndex(emp => emp.id === id);
        if (employeeIndex === -1) {
            return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
        }

        // Update in database
        employeesDB[employeeIndex].permissions = permissions;
        
        return NextResponse.json(employeesDB[employeeIndex], { status: 200 });
        
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
