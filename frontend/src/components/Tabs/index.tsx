import React, { ReactNode } from 'react';
import Tab from 'components/Tab';
import LeftArrow from 'icons/LeftArrow';
import './styles.scss';

type TabProps = {
  label: string;
  icon: ReactNode;
  alternativeLabel?: string;
};

type Props = {
  selectedTab: TabProps;
  secondaryTab: TabProps & {
    onClick: () => void;
  };
  onEditClick?: () => void;
};

export default function Tabs({
  selectedTab,
  secondaryTab,
  onEditClick,
}: Props) {
  return (
    <div className='tabs'>
      {onEditClick ? (
        <Tab
          label='Edit'
          isSelected={false}
          onClick={() => onEditClick()}
          icon={<LeftArrow />}
        />
      ) : (
        // Adds an empty div to keep the selected tab in the middle
        <div />
      )}
      {[selectedTab, secondaryTab].map((tab, index) => (
        <Tab
          key={index}
          label={tab.label}
          isSelected={tab === selectedTab}
          onClick={tab === secondaryTab ? secondaryTab.onClick : undefined}
          icon={tab.icon}
          alternativeLabel={tab.alternativeLabel}
        />
      ))}
    </div>
  );
}
