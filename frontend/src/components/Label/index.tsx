import React from 'react';
import LabelSize from '../../types/labelSize';
import './styles.scss';

type Props = {
  content: string;
  size: LabelSize;
};

export default function Label({ content, size }: Props) {
  const classes = `label label_${size}`;

  return <p className={classes}>{content}</p>;
}
