import './styles.scss';

type Props = {
  label: string;
  onClick: () => void;
};

export default function Button({ label, onClick }: Props) {
  return (
    <div className='button' onClick={onClick} role='button'>
      {label}
    </div>
  );
}
