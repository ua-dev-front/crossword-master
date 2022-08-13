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
  const getContentWithLineBreaks = (content: string) => {
    const splitContent = content.split('\n');

    return splitContent.map((line, index) => (
      <span key={index}>
        {line}
        {index !== splitContent.length - 1 ? <br /> : null}
      </span>
    ));
  };

  return (
    <p className={`label label_${size}`}>{getContentWithLineBreaks(content)}</p>
  );
}
