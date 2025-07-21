
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Download } from 'lucide-react';
import Image from 'next/image';

const initialPendingPayments = [
    { id: 'p1', user: 'GamerPro123', tournament: 'Torneo de Verano - Valorant', amount: 25, date: '2024-07-28', evidenceUrl: 'payment receipt' },
    { id: 'p2', user: 'PlayerX', tournament: 'Sorteo Skin Rara', amount: 5, date: '2024-07-28', evidenceUrl: 'transaction screenshot' },
    { id: 'p3', user: 'NewbieNoob', tournament: 'Torneo de Verano - Valorant', amount: 25, date: '2024-07-27', evidenceUrl: 'yape transfer' },
    { id: 'p4', user: 'DotaMaster', tournament: 'Campeonato Nacional de Dota 2', amount: 100, date: '2024-07-26', evidenceUrl: 'bank transfer' },
];

type Payment = {
    id: string;
    user: string;
    tournament: string;
    amount: number;
    date: string;
    evidenceUrl: string;
};

export default function ValidatePaymentsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        if (!user || !['admin', 'employee'].includes(user.role)) {
            router.push('/');
        }
    }, [user, router]);
    
    useEffect(() => {
        try {
            const storedPayments = localStorage.getItem('pendingPayments');
            if (storedPayments) {
                setPayments(JSON.parse(storedPayments));
            } else {
                setPayments(initialPendingPayments);
                localStorage.setItem('pendingPayments', JSON.stringify(initialPendingPayments));
            }
        } catch (error) {
            console.error("Failed to parse payments from localStorage", error);
            setPayments(initialPendingPayments);
        }
    }, []);

    const updateAndStorePayments = (newPayments: Payment[]) => {
        setPayments(newPayments);
        localStorage.setItem('pendingPayments', JSON.stringify(newPayments));
    };

    const handleAction = (paymentId: string, action: 'approve' | 'reject') => {
        console.log(`Payment ${paymentId} has been ${action}d.`);
        // Remove the payment from the list after action
        const updatedPayments = payments.filter(p => p.id !== paymentId);
        updateAndStorePayments(updatedPayments);
    };

    if (!user || !['admin', 'employee'].includes(user.role)) {
        return null;
    }

    return (
        <div className="space-y-8">
            <div className="text-left">
                <h1 className="font-headline text-4xl font-bold text-primary">Validación de Pagos</h1>
                <p className="mt-2 text-lg text-muted-foreground">Revisa y aprueba las inscripciones pendientes de los participantes.</p>
            </div>

            {payments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {payments.map(payment => (
                        <Card key={payment.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">{payment.tournament}</CardTitle>
                                <CardDescription>Usuario: <span className="font-medium text-foreground">{payment.user}</span></CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                                     <Image
                                        src={`https://placehold.co/300x200.png`}
                                        data-ai-hint={payment.evidenceUrl}
                                        alt={`Evidencia de ${payment.user}`}
                                        width={300}
                                        height={200}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Monto: <span className="font-bold text-primary">S/ {payment.amount.toFixed(2)}</span></span>
                                    <Badge variant="outline">{new Date(payment.date).toLocaleDateString()}</Badge>
                                </div>
                                
                                <div className="flex gap-2 pt-4">
                                    <Button size="sm" className="flex-1" onClick={() => handleAction(payment.id, 'approve')}>
                                        <Check className="mr-2 h-4 w-4" /> Aprobar
                                    </Button>
                                    <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleAction(payment.id, 'reject')}>
                                        <X className="mr-2 h-4 w-4" /> Rechazar
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12">
                     <CardHeader>
                        <CardTitle className="font-headline">¡Todo al día!</CardTitle>
                         <CardDescription>No hay pagos pendientes de validación en este momento.</CardDescription>
                    </CardHeader>
                </Card>
            )}
        </div>
    );
}

    