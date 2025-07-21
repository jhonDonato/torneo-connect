import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Crown, Trophy } from "lucide-react";

const winnerHistory = [
  {
    id: "h1",
    event: "Torneo de Verano - Valorant",
    date: "15 de Junio, 2024",
    img: "gaming trophy",
    winners: [
      { rank: 1, name: "Titanes del Caos", prize: "S/ 500", avatar: "TC" },
      { rank: 2, name: "Fénix Imperial", prize: "S/ 200", avatar: "FI" },
      { rank: 3, name: "Leones de la Grieta", prize: "S/ 100", avatar: "LG" },
    ],
  },
  {
    id: "h2",
    event: "Sorteo Skin Rara",
    date: "10 de Junio, 2024",
    img: "gaming chest",
    winners: [{ rank: 1, name: "GamerPro123", prize: 'Skin "Glitchpop"', avatar: "GP" }],
  },
  {
    id: "h3",
    event: "Campeonato Nacional de Dota 2",
    date: "28 de Mayo, 2024",
    img: "esports event",
    winners: [
      { rank: 1, name: "Dragones de Ébano", prize: "S/ 10,000", avatar: "DE" },
      { rank: 2, name: "Serpientes de Acero", prize: "S/ 5,000", avatar: "SA" },
    ],
  },
];

const RankIcon = ({ rank }: { rank: number }) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-orange-400" />;
    return null;
}

export default function HistoryPage() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Historial de Ganadores</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Recordando a las leyendas. Revive los momentos de gloria de torneos y sorteos pasados.
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {winnerHistory.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="bg-card border rounded-lg shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-center gap-4 text-left w-full">
                <div className="hidden sm:block">
                  <Image
                    src={`https://placehold.co/100x100.png`}
                    data-ai-hint={item.img}
                    alt={item.event}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex-1">
                    <h3 className="font-headline text-xl text-primary">{item.event}</h3>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
                <div className="space-y-4">
                    {item.winners.map(winner => (
                        <div key={winner.name} className="flex items-center justify-between p-4 bg-background rounded-md">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarFallback>{winner.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{winner.name}</p>
                                    <p className="text-sm text-muted-foreground">Premio: {winner.prize}</p>
                                </div>
                            </div>
                            <RankIcon rank={winner.rank} />
                        </div>
                    ))}
                </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
