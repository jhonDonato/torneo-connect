"use client";

import Link from "next/link";
import { Gamepad2, Swords, Trophy, History, ShieldCheck, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Sorteos y Torneos", icon: Swords },
  { href: "/rankings", label: "Ranking", icon: Trophy },
  { href: "/history", label: "Historial", icon: History },
  { href: "/moderation", label: "Moderación", icon: ShieldCheck },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({ href, label, icon: Icon, isMobile = false }: { href: string; label: string; icon: React.ElementType; isMobile?: boolean }) => {
    const linkContent = (
      <Button
        variant="ghost"
        className={cn(
          "justify-start gap-2",
          pathname === href ? "bg-accent text-accent-foreground" : "",
          isMobile ? "w-full text-lg" : ""
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Button>
    );

    if (isMobile) {
      return (
        <SheetClose asChild>
          <Link href={href} passHref>
            {linkContent}
          </Link>
        </SheetClose>
      );
    }
    
    return (
       <Link href={href} passHref>
          {linkContent}
        </Link>
    )
  };

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-primary">
          <Gamepad2 className="h-8 w-8" />
          <span>TorneoConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card p-6">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                   <SheetClose asChild>
                     <Link href="/" className="flex items-center gap-2 font-headline text-xl font-bold text-primary">
                      <Gamepad2 className="h-7 w-7" />
                      <span>TorneoConnect</span>
                    </Link>
                   </SheetClose>
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon">
                       <X className="h-6 w-6" />
                       <span className="sr-only">Cerrar menú</span>
                     </Button>
                  </SheetClose>
                </div>
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} isMobile />
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}