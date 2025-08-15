import { useState, useEffect, useRef, useCallback } from 'react';

export interface SensorData {
  type: 'pressure' | 'temperature';
  value: number;
  raw: number;
  filtered: {
    ema: number;
    median: number;
    median_ema: number;
  };
  unit: string;
  timestamp: string;
}

export interface WebSocketHookReturn {
  pressureData: SensorData | null;
  temperatureData: SensorData | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastUpdate: Date | null;
}

export const useWebSocket = (url: string = 'ws://localhost:3000/api/realtime'): WebSocketHookReturn => {
  const [pressureData, setPressureData] = useState<SensorData | null>(null);
  const [temperatureData, setTemperatureData] = useState<SensorData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      setConnectionStatus('connecting');
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setConnectionStatus('connected');
        console.log('WebSocket连接已建立');
        
        // 启动心跳检测
        heartbeatIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data: SensorData = JSON.parse(event.data);
          setLastUpdate(new Date());
          
          if (data.type === 'pressure') {
            setPressureData(data);
            console.log(`接收到压力数据: ${data.value.toFixed(2)} ${data.unit}`);
          } else if (data.type === 'temperature') {
            setTemperatureData(data);
            console.log(`接收到温度数据: ${data.value.toFixed(1)} ${data.unit}`);
          }
        } catch (error) {
          console.error('解析WebSocket数据失败:', error);
        }
      };

      wsRef.current.onclose = () => {
        setConnectionStatus('disconnected');
        console.log('WebSocket连接已断开');
        
        // 清理心跳检测
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
        
        // 5秒后自动重连
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('尝试重新连接WebSocket...');
          connect();
        }, 5000);
      };

      wsRef.current.onerror = (error) => {
        setConnectionStatus('error');
        console.error('WebSocket连接错误:', error);
      };

    } catch (error) {
      setConnectionStatus('error');
      console.error('创建WebSocket连接失败:', error);
    }
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      // 清理所有定时器
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      
      // 关闭WebSocket连接
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    pressureData,
    temperatureData,
    connectionStatus,
    lastUpdate
  };
};