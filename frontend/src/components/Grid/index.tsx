import Matrix from '../../types/matrix';
import Mode from '../../types/mode';

import './styles.scss';

type Props = {
  matrix: Matrix;
  mode: Mode;
  onChange: (matrix: Matrix) => void;
};

export default function Grid({ matrix, mode, onChange }: Props) {
  return <div className='grid'>Grid</div>;
}
