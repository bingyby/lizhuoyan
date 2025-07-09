import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';
type SkinColor = 'blue' | 'green' | 'orange' | 'purple' | 'red';

const skinColors = {
  blue: { name: '工业蓝', primary: '213 94% 50%', accent: '25 95% 53%' },
  green: { name: '科技绿', primary: '142 71% 45%', accent: '195 100% 50%' },
  orange: { name: '活力橙', primary: '25 95% 53%', accent: '213 94% 50%' },
  purple: { name: '神秘紫', primary: '271 81% 56%', accent: '38 92% 50%' },
  red: { name: '警示红', primary: '0 84% 60%', accent: '142 71% 45%' }
};

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [skinColor, setSkinColor] = useState<SkinColor>('blue');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedSkin = localStorage.getItem('skinColor') as SkinColor;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedSkin) setSkinColor(savedSkin);
    
    applyTheme(savedTheme || 'system');
    applySkinColor(savedSkin || 'blue');
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.className = systemTheme;
    } else {
      root.className = newTheme;
    }
  };

  const applySkinColor = (color: SkinColor) => {
    const root = window.document.documentElement;
    const colorConfig = skinColors[color];
    
    root.style.setProperty('--primary', colorConfig.primary);
    root.style.setProperty('--accent', colorConfig.accent);
    
    // 调整相关的颜色变量
    const isDark = root.className === 'dark';
    if (isDark) {
      root.style.setProperty('--primary-glow', colorConfig.primary.replace(/(\d+)%\)/, '75%)'));
      root.style.setProperty('--gauge-fill', colorConfig.primary.replace(/(\d+)%\)/, '60%)'));
    } else {
      root.style.setProperty('--primary-glow', colorConfig.primary.replace(/(\d+)%\)/, '65%)'));
      root.style.setProperty('--gauge-fill', colorConfig.primary);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const handleSkinColorChange = (newColor: SkinColor) => {
    setSkinColor(newColor);
    localStorage.setItem('skinColor', newColor);
    applySkinColor(newColor);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {getThemeIcon()}
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">主题</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>主题设置</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className={theme === 'light' ? 'bg-accent/20' : ''}
        >
          <Sun className="w-4 h-4 mr-2" />
          <span>浅色模式</span>
          {theme === 'light' && <span className="ml-auto text-accent">●</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className={theme === 'dark' ? 'bg-accent/20' : ''}
        >
          <Moon className="w-4 h-4 mr-2" />
          <span>深色模式</span>
          {theme === 'dark' && <span className="ml-auto text-accent">●</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleThemeChange('system')}
          className={theme === 'system' ? 'bg-accent/20' : ''}
        >
          <Monitor className="w-4 h-4 mr-2" />
          <span>跟随系统</span>
          {theme === 'system' && <span className="ml-auto text-accent">●</span>}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>皮肤颜色</DropdownMenuLabel>
        
        {Object.entries(skinColors).map(([key, config]) => (
          <DropdownMenuItem 
            key={key}
            onClick={() => handleSkinColorChange(key as SkinColor)}
            className={skinColor === key ? 'bg-accent/20' : ''}
          >
            <div 
              className="w-4 h-4 mr-2 rounded-full border"
              style={{ backgroundColor: `hsl(${config.primary})` }}
            />
            <span>{config.name}</span>
            {skinColor === key && <span className="ml-auto text-accent">●</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};