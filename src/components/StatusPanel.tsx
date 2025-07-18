import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Wifi, 
  Battery, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  Shield
} from 'lucide-react';

interface SystemStatus {
  sensor: 'online' | 'offline' | 'error';
  connection: 'connected' | 'disconnected' | 'weak';
  battery: number;
  lastUpdate: Date;
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    time: Date;
  }>;
}

export const StatusPanel: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    sensor: 'online',
    connection: 'connected',
    battery: 87,
    lastUpdate: new Date(),
    alerts: [
      {
        id: '1',
        type: 'info',
        message: '系统已连接，运行正常',
        time: new Date(Date.now() - 2000)
      },
      {
        id: '2',
        type: 'warning',
        message: '温度稍高，请注意监控',
        time: new Date(Date.now() - 30000)
      }
    ]
  });

  // 模拟系统状态更新
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        lastUpdate: new Date(),
        battery: Math.max(0, prev.battery - 0.1), // 模拟电池消耗
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
        return 'success';
      case 'weak':
        return 'warning';
      case 'offline':
      case 'disconnected':
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'sensor':
        return status.sensor === 'online' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />;
      case 'connection':
        return <Wifi className="w-4 h-4" />;
      case 'battery':
        return <Battery className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getBatteryIcon = () => {
    if (status.battery > 60) return <Battery className="w-4 h-4 text-success" />;
    if (status.battery > 20) return <Battery className="w-4 h-4 text-warning" />;
    return <Battery className="w-4 h-4 text-destructive" />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getAlertIcon = (type: 'warning' | 'error' | 'info') => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-3 h-3 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-warning" />;
      case 'info':
        return <CheckCircle className="w-3 h-3 text-success" />;
    }
  };

  return (
    <Card className="h-full shadow-[var(--shadow-card)] border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Activity className="w-5 h-5 text-primary" />
          系统状态
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 主要状态指示器 */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon('sensor')}
              <span className="text-sm font-medium">传感器状态</span>
            </div>
            <Badge variant={getStatusColor(status.sensor) as any}>
              {status.sensor === 'online' ? '在线' : status.sensor === 'offline' ? '离线' : '错误'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon('connection')}
              <span className="text-sm font-medium">连接状态</span>
            </div>
            <Badge variant={getStatusColor(status.connection) as any}>
              {status.connection === 'connected' ? '已连接' : 
               status.connection === 'weak' ? '信号弱' : '未连接'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              {getBatteryIcon()}
              <span className="text-sm font-medium">电池电量</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">{status.battery.toFixed(0)}%</span>
              <div className="w-8 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    status.battery > 60 ? 'bg-success' :
                    status.battery > 20 ? 'bg-warning' : 'bg-destructive'
                  }`}
                  style={{ width: `${Math.max(0, status.battery)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 最后更新时间 */}
        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">最后更新</span>
          </div>
          <span className="text-sm font-mono text-primary">
            {formatTime(status.lastUpdate)}
          </span>
        </div>


        {/* 系统警报 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">系统警报</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {status.alerts.map((alert) => (
              <div 
                key={alert.id}
                className="flex items-start gap-2 p-2 bg-card rounded border text-xs"
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-card-foreground">{alert.message}</div>
                  <div className="text-muted-foreground font-mono">
                    {formatTime(alert.time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 快速操作 */}
        <div className="pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            系统运行时间: 72小时15分钟
          </div>
        </div>
      </CardContent>
    </Card>
  );
};