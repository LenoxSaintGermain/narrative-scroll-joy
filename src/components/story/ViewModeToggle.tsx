import { LayoutGrid, List, GitBranch } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type ViewMode = 'build' | 'timeline' | 'grid';

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(v) => v && onChange(v as ViewMode)}
      className="bg-muted rounded-lg p-1"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem 
            value="build" 
            aria-label="Build view"
            className="data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Build View</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem 
            value="timeline" 
            aria-label="Timeline view"
            className="data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            <GitBranch className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Timeline View</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem 
            value="grid" 
            aria-label="Grid view"
            className="data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Grid View</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
}
