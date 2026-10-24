import { PageShell } from "@/components/page-shell";
import { MicrophoneStand } from "@/components/microphone-stand";

export default function Music() {
  return (
    <PageShell title="Music." eyebrow="Music / 03" intro="Coming soon.">
      <div className="flex justify-center border-y border-border bg-card/80 py-6 sm:py-10">
        <MicrophoneStand className="h-80 w-auto text-primary sm:h-96" />
      </div>
    </PageShell>
  );
}
