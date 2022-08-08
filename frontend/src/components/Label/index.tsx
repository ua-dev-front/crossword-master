import React from 'react';
import LabelSize from './labelSize';
import './styles.scss';

type Props = {
  content: string;
  size: LabelSize;
};

export default function Label({ content, size }: Props) {
  return <p className={`label label_${size}`}>{content}</p>;
}
