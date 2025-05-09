import { useCallback, useEffect } from 'react';

type TabOrder = {
  [key: string]: string;
};

const TAB_ORDER: TabOrder = {
  general: 'data',
  data: 'sharing',
  sharing: 'legal',
  legal: 'general'
};

export function useKeyboardNavigation(
  activeTab: string,
  setActiveTab: (tab: string) => void
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.tagName === 'INPUT') {
        return; // Don't handle navigation when focus is in an input
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          setActiveTab(TAB_ORDER[activeTab]);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          // Find the previous tab by looking for the current tab in values
          const previousTab = Object.entries(TAB_ORDER).find(
            ([_, next]) => next === activeTab
          )?.[0] || 'legal';
          setActiveTab(previousTab);
          break;
        case 'Home':
          event.preventDefault();
          setActiveTab('general');
          break;
        case 'End':
          event.preventDefault();
          setActiveTab('legal');
          break;
      }
    },
    [activeTab, setActiveTab]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
} 