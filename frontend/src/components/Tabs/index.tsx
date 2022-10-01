import React, { ReactNode } from 'react';
import classnames from 'classnames';
import Tab from 'components/Tab';
import LeftArrow from 'icons/LeftArrow';
import './styles.scss';

type Props = {
  selectedTab: {
    label: string;
    icon: ReactNode;
  };
  secondaryTab: {
    label: string;
    onClick: () => void;
    icon: ReactNode;
  };
  onEditClick?: () => void;
};

export default function Tabs({
  selectedTab,
  secondaryTab,
  onEditClick,
}: Props) {
  const addGerundToVerb = (verb: string) => {
    if (verb.endsWith('ing')) {
      return verb;
    }

    if (verb.endsWith('e')) {
      return verb.slice(0, verb.length - 1) + 'ing';
    }

    if (verb.endsWith('ie')) {
      return verb.slice(0, verb.length - 2) + 'ying';
    }

    return verb + 'ing';
  };

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
        <div key={index} className='tabs__item'>
          <div className='tabs__tab'>
            <Tab
              label={tab.label}
              isSelected={tab === selectedTab}
              onClick={tab === secondaryTab ? secondaryTab.onClick : undefined}
              icon={tab.icon}
            />
          </div>
          {[selectedTab, secondaryTab].map((hiddenTab, indexOfHiddenTab) => (
            <div
              key={indexOfHiddenTab}
              className={classnames('tabs__tab', 'tabs__tab_hidden')}
            >
              <Tab
                label={addGerundToVerb(hiddenTab.label)}
                isSelected={true}
                icon={hiddenTab.icon}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
