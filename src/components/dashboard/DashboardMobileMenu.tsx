"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import DashboardSidebar from "./DashboardSidebar";

export default function DashboardMobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden border-white/10 bg-white/5 text-zinc-400">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#071018]/95 p-0 backdrop-blur-xl sm:max-w-xs">
        <DialogHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-sm font-medium text-zinc-400">Menú de Navegación</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-8 w-8 text-zinc-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="max-h-[85vh] overflow-y-auto px-2 py-4">
          <DashboardSidebar onNavigate={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
