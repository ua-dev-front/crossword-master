import React, { ReactNode } from 'react';
import Tab, { TabIconAlign } from 'components/Tab';
import TransitionContainer from 'components/TransitionContainer';
import LeftArrow from 'icons/LeftArrow';
import Square from 'icons/Square';
import './styles.scss';

export type TabProps = {
  label: string;
  icon: ReactNode;
  alternativeLabels?: string[];
  hide?: boolean;
  onClick?: () => void;
};

export type Props = {
  selectedTab?: TabProps;
  secondaryTab?: TabProps;
  onEditClick?: () => void;
};

export default function Tabs({
  selectedTab,
  secondaryTab,
  onEditClick,
}: Props) {
  return (
    <div className='tabs'>
      {[
        {
          label: 'Edit',
          onClick: onEditClick,
          icon: <LeftArrow />,
          hide: !onEditClick,
        } as TabProps,
        selectedTab,
        secondaryTab, // isSelected and alignIcon props of the Tab component below depend on the order of tabs in the array
      ].map((tab, index) => (
        <TransitionContainer
          key={index}
          items={[
            {
              key: 'tab',
              content: (
                <Tab
                  label={tab?.label ?? ' '}
                  isSelected={index === 1}
                  onClick={tab?.onClick}
                  icon={tab?.icon || <Square />}
                  alternativeLabels={tab?.alternativeLabels}
                  alignIcon={
                    index === 2 ? TabIconAlign.Right : TabIconAlign.Left
                  }
                />
              ),
              display: !!tab && !tab.hide,
            },
          ]}
        />
      ))}
    </div>
  );
}
