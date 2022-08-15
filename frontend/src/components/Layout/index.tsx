import React, { ReactNode } from 'react';
import './styles.scss';

type Props = {
  children: ReactNode;
  title: string;
};

export default function Layout({ children, title }: Props) {
  return (
    <main className='layout'>
      <div className='layout__wrapper'>
        <h1 className='layout__title'>{title}</h1>
        <div className='layout__content'>{children}</div>
        <div className='layout__background' />
        <div className='layout__repeated-background'>
          <div className='layout__repeated-background-mask'></div>
          <div className='layout__repeated-background-background'></div>
        </div>
      </div>
    </main>
  );
}
