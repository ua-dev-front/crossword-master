import './styles.scss';

type Props = {
  matrix: Array<Array<number | string>>;
  mode: 'draw' | 'erase' | 'answer';
  onChange: (matrix: Array<Array<number | string>>) => void;
};

export default function Field({ matrix, mode, onChange }: Props) {
  return <div className='field'>Field</div>;
}
