import React from 'react';
import classnames from 'classnames';
import './styles.scss';
import TransitionContainer from 'components/TransitionContainer';

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

  return (
    <span className={classes}>
      {
        <TransitionContainer
          items={[{ key: 'content', content, hide: !content }]}
        />
      }
    </span>
  );
}

Square.defaultProps = {
  isFilled: false,
};
