import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

// Props interface to make it fully customizable
interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string | ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "outline" | "default";
  };
  linkAction?: {
    label: string;
    href: string;
    icon?: ReactNode;
  };
}

export default function EmptyState({
  icon,
  title = "Nothing Here",
  description,
  primaryAction,
  secondaryAction,
  linkAction,
}: EmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>

      {(primaryAction || secondaryAction) && (
        <EmptyContent>
          <div className="flex gap-2">
            {primaryAction && (
              <Button onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant={secondaryAction.variant || "outline"}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </EmptyContent>
      )}

      {linkAction && (
        <Button
          variant="link"
          asChild
          className="text-muted-foreground"
          size="sm"
        >
          <a href={linkAction.href}>
            {linkAction.label} {linkAction.icon}
          </a>
        </Button>
      )}
    </Empty>
  );
}
