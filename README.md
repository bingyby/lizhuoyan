# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c2210ec2-b45b-4b29-ab1f-fbc90d31dcf0

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c2210ec2-b45b-4b29-ab1f-fbc90d31dcf0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c2210ec2-b45b-4b29-ab1f-fbc90d31dcf0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 数据传输接口 (Data Transmission Interfaces)

### 实时压力数据接口 (Real-time Pressure Data API)

#### 1. 压力传感器数据更新
- **接口名称**: updatePressureData
- **数据格式**: 
  ```javascript
  {
    value: number,        // 压力值 (kPa)
    timestamp: Date,      // 时间戳
    sensorId: string,     // 传感器ID
    status: 'normal' | 'warning' | 'error'  // 传感器状态
  }
  ```
- **更新频率**: 每3秒
- **回调函数**: `setPressureValue(value)`

#### 2. 单位换算接口
- **接口名称**: convertPressureUnit
- **输入参数**:
  ```javascript
  {
    value: number,        // 原始值
    fromUnit: string,     // 源单位 (kPa, bar, psi, mmHg, inH2O, kgf/cm2)
    toUnit: string,       // 目标单位
    prefix: 'k' | 'M' | 'G'  // 单位前缀
  }
  ```
- **返回值**: `number` (转换后的数值)
- **回调函数**: `handleUnitChange(unit, value)`

#### 3. 温度数据接口
- **接口名称**: updateTemperatureData
- **数据格式**:
  ```javascript
  {
    temperature: number,  // 温度值 (°C)
    humidity: number,     // 湿度 (%)
    timestamp: Date,      // 时间戳
    location: string      // 位置标识
  }
  ```
- **更新频率**: 每5秒

#### 4. 系统状态接口
- **接口名称**: updateSystemStatus
- **数据格式**:
  ```javascript
  {
    cpuUsage: number,     // CPU使用率 (%)
    memoryUsage: number,  // 内存使用率 (%)
    networkStatus: 'connected' | 'disconnected',
    lastUpdate: Date,     // 最后更新时间
    alertCount: number    // 告警数量
  }
  ```

#### 5. 数据导出接口
- **接口名称**: exportData
- **支持格式**: CSV, JSON, PDF
- **参数**:
  ```javascript
  {
    startDate: Date,      // 开始时间
    endDate: Date,        // 结束时间
    dataType: 'pressure' | 'temperature' | 'system',
    format: 'csv' | 'json' | 'pdf'
  }
  ```

### WebSocket 实时通信
- **连接地址**: `ws://localhost:3000/api/realtime`
- **支持协议**: WebSocket
- **数据推送**: 实时压力、温度、状态数据
- **心跳检测**: 每30秒

### REST API 端点
- `GET /api/pressure/current` - 获取当前压力数据
- `GET /api/pressure/history` - 获取历史压力数据
- `POST /api/settings/update` - 更新系统配置
- `GET /api/status/health` - 系统健康检查

### 数据安全
- 所有API接口支持HTTPS加密传输
- 实时数据传输采用WebSocket Secure (WSS)
- 支持JWT令牌认证
- 数据本地存储采用IndexedDB加密
