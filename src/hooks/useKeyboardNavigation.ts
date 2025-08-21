import { useState, useCallback, useEffect } from 'react';

interface UseKeyboardNavigationOptions<T> {
  items: T[];
  onSelect?: (item: T, index: number) => void;
  onEscape?: () => void;
  isEnabled?: boolean;
  loop?: boolean;
}

interface UseKeyboardNavigationResult {
  selectedIndex: number;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  setSelectedIndex: (index: number) => void;
  resetSelection: () => void;
}

export function useKeyboardNavigation<T>({
  items,
  onSelect,
  onEscape,
  isEnabled = true,
  loop = true,
}: UseKeyboardNavigationOptions<T>): UseKeyboardNavigationResult {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const resetSelection = useCallback(() => {
    setSelectedIndex(-1);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isEnabled || items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => {
          if (prev >= items.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
        break;

      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => {
          if (prev <= 0) {
            return loop ? items.length - 1 : 0;
          }
          return prev - 1;
        });
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          onSelect?.(items[selectedIndex], selectedIndex);
        }
        break;

      case 'Escape':
        event.preventDefault();
        resetSelection();
        onEscape?.();
        break;

      case 'Home':
        event.preventDefault();
        setSelectedIndex(0);
        break;

      case 'End':
        event.preventDefault();
        setSelectedIndex(items.length - 1);
        break;

      default:
        break;
    }
  }, [isEnabled, items, selectedIndex, onSelect, onEscape, loop]);

  useEffect(() => {
    if (selectedIndex >= items.length) {
      setSelectedIndex(-1);
    }
  }, [items.length, selectedIndex]);

  useEffect(() => {
    if (!isEnabled) {
      setSelectedIndex(-1);
    }
  }, [isEnabled]);

  return {
    selectedIndex,
    handleKeyDown,
    setSelectedIndex,
    resetSelection,
  };
}