import React from 'react';
import { View } from 'react-native';

import { Button } from '@components/ui';

/** The two instruction groups offered by the user manual tabs. */
export type UserManualTabId = 'getting-started' | 'using-app';

/** Props for the {@link UserManualTabs} segmented control. */
export interface UserManualTabsProps {
  /** The currently active tab. */
  activeTab: UserManualTabId;
  /** Callback invoked with the newly selected tab id. */
  onChange: (tab: UserManualTabId) => void;
}

/** Label and icon for each manual tab. */
interface TabOption {
  id: UserManualTabId;
  label: string;
  icon: string;
}

const TABS: TabOption[] = [
  { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
  { id: 'using-app', label: 'Using the App', icon: '📱' },
];

/**
 * Senior-friendly segmented tab control for the user manual.
 *
 * Renders two large, high-contrast tab buttons. The active tab is filled with
 * the primary blue and white text; the inactive tab stays light. Each button
 * is 48px tall for easy tapping and announces its selected state to screen
 * readers.
 *
 * @param props - Component props. See {@link UserManualTabsProps}.
 * @returns A horizontally arranged pair of tab buttons.
 */
export const UserManualTabs: React.FC<UserManualTabsProps> = ({ activeTab, onChange }) => {
  return (
    <View
      className="flex-row items-center gap-2 rounded-md border border-gray-300 bg-gray-200 p-2"
      accessibilityRole="tablist">
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Button
            key={tab.id}
            size={'lg'}
            onPress={() => onChange(tab.id)}
            variant={isActive ? 'primary' : 'secondary'}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}>
            {tab.label}
          </Button>
        );
      })}
    </View>
  );
};

UserManualTabs.displayName = 'UserManualTabs';
