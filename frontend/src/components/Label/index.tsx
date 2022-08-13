import React from 'react';
import './styles.scss';

export enum LabelSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

type Props = {
  content: string;
  size: LabelSize;
};

export default function Label({ content, size }: Props) {
  return (
    <p className={`label label_${size}`}>
      {content.split('\\n').map((element) => (
        <>
          {element}
          <br />
        </>
      ))}
    </p>
  );
}
