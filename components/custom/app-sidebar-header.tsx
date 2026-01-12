import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthGuard } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export function AppSidebarHeader() {
  const { user } = useAuthGuard();

  // Clock state
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour12: true })
  );

  // Greeting state
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour12: true })); // HH:MM:SS
      const hour = now.getHours();

      if (hour >= 5 && hour < 12) setGreeting("Good morning");
      else if (hour >= 12 && hour < 18) setGreeting("Good afternoon");
      else if (hour >= 18 && hour < 22) setGreeting("Good evening");
      else setGreeting("Hello");
    };

    // Initial update
    updateTimeAndGreeting();

    const interval = setInterval(updateTimeAndGreeting, 1000);
    return () => clearInterval(interval);
  }, []);

  const userName = user?.displayName || "there";

  return (
    <header className="w-full flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-xs font-medium">
          {greeting}, {userName} 👋
        </h1>
        <div className="ml-auto flex items-center gap-4">
          {/* Live clock with seconds */}
          <span className="text-xs font-mono text-muted-foreground">
            {time}
          </span>
        </div>
      </div>
    </header>
  );
}
