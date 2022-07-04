import { Matrix, MatrixItem } from '../../types/matrix';
import Mode from '../../types/mode';

import './styles.scss';

type Props = {
  matrix: Matrix;
  modeData:
    | {
        mode: Mode.Draw | Mode.Erase;
        onChange: (matrixItem: MatrixItem, row: number, column: number) => void;
      }
    | {
        mode: Mode.Answer;
      };
};

export default function Grid({ matrix, modeData }: Props) {
  return <div className='grid'>Grid</div>;
}
