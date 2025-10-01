import { memo } from "react";

const Loading = ({ className = "", ...props }) => {
  return (
    <svg className={className} width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Outer circle */}
      <circle cx="60" cy="60" r="50" fill="none" stroke="#df0031" strokeWidth="3" opacity="0.3" />

      {/* Cross-hair lines */}
      <line x1="20" y1="60" x2="100" y2="60" stroke="#df0031" strokeWidth="1" opacity="0.2" />
      <line x1="60" y1="20" x2="60" y2="100" stroke="#df0031" strokeWidth="1" opacity="0.2" />

      {/* Animated wave patterns */}
      <g opacity="0.6">
        <path d="M45 25 Q50 20 55 25 Q60 30 65 25 Q70 20 75 25" fill="none" stroke="#df0031" strokeWidth="2" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6; 0.2; 0.6" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M40 30 Q45 25 50 30 Q55 35 60 30" fill="none" stroke="#df0031" strokeWidth="1.5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3; 0,0" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4; 0.1; 0.4" dur="2.5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Rotating EXE logo */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 60 60; 360 60 60" dur="4s" repeatCount="indefinite" />

        <g transform="translate(60, 60) scale(0.6)">
          <text x="-15" y="5" fontSize="20" fill="#df0031" fontWeight="bold" fontFamily="Arial, sans-serif">
            EXE
          </text>
        </g>
      </g>

      {/* Pulsing dots */}
      <g transform="translate(60, 95)">
        <circle cx="-8" cy="0" r="2" fill="#df0031">
          <animate attributeName="opacity" values="1; 0.3; 1" dur="1s" repeatCount="indefinite" begin="0s" />
        </circle>
        <circle cx="0" cy="0" r="2" fill="#df0031">
          <animate attributeName="opacity" values="1; 0.3; 1" dur="1s" repeatCount="indefinite" begin="0.3s" />
        </circle>
        <circle cx="8" cy="0" r="2" fill="#df0031">
          <animate attributeName="opacity" values="1; 0.3; 1" dur="1s" repeatCount="indefinite" begin="0.6s" />
        </circle>
      </g>
    </svg>
  );
};

export default memo(Loading);
