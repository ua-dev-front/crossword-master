export default function SquareLetter() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g>
        <rect
          x='0.5'
          y='0.5'
          width='15'
          height='15'
          rx='1.5'
          stroke='#301F0F'
          strokeOpacity='0.67'
        />
        <text
          x='30%'
          y='80%'
          fill='black'
          fontFamily="'Gloria Hallelujah', cursive"
          fontSize={12}
          fillOpacity='0.67'
        >
          A
        </text>
      </g>
    </svg>
  );
}
