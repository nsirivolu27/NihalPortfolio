/** Decorative computing/economics diagrams; no live market or account data. */
export function CmdaBackdrop() {
  return (
    <div className="cmda-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern
            id="cmda-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0H0V40"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
            />
            <circle r="1.2" fill="currentColor" />
          </pattern>
          <linearGradient id="data-stream" x1="0" x2="1">
            <stop className="stream-start" offset="0" />
            <stop className="stream-end" offset="1" />
          </linearGradient>
        </defs>
        <rect width="1440" height="1000" fill="url(#cmda-grid)" opacity=".3" />

        {/* Server cabinets, patch cables and moving packets. */}
        <g className="server-field" fill="none" stroke="currentColor">
          {[1010, 1170, 1330].map((x, rack) => (
            <g key={x}>
              <rect x={x} y="100" width="126" height="310" rx="5" />
              <path
                d={`M${x + 10} 410v20h106v-20M${x + 18} 430v12M${x + 108} 430v12`}
              />
              {[0, 1, 2, 3, 4, 5, 6].map((row) => (
                <g key={row}>
                  <rect
                    x={x + 10}
                    y={115 + row * 40}
                    width="106"
                    height="30"
                    rx="2"
                  />
                  <path d={`M${x + 24} ${125 + row * 40}h44m-44 9h44`} />
                  <circle
                    className="server-led"
                    cx={x + 92}
                    cy={130 + row * 40}
                    r="2.6"
                    style={{ animationDelay: `${(row + rack) * -0.6}s` }}
                  />
                  <circle cx={x + 103} cy={130 + row * 40} r="2" />
                </g>
              ))}
            </g>
          ))}
          <path d="M1073 442v35h-140v65H740M1233 442v55H960v115H680M1393 442v85h-280v70h-100" />
          <path
            className="data-packets"
            d="M1073 442v35h-140v65H740M1233 442v55H960v115H680M1393 442v85h-280v70h-100"
          />
        </g>
        <g
          className="cmda-notations"
          fill="currentColor"
          fontSize="11"
          letterSpacing="2"
        >
          <text x="1010" y="78">
            DISTRIBUTED COMPUTE / DATA FLOW
          </text>
          <text x="1010" y="465">
            01
          </text>
          <text x="1170" y="465">
            02
          </text>
          <text x="1330" y="465">
            03
          </text>
        </g>

        {/* A supply/demand sketch and an abstract time series. */}
        <g className="econ-field" fill="none" stroke="currentColor">
          <path d="M65 785H440M90 810V545M100 580C205 590 310 700 420 750M100 750C200 720 310 610 420 570" />
          <path strokeDasharray="3 7" d="M90 663H255V785" />
          <circle cx="255" cy="663" r="7" />
          <path
            className="economic-signal"
            d="M65 890l30-10 22 6 27-32 24 12 30-42 24 7 22-16 28 22 23-35 26 11 25-34 30 8 22-24"
          />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <path
              key={i}
              opacity=".4"
              d={`M${80 + i * 40} 940v-${24 + ((i * 37) % 75)}`}
              strokeWidth="12"
            />
          ))}
        </g>
        <g className="cmda-notations" fill="currentColor" fontSize="12">
          <text x="65" y="530">
            ECONOMICS / EQUILIBRIUM
          </text>
          <text x="72" y="565">
            P
          </text>
          <text x="435" y="805">
            Q
          </text>
          <text x="422" y="572">
            S
          </text>
          <text x="422" y="756">
            D
          </text>
          <text x="70" y="975">
            SIGNAL → MODEL → INSIGHT
          </text>
        </g>

        {/* Bloch sphere and a two-qubit entanglement circuit. */}
        <g className="qubit-field" fill="none" stroke="currentColor">
          <circle cx="1200" cy="800" r="124" />
          <ellipse cx="1200" cy="800" rx="124" ry="39" />
          <ellipse
            className="qubit-meridian"
            cx="1200"
            cy="800"
            rx="45"
            ry="124"
          />
          <path d="M1200 645v310M1045 800h310M1105 890l190-180M1200 800l70-90m-70 90h-8m8 0v8" />
          <circle className="qubit-state" cx="1270" cy="710" r="6" />
          <path d="M565 785h55m32 0h198M565 850h285M760 785v65" />
          <rect x="620" y="769" width="32" height="32" />
          <circle cx="760" cy="785" r="4" fill="currentColor" />
          <circle cx="760" cy="850" r="13" />
        </g>
        <g className="cmda-notations" fill="currentColor" fontSize="14">
          <text x="1188" y="635">
            |0⟩
          </text>
          <text x="1188" y="979">
            |1⟩
          </text>
          <text x="1280" y="700">
            |ψ⟩
          </text>
          <text x="630" y="791">
            H
          </text>
          <text x="525" y="790">
            |0⟩
          </text>
          <text x="525" y="855">
            |0⟩
          </text>
          <text x="565" y="910">
            (|00⟩ + |11⟩) / √2
          </text>
          <text x="565" y="730" fontSize="11" letterSpacing="2">
            QUANTUM / ENTANGLEMENT
          </text>
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
