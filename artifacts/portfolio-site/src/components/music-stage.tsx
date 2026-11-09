import { useState, type CSSProperties } from "react";
import { MicrophoneStand } from "./microphone-stand";

export function MusicStage({ preview = false }: { preview?: boolean }) {
  const [light, setLight] = useState({ x: 62, y: 35 });
  return (
    <div
      className={`music-stage ${preview ? "music-stage--preview" : ""}`}
      style={{ "--light-x": `${light.x}%`, "--light-y": `${light.y}%` } as CSSProperties}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        setLight({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 });
      }}
      onPointerLeave={() => setLight({ x: 62, y: 35 })}
    >
      <span className="music-stage__word" aria-hidden="true">VOLU</span>
      <div className="music-stage__beam" aria-hidden="true" />
      <div className="music-stage__floor" aria-hidden="true" />
      {preview && (
        <div className="music-stage__copy">
          <p className="font-mono-ui text-xs uppercase tracking-[.2em]">Music / 03</p>
          <h2 id="music-title" className="font-display">Music.</h2>
          <p className="music-stage__badge"><span aria-hidden="true" />Coming soon</p>
        </div>
      )}
      <MicrophoneStand className="music-stage__mic" />
      {!preview && <p className="music-stage__caption font-mono-ui">Coming soon</p>}
    </div>
  );
}
