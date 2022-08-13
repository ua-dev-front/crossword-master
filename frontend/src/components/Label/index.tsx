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
    const splitedContent = content.split('\\n');

    return splitedContent.map((line, index) => (
      <span key={index}>
        {line}
        {index !== splitedContent.length - 1 ? <br /> : null}
      </span>
    ));
  };

  return (
    <p className={`label label_${size}`}>{getContentWithLineBreaks(content)}</p>
  );
}
