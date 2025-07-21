"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Swords } from "lucide-react";
import { PaymentDialog } from "@/components/PaymentDialog";

const tournaments = [
  { id: 't1', type: 'tournament', name: 'Torneo de Verano - Valorant', prize: 'S/ 500', fee: 'S/ 25', slots: '16/32', img: 'gaming competition', icon: Swords },
  { id: 't2', type: 'raffle', name: 'Sorteo Skin Rara', prize: 'Skin "Glitchpop"', fee: 'S/ 5', slots: '150/200', img: 'gaming gear', icon: Ticket },
  { id: 't3', type: 'tournament', name: 'Campeonato Nacional de Dota 2', prize: 'S/ 10,000', fee: 'S/ 100', slots: '8/16', img: 'esports arena', icon: Swords },
  { id: 't4', type: 'raffle', name: 'Sorteo Silla Gamer', prize: 'Silla Ergonómica Pro', fee: 'S/ 10', slots: '78/100', img: 'gaming chair', icon: Ticket },
  { id: 't5', type: 'tournament', name: 'Liga Femenina de CS:GO', prize: 'S/ 300', fee: 'S/ 20', slots: '4/8', img: 'female gamers', icon: Swords },
  { id: 't6', type: 'raffle', name: 'Sorteo de Teclado Mecánico', prize: 'Teclado HyperX Alloy', fee: 'S/ 8', slots: '45/50', img: 'mechanical keyboard', icon: Ticket },
];

type Tournament = {
  id: string;
  name: string;
};

export default function Home() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  const handleJoinClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsPaymentDialogOpen(true);
  };

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Sorteos y Torneos Abiertos</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Participa en nuestros eventos exclusivos y demuestra tu habilidad. ¡Grandes premios te esperan!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tournaments.map((item) => (
          <Card key={item.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
            <CardHeader className="p-0">
              <div className="relative">
                <Image
                  src={`https://placehold.co/600x400.png`}
                  data-ai-hint={item.img}
                  alt={item.name}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <Badge variant="default" className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm">
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.type === 'tournament' ? 'Torneo' : 'Sorteo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-6">
              <CardTitle className="font-headline text-xl mb-2">{item.name}</CardTitle>
              <CardDescription>Premio: <span className="font-semibold text-foreground">{item.prize}</span></CardDescription>
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-muted-foreground">Costo de entrada: <span className="font-bold text-primary">{item.fee}</span></span>
                <span className="text-muted-foreground">Cupos: <span className="font-bold text-foreground">{item.slots}</span></span>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full font-bold" onClick={() => handleJoinClick(item)}>
                Participar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <PaymentDialog 
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        tournament={selectedTournament}
      />
    </>
  );
}
