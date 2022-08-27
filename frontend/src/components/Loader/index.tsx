import React from 'react';
import classnames from 'classnames';
import TitleLabel, { TitleLabelSize } from 'components/TitleLabel';
import './styles.scss';

type Props = {
  label: string;
  isLoading: boolean; // is needed to make the animation on the loader appear and disappear
};

export default function Loader({ label, isLoading }: Props) {
  const className = 'loader';

  return (
    <div className={classnames(className, !isLoading && `${className}_hidden`)}>
      <TitleLabel content={label} size={TitleLabelSize.Small} tag='p' />
    </div>
  );
}
