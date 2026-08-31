import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@utils/helpers/cn';

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
export const UserManualTabs: React.FC<UserManualTabsProps> = ({ activeTab, onChange }) => (
  <View
    className="flex-row gap-1 rounded-md border border-gray-300 bg-gray-100 p-1"
    accessibilityRole="tablist">
    {TABS.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <Pressable
          key={tab.id}
          onPress={() => onChange(tab.id)}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel={tab.label}
          className={cn(
            'h-12 flex-1 flex-row items-center justify-center gap-2 rounded-md px-2',
            isActive ? 'bg-primary' : 'bg-transparent active:bg-gray-200'
          )}>
          <Text className={cn('text-lg', isActive ? '' : 'opacity-70')}>{tab.icon}</Text>
          <Text
            className={cn(
              'text-center text-sm font-bold tracking-wide',
              isActive ? 'text-white' : 'text-slate-800'
            )}>
            {tab.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

UserManualTabs.displayName = 'UserManualTabs';
