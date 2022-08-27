import React, { ReactNode } from 'react';
import TitleLabel, { TitleLabelSize } from 'components/TitleLabel';
import './styles.scss';

type Props = {
  children: ReactNode;
  title: string;
};

export default function Layout({ children, title }: Props) {
  return (
    <div className='layout'>
      <TitleLabel content={title} size={TitleLabelSize.Large} className='layout__title' />
      <div className='layout__wrapper'>
        <main className='layout__content'>{children}</main>
        <div className='layout__background' />
        <div className='layout__repeated-background'>
          <div className='layout__repeated-background-mask'></div>
          <div className='layout__repeated-background-background'></div>
        </div>
      </div>
    </div>
  );
}
