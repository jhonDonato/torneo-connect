import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/session';

// Placeholder for your database logic
let employeesDB: any[] = [
    { id: "2", userId: "2", username: "EmpleadoUno", email: "empleado@test.com", passwordHash: "password123", permissions: { manageEvents: true, validatePayments: false, moderateMessages: true } },
    { id: "3", userId: "3", username: "EmpleadoDos", email: "empleado2@test.com", passwordHash: "password123", permissions: { manageEvents: false, validatePayments: true, moderateMessages: false } },
];

const createEmployeeSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  permissions: z.object({
    manageEvents: z.boolean(),
    validatePayments: z.boolean(),
    moderateMessages: z.boolean(),
  }),
});

// GET all employees
export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // In a real app, you'd fetch from your DB
    // Omit sensitive data like password hashes before sending
    const safeEmployees = employeesDB.map(({ passwordHash, ...rest }) => rest);
    
    return NextResponse.json(safeEmployees, { status: 200 });
}

// POST a new employee
export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const data = createEmployeeSchema.parse(body);

        // Check if email already exists
        if (employeesDB.some(emp => emp.email === data.email)) {
            return NextResponse.json({ message: 'Ya existe un empleado con este correo electrónico.' }, { status: 409 });
        }

        // Create new user and employee records in your DB
        const newEmployee = {
            id: String(Date.now()),
            userId: String(Date.now() + 1), //
            username: data.username,
            email: data.email,
            passwordHash: data.password, // Remember to hash this!
            permissions: data.permissions,
        };
        
        employeesDB.push(newEmployee);
        
        const { passwordHash, ...safeNewEmployee } = newEmployee;

        return NextResponse.json(safeNewEmployee, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.flatten().fieldErrors }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
