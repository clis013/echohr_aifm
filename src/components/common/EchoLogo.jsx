import React from 'react';

/**
 * EchoLogo Component
 *
 * Vector implementation of the EchoHR brand mark (acoustic echo waveform).
 * Symmetrical 7-element acoustic ripple geometry:
 * - Bar 0: Outer left crescent
 * - Bar 1: Mid-outer left crescent
 * - Bar 2: Inner left crescent
 * - Bar 3: Center hourglass / core resonator
 * - Bar 4: Inner right crescent
 * - Bar 5: Mid-outer right crescent
 * - Bar 6: Outer right crescent
 */
export default function EchoLogo({
  size = 28,
  width,
  height,
  color = 'currentColor',
  animated = false,
  className = '',
  style = {},
  ...props
}) {
  const w = width || size;
  const h = height || (width && !height ? Math.round(width * (700 / 740)) : size);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-370 -350 740 700"
      width={w}
      height={h}
      fill={color}
      className={`inline-block select-none overflow-visible ${className}`}
      style={style}
      role="img"
      aria-label="EchoHR Logo"
      {...props}
    >
      <defs>
        {animated && (
          <style>{`
            @keyframes echoWavePulse {
              0%, 100% {
                transform: scaleY(1);
                opacity: 1;
              }
              50% {
                transform: scaleY(0.78);
                opacity: 0.88;
              }
            }
            .echo-bar {
              transform-box: fill-box;
              transform-origin: center;
            }
            .echo-bar-center {
              animation: echoWavePulse 2.2s ease-in-out infinite;
              animation-delay: 0s;
            }
            .echo-bar-inner {
              animation: echoWavePulse 2.2s ease-in-out infinite;
              animation-delay: 0.18s;
            }
            .echo-bar-mid {
              animation: echoWavePulse 2.2s ease-in-out infinite;
              animation-delay: 0.36s;
            }
            .echo-bar-outer {
              animation: echoWavePulse 2.2s ease-in-out infinite;
              animation-delay: 0.54s;
            }
          `}</style>
        )}
      </defs>

      <g>
        {/* Bar 0 (Outer Left Crescent) */}
        <path
          className={animated ? 'echo-bar echo-bar-outer' : ''}
          d="M -320 -145 V 145 C -363 72, -363 -72, -320 -145 Z"
        />

        {/* Bar 1 (Mid-Outer Left Crescent) */}
        <path
          className={animated ? 'echo-bar echo-bar-mid' : ''}
          d="M -253 -175 V 175 C -317 87, -317 -87, -253 -175 Z"
        />

        {/* Bar 2 (Inner Left Crescent) */}
        <path
          className={animated ? 'echo-bar echo-bar-inner' : ''}
          d="M -138 -273 V 273 C -261 136, -261 -136, -138 -273 Z"
        />

        {/* Bar 3 (Center Hourglass Resonator) */}
        <path
          className={animated ? 'echo-bar echo-bar-center' : ''}
          d="M -96 -335 V 335 C -64 303, -30 235, 0 143 C 30 235, 64 303, 96 335 V -335 C 64 -303, 30 -235, 0 -143 C -30 -235, -64 -303, -96 -335 Z"
        />

        {/* Bar 4 (Inner Right Crescent) */}
        <path
          className={animated ? 'echo-bar echo-bar-inner' : ''}
          d="M 138 -273 V 273 C 261 136, 261 -136, 138 -273 Z"
        />

        {/* Bar 5 (Mid-Outer Right Crescent) */}
        <path
          className={animated ? 'echo-bar echo-bar-mid' : ''}
          d="M 253 -175 V 175 C 317 87, 317 -87, 253 -175 Z"
        />

        {/* Bar 6 (Outer Right Crescent) */}
        <path
          className={animated ? 'echo-bar echo-bar-outer' : ''}
          d="M 320 -145 V 145 C 363 72, 363 -72, 320 -145 Z"
        />
      </g>
    </svg>
  );
}
