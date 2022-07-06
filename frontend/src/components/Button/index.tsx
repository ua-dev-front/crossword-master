import './styles.scss';

type Props = {
  label: string;
  onClick: () => void;
};

export default function Button({ label, onClick }: Props) {
  return <button className='button'>Button</button>;
}
