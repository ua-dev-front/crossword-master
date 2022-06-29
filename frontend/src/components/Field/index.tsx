import './styles.scss';

type Props = {
  matrix: Array<Array<number | string>>;
  mode: 'draw' | 'erase' | 'answer';
};

export default function Field({ matrix, mode }: Props) {
  return <div className='field'>Field</div>;
}
