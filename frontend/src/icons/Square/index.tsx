import React from 'react';
import classnames from 'classnames';
import './styles.scss';

export type Props = {
  isFilled: boolean;
  content?: string;
};

export default function Square({ isFilled, content }: Props) {
  const classes = classnames(
    'icon',
    'icon-square',
    isFilled && 'icon-square_filled',
  );

  return <span className={classes}>{content}</span>;
}

Square.defaultProps = {
  isFilled: false,
};
