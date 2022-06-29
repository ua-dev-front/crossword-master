import './styles.scss';

type Props = {
  content: string | null; // string - char or empty string
  number: number | null;
  onClick: () => void;
};

export default function Cell({ content, number, onClick }: Props) {
  return <div className='cell'>Cell</div>;
}
