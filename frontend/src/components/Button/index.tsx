import './styles.scss';

type Props = {
  label: string;
  onClick: () => void;
  isLoading: boolean;
};

export default function Button({ label, onClick, isLoading }: Props) {
  return (
    <button className="button" onClick={onClick} disabled={isLoading}>
      {label}
    </button>
  );
}
