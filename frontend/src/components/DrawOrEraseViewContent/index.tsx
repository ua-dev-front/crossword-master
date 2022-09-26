import React from 'react';
import { State } from 'store/index';
import Button from 'components/Button';
import Label, { LabelSize } from 'components/Label';
import './styles.scss';

type Props = {
  grid: State['grid'];
};

export default function DrawOrEraseContent({ grid }: Props) {
  return grid.every((row) => row.every((cell) => !cell)) ? (
    <div className='center'>
      <Label content='Let’s draw some squares first!' size={LabelSize.Large} />
    </div>
  ) : (
    <div className='center option-buttons'>
      <Button label='Generate questions' onClick={() => console.log('test')} />
      <Button
        label='Enter questions & solve'
        onClick={() => console.log('test')}
      />
    </div>
  );
}
