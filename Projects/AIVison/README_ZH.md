# 🔍 AI Vision Inspector

<p align="center">
  <strong>基于深度学习的工业视觉检测平台</strong>
</p>

<p align="center">
  <a href="#-核心特性">核心特性</a> •
  <a href="#%EF%B8%8F-系统架构">系统架构</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-项目结构">项目结构</a> •
  <a href="#%EF%B8%8F-路线图">路线图</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet" alt=".NET 8"/>
  <img src="https://img.shields.io/badge/WPF-Modern_UI-0078D4?style=flat-square&logo=windows" alt="WPF"/>
  <img src="https://img.shields.io/badge/ONNX_Runtime-GPU-76B900?style=flat-square&logo=nvidia" alt="ONNX Runtime GPU"/>
  <img src="https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=flat-square&logo=pytorch" alt="PyTorch"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

---

## 📖 项目简介

**AI Vision Inspector** 是一款面向工业制造场景的全栈式 AI 视觉检测软件，将**数据管理**、**模型训练**、**实时推理**、**相机采集**与**增量学习**整合为一条完整的工作流。

本项目致力于解决传统工业视觉检测系统的核心痛点：
- ❌ 传统方案：依赖专职算法工程师、环境搭建复杂、商业软件授权昂贵
- ✅ 本方案：**无代码训练**、**一键部署**、**现场自适应学习**

### 🎯 应用场景

| 场景 | 说明 | 算法 |
|------|------|------|
| **缺陷检测** | 表面划痕、污渍、裂纹、缺件 | PatchCore / STFPM |
| **产品分类** | 型号识别、OK/NG 分选 | ResNet / MobileNet |
| **目标计数** | 零件计数、装配完整性检查 | YOLOv8 / YOLOv11 |

---

## ✨ 核心特性

### 🧠 AI 推理引擎
- **多任务支持**：异常检测、图像分类、目标检测
- **GPU 加速**：ONNX Runtime + CUDA，推理延迟 < 50ms
- **热力图可视化**：直观展示异常区域定位
- **自适应阈值**：严格 / 均衡 / 宽松三档阈值自动推荐

### 📷 相机采集系统
- **多品牌支持**：海康威视 (MVS SDK)、大恒、Basler（预留接口）
- **实时预览**：30+ FPS 连续采集
- **参数控制**：曝光、增益、Gamma 实时调节
- **自动推理**：拍照即检测，与 AI 流水线无缝衔接

### 🎓 模型训练流水线
- **无代码训练**：图形化配置，一键启动训练
- **实时监控**：训练进度、Loss 曲线、日志流式输出
- **自动部署**：训练完成自动导出 ONNX 并注册到系统
- **训练历史**：完整记录训练参数与指标

### 🔄 增量学习系统
- **现场反馈**：误检样本一键标注 (OK/NG)
- **智能更新**：基于反馈样本自动微调模型
- **版本管理**：历史版本自动备份，支持一键回滚
- **自动验证**：更新后自动验证，性能下降自动回滚

### 📊 数据管理
- **数据集向导**：可视化创建 MVTec / ImageFolder / YOLO 格式数据集
- **批量导入**：拖拽导入，文件名自动规范化
- **统计仪表盘**：实时统计、趋势图表、良品率分析

### 🔐 企业级功能
- **权限管理**：管理员 / 操作员两级权限
- **配置备份**：全部配置一键导出/导入
- **历史追溯**：检测结果自动归档，按日期查询

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                          表现层 (Presentation)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ MainWindow  │  │  Dialogs    │  │   StatisticsDashboard   │  │
│  │ (AvalonDock)│  │ (MahApps)   │  │   (LiveCharts)          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                          视图模型层 (MVVM)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │MainViewModel│  │InferenceVM  │  │ LearningControlVM       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                          服务层 (Service)                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │ OnnxAnomalyRunner│  │ CameraManager    │  │ AuthService   │  │
│  │ OnnxClassRunner  │  │ ImageSourceMgr   │  │ ConfigBackup  │  │
│  │ OnnxYoloRunner   │  │ HikvisionProvider│  │ Statistics    │  │
│  └──────────────────┘  └──────────────────┘  └───────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     增量学习模块                          │   │
│  │  SampleManager │ VersionManager │ ValidationService      │   │
│  │  RollbackMgr   │ LearningStrategy (PatchCore/STFPM/CNN)  │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                          基础设施层 (Infrastructure)             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ONNX Runtime │  │ MVS SDK     │  │ Python Interop          │  │
│  │   (GPU)     │  │ (Hikvision) │  │ (PyTorch Training)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端框架** | WPF + .NET 8 | 现代化桌面应用 |
| **UI 组件** | MahApps.Metro + AvalonDock | VS2022 风格主题 |
| **图表库** | LiveChartsCore | 实时数据可视化 |
| **推理引擎** | ONNX Runtime GPU | CUDA 加速推理 |
| **训练框架** | PyTorch + Anomalib | 异常检测算法库 |
| **相机 SDK** | 海康威视 MVS SDK | 工业相机采集 |
| **配置管理** | YamlDotNet | YAML 格式配置 |

