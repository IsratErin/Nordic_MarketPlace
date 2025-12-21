import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterButtonProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const FilterButton = ({
  label,
  icon,
  active,
  open,
  onClick,
  children,
}: FilterButtonProps) => (
  <div className="relative">
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      className="gap-2"
    >
      {icon}
      {label}
      {active && <X className="h-3 w-3" />}
    </Button>

    {open && (
      <div className="absolute left-0 top-full z-30 mt-2 min-w-[240px] rounded-lg border bg-white p-4 shadow-lg">
        {children}
      </div>
    )}
  </div>
);
