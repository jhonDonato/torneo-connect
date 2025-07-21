"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Swords, Search } from "lucide-react";
import { PaymentDialog } from "@/components/PaymentDialog";
import { AuthDialog } from "@/components/AuthDialog";
import { Input } from "@/components/ui/input";

const games = [
    { id: 'g1', name: 'Todos', img: 'gaming montage' },
    { id: 'g2', name: 'Free Fire', img: 'battle royale' },
    { id: 'g3', name: 'Dota 2', img: 'moba game' },
    { id: 'g4', name: 'Valorant', img: 'tactical shooter' },
    { id: 'g5', name: 'GTA V', img: 'open world' }
];

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
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  
  // Simularemos el estado de autenticación. En un futuro, esto vendrá de un proveedor de contexto o hook.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleJoinClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    if (isAuthenticated) {
      setIsPaymentDialogOpen(true);
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  return (
    <>
      <div className="text-center mb-12 space-y-8">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Sorteos y Torneos Abiertos</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Participa en nuestros eventos exclusivos y demuestra tu habilidad. ¡Grandes premios te esperan!
          </p>
        </div>
        <div className="max-w-md mx-auto">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Buscar torneos o sorteos..." className="pl-10" />
            </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-headline font-bold mb-6 text-center">Explora por Juego</h2>
        <div className="flex flex-wrap justify-center gap-4">
            {games.map(game => (
                <Button key={game.id} variant="outline" className="flex flex-col h-28 w-28 p-4">
                     <Image src={`https://placehold.co/48x48.png`} alt={game.name} data-ai-hint={game.img} width={48} height={48} className="mb-2 rounded-md" />
                     <span className="text-sm font-semibold">{game.name}</span>
                </Button>
            ))}
        </div>
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
      
      <AuthDialog 
        isOpen={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
      />

      <PaymentDialog 
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        tournament={selectedTournament}
      />
    </>
  );
}
