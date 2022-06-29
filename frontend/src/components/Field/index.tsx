import './styles.scss';

type Props = {
  mode: 'draw' | 'erase' | 'answer';
  matrix: Array<Array<number | string>>;
};

export default function Field({ mode, matrix }: Props) {
  return <div>Field</div>;
}
