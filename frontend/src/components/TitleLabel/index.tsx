import React from 'react';
import classnames from 'classnames';
import './styles.scss';

export enum TitleLabelSize {
  Small = 'small',
  Large = 'large',
}

type Props = {
  content: string;
  size: TitleLabelSize;
  className?: string;
};

export default function TitleLabel({ content, size, className }: Props) {
  return (
    <h1 className={`title-label title-label_${size} ${className}`}>
      {content}
    </h1>
  );
}
