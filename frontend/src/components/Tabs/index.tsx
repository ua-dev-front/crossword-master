import React, { ReactNode } from 'react';
import Tab from 'components/Tab';
import LeftArrow from 'icons/LeftArrow';
import './styles.scss';

type TabProps = {
  label: string;
  icon: ReactNode;
  alternativeLabel?: string;
  hide?: boolean;
};

type Props = {
  selectedTab?: TabProps;
  secondaryTab?: TabProps & {
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
      <Tab
        label='Edit'
        isSelected={false}
        onClick={() => onEditClick?.()}
        icon={<LeftArrow />}
        hide={!onEditClick}
      />
      {[selectedTab, secondaryTab].map((tab, index) =>
        tab ? (
          <Tab
            key={index}
            label={tab.label}
            isSelected={tab === selectedTab}
            onClick={tab === secondaryTab ? secondaryTab.onClick : undefined}
            icon={tab.icon}
            alternativeLabel={tab.alternativeLabel}
            hide={tab.hide}
          />
        ) : (
          // Adds an empty div to keep correct tab positions
          <div key={index} />
        ),
      )}
    </div>
  );
}
