
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';

const themes = ['light', 'dark', 'system'] as const;
type Theme = typeof themes[number];

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    // Initialize theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && themes.includes(savedTheme)) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to system preference
      setTheme('system');
      applyTheme('system');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Apply the selected theme
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full h-9 w-9"
      title={`Current theme: ${theme}. Click to switch.`}
    >
      {getThemeIcon()}
    </Button>
  );
};

export default ThemeSwitcher;
