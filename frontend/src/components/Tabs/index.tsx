import React, { ReactNode } from 'react';
import Tab, { TabIconAlignment } from 'components/Tab';
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
          tab: {
            label: 'Edit',
            onClick: onEditClick,
            icon: <LeftArrow />,
            hide: !onEditClick,
          } as TabProps,
        },
        { tab: selectedTab, isSelected: true },
        { tab: secondaryTab, iconAlignment: TabIconAlignment.Right },
      ].map(({ tab, isSelected, iconAlignment }, index) => (
        <TransitionContainer
          key={index}
          className='tab-container'
          items={[
            {
              key: 'tab',
              content: (
                <Tab
                  label={tab?.label ?? ' '}
                  isSelected={!!isSelected}
                  onClick={tab?.onClick}
                  icon={tab?.icon || <Square />}
                  alternativeLabels={tab?.alternativeLabels}
                  iconAlignment={iconAlignment}
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
