import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, TrendingUp } from 'lucide-react';

interface TemperatureData {
  time: string;
  temperature: number;
  timestamp: number;
}

export const TemperatureChart: React.FC = () => {
  const [data, setData] = useState<TemperatureData[]>([]);
  const [currentTemp, setCurrentTemp] = useState<number>(23.5);

  // 模拟实时温度数据
  useEffect(() => {
    const generateInitialData = () => {
      const now = Date.now();
      const initialData: TemperatureData[] = [];
      
      for (let i = 29; i >= 0; i--) {
        const timestamp = now - (i * 2000); // 每2秒一个数据点
        const time = new Date(timestamp).toLocaleTimeString('zh-CN', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        
        // 生成模拟温度数据，基础温度23度，加上一些随机波动
        const baseTemp = 23;
        const variation = Math.sin(i * 0.1) * 2 + Math.random() * 1.5 - 0.75;
        const temperature = baseTemp + variation;
        
        initialData.push({
          time,
          temperature: parseFloat(temperature.toFixed(1)),
          timestamp
        });
      }
      
      setData(initialData);
      setCurrentTemp(initialData[initialData.length - 1].temperature);
    };

    generateInitialData();

    // 每2秒更新一次数据
    const interval = setInterval(() => {
      const now = Date.now();
      const time = new Date(now).toLocaleTimeString('zh-CN', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      // 生成新的温度值
      const baseTemp = 23;
      const variation = Math.sin(now * 0.001) * 2 + Math.random() * 1.5 - 0.75;
      const newTemp = parseFloat((baseTemp + variation).toFixed(1));
      
      setCurrentTemp(newTemp);
      
      setData(prevData => {
        const newData = [...prevData, {
          time,
          temperature: newTemp,
          timestamp: now
        }];
        
        // 保持最近30个数据点
        return newData.slice(-30);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getTemperatureColor = (temp: number) => {
    if (temp < 20) return 'hsl(var(--temp-cold))';
    if (temp > 26) return 'hsl(var(--temp-hot))';
    return 'hsl(var(--temp-warm))';
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 18) return { status: '偏冷', color: 'temp-cold' };
    if (temp < 22) return { status: '正常', color: 'temp-cold' };
    if (temp < 26) return { status: '适宜', color: 'temp-warm' };
    if (temp < 30) return { status: '偏热', color: 'temp-hot' };
    return { status: '过热', color: 'temp-hot' };
  };

  const tempStatus = getTemperatureStatus(currentTemp);
  const minTemp = Math.min(...data.map(d => d.temperature));
  const maxTemp = Math.max(...data.map(d => d.temperature));
  const avgTemp = data.length > 0 ? data.reduce((sum, d) => sum + d.temperature, 0) / data.length : 0;

  return (
    <Card className="h-full shadow-[var(--shadow-card)] border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">温度监控</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">实时</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 当前温度显示 */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-card to-muted/30 rounded-lg border">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {currentTemp.toFixed(1)}°C
            </div>
            <div className={`text-sm font-medium text-${tempStatus.color}`}>
              {tempStatus.status}
            </div>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-4"
               style={{ 
                 borderColor: getTemperatureColor(currentTemp),
                 backgroundColor: getTemperatureColor(currentTemp) + '20'
               }}>
            <Thermometer 
              className="w-8 h-8"
              style={{ color: getTemperatureColor(currentTemp) }}
            />
          </div>
        </div>

        {/* 温度曲线图 */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
              />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 10, 
                  fill: 'hsl(var(--muted-foreground))' 
                }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 10, 
                  fill: 'hsl(var(--muted-foreground))' 
                }}
                width={30}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`${value}°C`, '温度']}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ 
                  r: 4, 
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-semibold text-temp-cold">
              {minTemp.toFixed(1)}°C
            </div>
            <div className="text-xs text-muted-foreground">最低</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-semibold text-temp-warm">
              {avgTemp.toFixed(1)}°C
            </div>
            <div className="text-xs text-muted-foreground">平均</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-semibold text-temp-hot">
              {maxTemp.toFixed(1)}°C
            </div>
            <div className="text-xs text-muted-foreground">最高</div>
          </div>
        </div>

        {/* 温度报警设置 */}
        <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
          <div className="text-xs font-medium text-warning mb-1">温度报警设置</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• 低温报警: &lt; 18°C</div>
            <div>• 高温报警: &gt; 30°C</div>
            <div>• 正常范围: 18°C - 30°C</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};