/** Decorative mathematical sketches, not a chart of portfolio performance. */
export function CmdaBackdrop() {
  return (
    <div className="cmda-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern
            id="cmda-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="currentColor"
              strokeWidth=".6"
            />
            <circle cx="0" cy="0" r="1.6" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="1440" height="1000" fill="url(#cmda-grid)" opacity=".35" />
        <g className="cmda-contours" fill="none" stroke="currentColor">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ellipse
              key={i}
              cx="1190"
              cy="260"
              rx={80 + i * 36}
              ry={40 + i * 24}
              transform="rotate(-28 1190 260)"
            />
          ))}
          <path d="M70 710H500M100 750V470M100 685C200 690 245 480 340 590S440 645 500 500" />
          <path d="M930 800L1020 680L1150 730L1260 570M1020 680L1100 520L1260 570M1100 520L1150 730M930 800L1150 730" />
        </g>
        <g fill="currentColor" className="cmda-points">
          {[
            [130, 670],
            [175, 644],
            [220, 590],
            [255, 565],
            [290, 568],
            [330, 603],
            [380, 629],
            [430, 601],
            [470, 555],
            [930, 800],
            [1020, 680],
            [1150, 730],
            [1260, 570],
            [1100, 520],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />
          ))}
        </g>
        <g fill="currentColor" fontSize="16" className="cmda-notations">
          <text x="1060" y="470">
            ∇L(θ) = 0
          </text>
          <text x="135" y="780">
            y = Xβ + ε
          </text>
          <text x="1030" y="855">
            MODEL · TEST · ITERATE
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
      aria-label="Illustration of observations and a fitted curve"
    >
      <path d="M15 125H265M25 140V15" className="model-sketch__axis" />
      <path
        d="M25 115C85 120 95 50 150 60S210 65 255 20"
        className="model-sketch__curve"
      />
      {[
        [35, 110],
        [55, 120],
        [75, 95],
        [95, 89],
        [115, 60],
        [135, 65],
        [155, 50],
        [175, 70],
        [195, 52],
        [215, 47],
        [235, 25],
        [255, 29],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3.5" />
      ))}
    </svg>
  );
}
