import './styles.scss';

export default function SquareLetter() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='icon-square-letter'
    >
      <g>
        <rect x='0.5' y='0.5' width='15' height='15' rx='1.5' />
        <text x='30%' y='80%'>
          A
        </text>
      </g>
    </svg>
  );
}