---

## 🚀 快速开始

### 环境要求

- **操作系统**：Windows 10/11 64 位
- **运行时**：.NET 8.0 Runtime
- **GPU（可选）**：NVIDIA GPU + CUDA 11.x（用于加速推理与训练）
- **Python（训练）**：Python 3.10+ 或 Anaconda

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/ai-vision-inspector.git
cd ai-vision-inspector

# 2. 安装 Python 依赖（训练功能需要）
pip install -r scripts/requirements.txt

# 3. 编译并运行
dotnet build WpfAnomalyMvp.sln
dotnet run --project WpfAnomalyMvp
```

### 默认登录

- **用户名**：`admin`
- **密码**：`admin123`

---

## 📁 项目结构

```
ai-vision-inspector/
├── WpfAnomalyMvp/              # 主应用程序项目
│   ├── Views/                  # XAML 视图
│   ├── ViewModels/             # MVVM 视图模型
│   ├── Services/               # 业务服务层
│   │   ├── IncrementalLearning/  # 增量学习模块
│   │   └── Interfaces/         # 服务接口定义
│   ├── Models/                 # 数据模型
│   └── Themes/                 # UI 主题样式
├── WpfAnomalyMvp.Tests/        # 单元测试项目
├── scripts/                    # Python 训练脚本
│   ├── train_anomaly.py        # 异常检测训练
│   ├── train_classifier.py     # 分类模型训练
│   └── finetune_*.py           # 增量学习脚本
├── configs/                    # 配置文件
│   ├── registry.yaml           # 模型注册表
│   └── thresholds.yaml         # 阈值配置
├── models/                     # ONNX 模型文件
└── data/                       # 数据集目录
```

---

## 📊 性能指标

| 指标 | 数值 | 测试环境 |
|------|------|----------|
| **推理延迟 (GPU)** | 15-30 ms | RTX 3060, 224×224 |
| **推理延迟 (CPU)** | 80-150 ms | i7-12700 |
| **相机采集帧率** | 30+ FPS | 海康 MV-CS050-10GC |
| **训练速度** | ~2 分钟/epoch | RTX 3060, 100 张图像 |
| **内存占用** | 500-800 MB | 加载单个模型 |

---

## 🗺️ 路线图

### ✅ 已完成

- [x] 核心推理引擎 (PatchCore/STFPM/YOLO)
- [x] 相机采集系统（海康威视）
- [x] 模型训练流水线
- [x] 增量学习系统
- [x] 统计仪表盘
- [x] 权限管理系统
- [x] 配置备份/恢复

### 🚧 进行中

- [ ] 自适应阈值学习
- [ ] 大恒 / Basler 相机适配器

### 📋 规划中

- [ ] OCR 字符识别
- [ ] Web 远程监控
- [ ] 工业协议支持 (Modbus/OPC UA)
- [ ] 多相机同步采集

---

## 🛠️ 核心设计模式

### MVVM 架构
视图与业务逻辑分离，提升可测试性与可维护性。

### 策略模式
针对不同模型类型（PatchCore、STFPM、分类）的可扩展学习策略。

### 接口抽象
`IImageSource` 与 `ICameraProvider` 接口设计，轻松扩展新相机品牌。

### 服务定位器
集中式服务注册与解析，统一管理依赖。

---

## 📄 开源协议

本项目基于 MIT 协议开源，详见 [LICENSE](LICENSE) 文件。

---

## 📧 联系方式

- **作者**：Lynn Yan（严雪）
- **邮箱**：yanxue6886@163.com
- **博客**：[CSDN](https://blog.csdn.net/weixin_45560266)

---

<p align="center">
  <sub>Built with ❤️ for Industrial AI Vision</sub>
</p>
