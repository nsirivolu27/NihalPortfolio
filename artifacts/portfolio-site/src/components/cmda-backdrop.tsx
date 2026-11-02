import { ProjectScene, type SceneState } from "./project-scene";

const bayDepth = 0.73;
const bays = Array.from({ length: 7 }, (_, i) => bayDepth ** i);
const units = Array.from({ length: 15 }, (_, i) => -358 + i * 52);

// Project a rack face onto one wall of the aisle. The opposite wall reuses it.
function panel(top: number, bottom: number, near = 0.98, far = 0.75) {
  return [
    [-880 * near, top * near], [-880 * far, top * far],
    [-880 * far, bottom * far], [-880 * near, bottom * near],
  ].map((point) => point.join(",")).join(" ");
}

// Only the nearest cabinets need moving detail. The static chassis is shared.
function RackActivity({ bank }: { bank: number }) {
  const fanY = units[7] + 22;
  return (
    <g fill="currentColor">
      {[0, 1, 2, 3].map(channel => {
        const row = (bank * 3 + channel * 4) % units.length;
        const y = units[row] + 22;
        return (
          <polygon key={channel} className="rack-activity-led"
            points={panel(y, y + 5, .789, .782)}
            style={{ animationDelay: `-${(bank * 1.73 + channel * 2.41).toFixed(2)}s`,
              animationDuration: `${7 + (bank + channel * 2) % 5}s` }} />
        );
      })}
      <g transform={`translate(-775 ${fanY * .88}) scale(.78 1)`}>
        <circle r="17" fill="#080e10" stroke="currentColor" strokeOpacity=".26" />
        <g className="rack-impeller" opacity=".38"
          style={{ animationDuration: `${2.8 + (bank % 3) * .41}s` }}>
          {[0, 90, 180, 270].map(angle => (
            <path key={angle} transform={`rotate(${angle})`} d="M2-2 Q4-15 14-8 Q13-2 5 1Z" />
          ))}
        </g>
        <circle r="3" fill="#162329" />
      </g>
    </g>
  );
}

export function CmdaBackdrop({ scene = null }: { scene?: SceneState | null }) {
  if (scene) return <div className="cmda-backdrop featured-ambient" data-theme={scene.theme} aria-hidden="true"><ProjectScene {...scene} /></div>;
  return (
    <div className="cmda-backdrop server-room" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="rack-metal">
            <stop stopColor="#071015" />
            <stop offset=".7" stopColor="#121d21" />
            <stop offset="1" stopColor="#060b0d" />
          </linearGradient>
          <radialGradient id="aisle-light">
            <stop stopColor="currentColor" stopOpacity=".23" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <g id="rack-bay">
            <polygon points={panel(-406, 462, 1, bayDepth)} fill="url(#rack-metal)" stroke="currentColor" strokeOpacity=".26" />
            <polygon points={panel(-393, -386)} fill="currentColor" opacity=".69" />
            {units.map((y, i) => (
              <g key={y}>
                <polygon points={panel(y, y + 44)} fill="#091114" stroke="currentColor" strokeOpacity=".18" />
                <polygon points={panel(y + 8, y + 35, .949, .813)} fill="#172226" />
                <path d={`M-828 ${(y + 15) * .94}l112 ${-(y + 15) * .127} M-828 ${(y + 24) * .94}l112 ${-(y + 24) * .127}`} stroke="#020709" strokeWidth="3" strokeDasharray="7 3" />
                <polygon points={panel(y + 12, y + 17, .789, .782)} fill="currentColor" opacity={i % 4 === 0 ? ".2" : ".92"} />
                <polygon points={panel(y + 22, y + 26, .789, .782)} fill="currentColor" opacity=".38" />
              </g>
            ))}
            <polygon points={panel(439, 444)} fill="currentColor" opacity=".36" />
          </g>
        </defs>
        <rect width="1440" height="900" fill="#04090b" />
        <g transform="translate(842 380)">
          <ellipse className="rack-aisle-glow" cy="18" rx="620" ry="360" fill="url(#aisle-light)" />
          <g stroke="currentColor" fill="none" opacity=".2">
            {[-880, -420, 420, 880].map(x => <path key={x} d={`M${x} -510 L${x * .1} -51 M${x} 570 L${x * .1} 57`} />)}
            {bays.map(d => <path key={d} d={`M${-880*d} ${460*d}h${1760*d} M${-880*d} ${-406*d}h${1760*d}`} />)}
          </g>
          {bays.map((depth, index) => [-1, 1].map(side => (
            <g key={`${index}-${side}`} transform={`scale(${side * depth} ${depth})`}>
              <use href="#rack-bay" />
              {index < 4 && <RackActivity bank={index * 2 + (side === 1 ? 1 : 0)} />}
            </g>
          )))}
          <g className="rack-link-traffic" fill="none" stroke="currentColor" strokeLinecap="round">
            <path pathLength="100" d="M-880 -406 L-70.4 -32.48" />
            <path pathLength="100" d="M70.4 36.8 L880 460" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function ModelSketch() {
  return (
    <svg
      viewBox="0 0 280 150"
      className="model-sketch"
      role="img"
      aria-label="Illustration linking a server, data signals and a qubit"
    >
      <g className="model-sketch__axis">
        <rect x="10" y="35" width="60" height="82" rx="3" />
        {[47, 67, 87].map((y) => (
          <g key={y}>
            <rect x="18" y={y} width="44" height="16" rx="2" />
            <path d={`M24 ${y + 8}h18`} />
          </g>
        ))}
        <path d="M70 75h30v-35h34M100 75v40h34M154 40h30v35h13M154 115h30V75" />
        <rect x="134" y="30" width="20" height="20" />
        <rect x="134" y="105" width="20" height="20" />
        <circle cx="232" cy="75" r="35" />
        <ellipse cx="232" cy="75" rx="35" ry="12" />
        <ellipse cx="232" cy="75" rx="12" ry="35" />
        <path d="M232 30v90M190 75h84" />
      </g>
      <path
        className="model-sketch__curve"
        d="M232 75l22-26M72 137l20-8 12 3 18-14 17 5 20-20"
      />
      {[55, 75, 95].map((y) => (
        <circle className="server-led" key={y} cx="54" cy={y} r="2" />
      ))}
      <circle cx="254" cy="49" r="3" />
    </svg>
  );
}
