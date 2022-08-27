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
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
};

export default function TitleLabel({
  content,
  size,
  tag: Tag,
  className,
}: Props) {
  const componentClassName = 'title-label';

  return (
    <Tag
      className={classnames(
        componentClassName,
        `${componentClassName}_${size}`,
        className
      )}
    >
      {content}
    </Tag>
  );
}
