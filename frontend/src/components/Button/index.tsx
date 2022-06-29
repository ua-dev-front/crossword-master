import './styles.scss';

type Props = {
  isLoading: boolean;
  label: string;
  onClick: () => void;
};

export default function Button({ isLoading, label, onClick }: Props) {
  return <button className='button'>Button</button>;
}
