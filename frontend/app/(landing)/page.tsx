import { BackgroundBeams } from "@/components/ui/background-beams";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundBeams />
      <ModeToggle />
    </div>
  );
}
