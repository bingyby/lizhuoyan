import React, { useState, useEffect } from 'react';
import { PressureGauge } from '@/components/PressureGauge';
import { UnitConverter } from '@/components/UnitConverter';
import { TemperatureChart } from '@/components/TemperatureChart';
import { StatusPanel } from '@/components/StatusPanel';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useWebSocket } from '@/hooks/useWebSocket';
import { 
  Menu, 
  Gauge, 
  Thermometer,
  Calculator,
  Activity,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [gaugeUnit, setGaugeUnit] = useState<string>('kPa');
  
  // WebSocket数据连接
  const { pressureData, temperatureData, connectionStatus, lastUpdate } = useWebSocket();
  
  // 从WebSocket数据中获取压力值，如果没有数据则显示0
  const pressureValue = pressureData?.value || 0;
  const gaugeDisplayValue = pressureValue;

  // 单位转换系数
  const conversionFactors = {
    kPa: 1,
    bar: 0.01,
    psi: 0.145038,
    mmHg: 7.50062,
    inH2O: 4.01463,
    'kgf/cm2': 0.0101972
  };

  // 处理单位换算器的单位切换
  const handleUnitChange = (unit: string) => {
    setGaugeUnit(unit);
  };

  // 根据当前单位获取合适的最大值 - 固定为600kPa量程
  const getMaxValueForUnit = (unit: string) => {
    const maxValues = {
      kPa: 600,
      bar: 6,
      psi: 87,
      mmHg: 4500,
      inH2O: 2400,
      'kgf/cm2': 6
    };
    return maxValues[unit as keyof typeof maxValues] || 600;
  };

  // 根据当前单位转换压力值
  const convertPressureValue = (value: number, targetUnit: string) => {
    const kPaValue = value; // 基础值是kPa
    return kPaValue * (conversionFactors[targetUnit as keyof typeof conversionFactors] || 1);
  };

  // 获取当前单位的显示值
  const getCurrentDisplayValue = () => {
    if (gaugeUnit === 'kPa') {
      return pressureValue;
    }
    return convertPressureValue(pressureValue, gaugeUnit);
  };

  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: Home },
    { id: 'gauge', label: '压力监控', icon: Gauge },
    { id: 'temperature', label: '温度监控', icon: Thermometer },
    { id: 'converter', label: '单位换算', icon: Calculator },
    { id: 'status', label: '系统状态', icon: Activity },
  ];

  const renderMainContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
            {/* 左侧仪表盘区域 */}
            <div className="xl:col-span-2 space-y-6">
              {/* 主要压力仪表 */}
              <Card className="shadow-[var(--shadow-card)] border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-6">
                    <PressureGauge
                      value={pressureValue}
                      max={getMaxValueForUnit(gaugeUnit)}
                      unit={gaugeUnit}
                      label="主压力传感器"
                      size={350}
                      displayValue={gaugeDisplayValue}
                    />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {getCurrentDisplayValue().toFixed(1)} {gaugeUnit}
                      </div>
                      <UnitConverter currentUnit={gaugeUnit} onUnitChange={handleUnitChange} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 温度监控 */}
              <TemperatureChart temperatureData={temperatureData} />
            </div>

            {/* 右侧状态区域 */}
            <div className="space-y-6">
              <StatusPanel />
            </div>
          </div>
        );
      case 'gauge':
        return (
          <div className="flex items-center justify-center h-full">
            <PressureGauge
              value={pressureValue}
              max={getMaxValueForUnit('kPa')}
              unit="kPa"
              label="麦当劳小组压力传感器3000"
              size={350}
            />
          </div>
        );
      case 'temperature':
        return (
          <div className="max-w-4xl mx-auto">
            <TemperatureChart temperatureData={temperatureData} />
          </div>
        );
      case 'converter':
        return (
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-[var(--shadow-card)] border-border">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-primary">单位换算工具</h2>
                  <UnitConverter currentUnit={gaugeUnit} onUnitChange={handleUnitChange} />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'status':
        return (
          <div className="max-w-2xl mx-auto">
            <StatusPanel />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">功能开发中</h2>
              <p className="text-muted-foreground">该功能正在开发中，敬请期待...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="h-16 bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          {/* 左侧标题和菜单按钮 */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-primary">
                麦当劳小组压力传感器3000
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Industrial Pressure Monitoring System
              </p>
            </div>
          </div>

          {/* 右侧实时数据和主题切换 */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-success animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-warning animate-bounce' :
                'bg-destructive'
              }`} />
              <span className="text-sm font-medium text-primary">
                {pressureValue.toFixed(1)} kPa
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* 侧边栏 */}
        <aside className={`
          ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'} 
          transition-all duration-300 overflow-hidden
          bg-card border-r border-border shadow-sm
        `}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`
                    w-full justify-start gap-3 h-10
                    ${sidebarOpen ? '' : 'lg:justify-center lg:px-2'}
                    ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted'}
                  `}
                  onClick={() => setActiveMenu(item.id)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`${sidebarOpen ? '' : 'lg:hidden'}`}>
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 h-full">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
