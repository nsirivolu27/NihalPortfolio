import type { ProjectTheme } from "@/data/featured-projects";

export type SceneState = { theme: ProjectTheme; progress: number };

/** Illustrative scenes, not simulations or live project output. */
export function ProjectScene({ theme, progress }: SceneState) {
  const angle = (progress / 100) * Math.PI * 2;
  const stage = Math.min(3, Math.floor(progress / 25));
  return (
    <svg
      className="project-scene"
      viewBox="0 0 700 500"
      fill="none"
      aria-hidden="true"
    >
      <g className="scene-grid">
        {Array.from({ length: 15 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 50} 0v500`} />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 50}h700`} />
        ))}
      </g>
      {theme === "quantum" && (
        <>
          <g className="scene-line">
            <circle cx="380" cy="240" r="150" />
            <ellipse cx="380" cy="240" rx="150" ry="48" />
            <ellipse
              cx="380"
              cy="240"
              rx={Math.max(10, Math.abs(Math.cos(angle)) * 100)}
              ry="150"
            />
            <path d="M380 55v370M195 240h370M270 350l220-220" />
            <path
              className="scene-accent"
              d={`M380 240L${380 + Math.sin(angle) * 125} ${240 - Math.cos(angle) * 125}`}
            />
            <circle
              className="scene-dot"
              cx={380 + Math.sin(angle) * 125}
              cy={240 - Math.cos(angle) * 125}
              r="9"
            />
            {[0, 1, 2].map((i) => (
              <g key={i} opacity=".5">
                <rect x="55" y={145 + i * 55} width="78" height="40" rx="4" />
                <path d={`M68 ${160 + i * 55}h35m-35 9h25`} />
                <circle
                  className="scene-dot"
                  cx="119"
                  cy={165 + i * 55}
                  r="3"
                />
              </g>
            ))}
            <path
              className="scene-flow"
              d="M133 220h35v20h62M530 240h80v110h-80"
            />
          </g>
          <g className="scene-label">
            <text x="365" y="42">
              |0⟩
            </text>
            <text x="365" y="450">
              |1⟩
            </text>
            <text x="540" y="225">
              |ψ⟩
            </text>
            <text x="50" y="365">
              COMPUTE
            </text>
            <text x="485" y="400">
              STATE SPACE
            </text>
          </g>
        </>
      )}
      {theme === "football" && (
        <>
          <g className="scene-line">
            <rect x="65" y="65" width="570" height="360" rx="8" />
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i}>
                <path opacity=".35" d={`M${122 + i * 57} 65v360`} />
                <path d={`M${122 + i * 57} 177v12m0 122v12`} />
              </g>
            ))}
            <path
              className="scene-accent"
              strokeDasharray="5 8"
              d="M225 65v360"
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx="210" cy={145 + i * 45} r="9" />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M250 ${137 + i * 45}l16 16m0-16-16 16`} />
            ))}
            <path
              className="scene-route"
              pathLength="100"
              strokeDasharray={`${Math.max(1, progress)} 100`}
              d="M210 145h150l100-40h100M210 235h220l90 60M210 325h120l100 55h130"
            />
            <circle
              className="scene-dot"
              cx={210 + progress * 3}
              cy={235 + Math.max(0, progress - 65) * 1.7}
              r="8"
            />
          </g>
          <g className="scene-label">
            <text x="80" y="45">
              THE PLAYBOOK
            </text>
            <text x="430" y="465">
              READ THE FIELD →
            </text>
          </g>
        </>
      )}
      {theme === "relay" && (
        <>
          <g className="scene-line">
            <circle cx="350" cy="250" r="66" />
            <circle
              className="scene-orbit"
              cx="350"
              cy="250"
              r="90"
              strokeDasharray="3 12"
            />
            <path
              className="scene-flow"
              d="M150 125L350 250 555 125M150 375L350 250 555 375"
            />
            {[
              [150, 125],
              [555, 125],
              [150, 375],
              [555, 375],
            ].map(([x, y], i) => (
              <g key={i}>
                <rect
                  className="scene-device"
                  x={x - 45}
                  y={y - 33}
                  width="90"
                  height="66"
                  rx="8"
                />
                <path d={`M${x - 28} ${y - 12}h56m-56 12h40m-40 12h48`} />
              </g>
            ))}
            <circle
              className="scene-dot"
              cx={150 + progress * 4.05}
              cy={125 + Math.sin((progress / 100) * Math.PI) * 125}
              r="9"
            />
          </g>
          <g className="scene-label">
            <text x="323" y="255">
              LNKZ
            </text>
            <text x="115" y="75">
              APPS
            </text>
            <text x="520" y="75">
              MODELS
            </text>
            <text x="110" y="440">
              DEVICES
            </text>
            <text x="520" y="440">
              PEOPLE
            </text>
          </g>
        </>
      )}
      {theme === "workflow" && (
        <>
          <g className="scene-line">
            <path className="scene-flow" d="M155 155H525V345H155V155" />
            {[
              [155, 155],
              [525, 155],
              [525, 345],
              [155, 345],
            ].map(([x, y], i) => (
              <g key={i}>
                <rect
                  className={
                    stage === i
                      ? "scene-stage scene-stage-active"
                      : "scene-stage"
                  }
                  x={x - 80}
                  y={y - 45}
                  width="160"
                  height="90"
                  rx="12"
                />
                <circle
                  cx={x - 50}
                  cy={y - 18}
                  r="5"
                  className={stage === i ? "scene-dot" : ""}
                />
                <path d={`M${x - 35} ${y - 18}h72m-100 22h100m-100 13h65`} />
              </g>
            ))}
            <circle cx="340" cy="250" r="36" />
            <path d="M325 250l10 10 22-25" className="scene-accent" />
          </g>
          <g className="scene-label">
            <text x="105" y="85">
              01 DRAFT
            </text>
            <text x="455" y="85">
              02 HUMAN REVIEW
            </text>
            <text x="455" y="425">
              03 SIGN-OFF
            </text>
            <text x="105" y="425">
              04 NEXT STAGE
            </text>
          </g>
        </>
      )}
    </svg>
  );
}
