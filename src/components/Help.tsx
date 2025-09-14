import React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";

export function HelpButton({
  title = "Как пользоваться?",
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`inline-flex gap-2 btn-ghost ${className}`}
          variant="outline"
        >
          <HelpCircle className="h-4 w-4" />
          Гайд
        </Button>
      </DialogTrigger>

      {/* кастомный overlay */}
      <DialogOverlay className="dialog-overlay" />

      {/* кастомное content */}
      <DialogContent className="dialog-content">
        <DialogHeader>
          <DialogTitle className="text-violet-900">{title}</DialogTitle>
          <DialogDescription className="text-slate-600">
            Короткая инструкция
          </DialogDescription>
        </DialogHeader>

        <div className="prose prose-sm max-w-none text-slate-800">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
