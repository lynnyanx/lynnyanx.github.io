# 🔌 Connector Insertion Inspector

<p align="center">
  <strong>连接器端子插入状态 AI 视觉检测系统</strong>
</p>

<p align="center">
  <a href="#-核心特性">核心特性</a> •
  <a href="#%EF%B8%8F-系统架构">系统架构</a> •
  <a href="#-硬件配置">硬件配置</a> •
  <a href="#-性能指标">性能指标</a> •
  <a href="#%EF%B8%8F-路线图">路线图</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.12"/>
  <img src="https://img.shields.io/badge/YOLOv11n-Det/OBB/Cls-0EA5E9?style=flat-square" alt="YOLOv11n"/>
  <img src="https://img.shields.io/badge/TensorRT-Jetson_Orin_NX-76B900?style=flat-square&logo=nvidia&logoColor=white" alt="TensorRT"/>
  <img src="https://img.shields.io/badge/MLflow-Tracking-0194E2?style=flat-square&logo=mlflow&logoColor=white" alt="MLflow"/>
  <img src="https://img.shields.io/badge/MongoDB-Logging-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Status-On_Hold-orange?style=flat-square" alt="Status"/>
</p>

---

## 📖 项目简介

**Connector Insertion Inspector** 是一套部署在产线上的 AI 视觉检测系统，自动判定连接器线束**两端端子**的插入状态，替代人工目检。系统覆盖工件的两个检测面（P1 引脚孔面 / P2 侧边凸块面），以**两阶段检测管线**完成「ROI 定位 → 批量分类 → 结果回映」的完整链路。

本项目要解决的核心痛点：

- ❌ 人工目检：端子微小下沉、轻微松动人眼难以稳定判定，全检节拍慢、漏检风险随疲劳上升
- ✅ 本方案：**Pin 级逐个判定**、**几何矫正消除工件倾斜**、**AI 过滤良品 + 边缘件转人工复检**

### 🎯 项目目标

| 类型 | 目标 |
|------|------|
| **主要目标** | 部署产线级 AI 视觉深度学习系统，完全替代现行人工目检流程 |
| **次要目标** | 检测吞吐量提升 50% |
| **技术目标** | 试产阶段缺陷分类准确率 ≥ 98% |
| **人效收益** | 约 225 人日 |

### 🔍 缺陷定义

| 检测面 | 类别 | 判定依据 |
|--------|------|----------|
| **P1** | OK | 端子线端的镀金触点可见，呈现两个完整的圆柱形触点 |
| **P1** | Reverse（反插） | 镀金触点部分可见，但两个圆柱未能形成完整触点形态 |
| **P1** | Uninsert（未插入） | 镀金触点不可见，端子腔体呈黑色（空腔） |
| **P2** | OK | 侧边凸块与主表面齐平，无可见白色应力痕或损伤 |
| **P2** | NG | 侧边凸块明显凸出主表面，伴随轻微白色应力痕 / 损伤 |

> 训练侧共 5 类标签（P1 三类 + P2 两类），推理时经 `CLASS_ID_MAP` 归并为 OK / NG 业务判定。

---

## ✨ 核心特性

### 🧠 两阶段检测管线
- **Stage 1 · ROI 定位**：P1 面用 `YOLOv11n` 检测水平框（引脚孔），P2 面用 `YOLOv11n-OBB` 检测旋转框（侧边凸块）
- **Stage 2 · 批量分类**：全部 ROI 裁剪图**打包成单批**送入统一的 `YOLOv11n-cls`，一次推理完成整件所有端子的判定
- **Stage 3 · 结果回映**：分类结果按 bbox 坐标映射回原图坐标系并渲染
- **零磁盘 IO**：裁剪图在内存中直接传递给分类模型，不落盘，省去产线节拍中的读写开销

### 📐 几何矫正裁剪
- **最小二乘直线拟合**：拟合端子排的基准线，得到工件实际倾角
- **arctan2 求角 + 仿射矫正**：透视变换将每个 P2 旋转框裁剪图转正
- **letterbox resize**：统一裁剪尺寸至 224×224，避免拉伸失真

### 📷 相机采集系统
- **三相机配置**：2× Basler acA4024-35uc + 1× a2A4508-20uc PRO，通过 pypylon 驱动
- **高分辨率原图**：4508×4096 (P1) / 2448×2048 (P2)，模型输入 1024×1024
- **三种运行模式**：`live`（实机）/ `simu`（Pylon 模拟相机）/ `test`（静态测试图）
- **配置外置**：相机序列号、置信度 (0.6)、IoU (0.5)、imgsz 全部在 `setting.yaml` 中管理

### 🛡️ 产线防错机制
- **NG 锁屏**：判定 NG 后锁定界面，需管理员（或授权用户）解锁，防止不良品被跳过
- **两级权限**：检测人员 / 管理员，登录态与操作权限绑定
- **存图模式**：自动 / 手动两档，兼顾追溯需求与磁盘占用

### 🔄 数据回流闭环
- **GT 误判上报**：产线人员可在 UI 上按 Pin 逐个修正判定结果（整件 24 Pin 一屏可改），修正结果自动写入评估记录库
- **样本审查工作站**：自研数据审查与一键改标工具 —— AI 预推理结果与原图联动，Pin 级交互矩阵点击即可修正 AI 错误，键盘快捷键快速保存 / 丢弃模糊难分图
- **检测记录落库**：MongoDB 记录每次检测，本地 `log_cache.json` 兜底 + 后台同步线程，断网不丢数据

### 🔬 可复现训练
- **版本双绑定**：每次训练自动记录 git commit hash 与 DVC 数据集 MD5 到 MLflow
- **运行名带时间戳**：`YYYYMMDD_HHMM_<model>_<task>`，任何实验都能回溯到确切的代码与数据版本
- **特征分布分析**：UMAP 可视化定位类间边界上的困难样本（一轮定位出 105 个边缘样本）

---

## 🏗️ 系统架构

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    产线应用层  Tkinter App (PyInstaller)                     │
│  app.py         状态机 / 登录权限 / NG 锁屏 / 存图模式                       │
│  ui_manager.py  Tkinter 布局与刷新（不含业务逻辑）                           │
│  gui_utils/     登录·用户管理 / GT 误判上报对话框                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                推理服务层  ModelService（两阶段 + 结果回映）                 │
│  Stage 1 · ROI 定位                                                          │
│    P1 面 ──► YOLOv11n       ──► 水平框（引脚孔）                             │
│    P2 面 ──► YOLOv11n-OBB   ──► 旋转框（侧边凸块）                           │
│            └─ 仿射矫正：最小二乘拟合 → arctan2 → Affine Rect.                │
│  Stage 2 · 批量分类（裁剪图内存传递，不落盘）                                │
│    全部 ROI 裁剪打包为单批 ──► YOLOv11n-cls  224x224                         │
│    5 类 → P1 OK/反插/未插 · P2 OK/NG   conf 0.6 · IoU 0.5                    │
│  Stage 3 · 结果回映：按 bbox 坐标映射回原图并渲染                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                 采集与数据层                                 │
│  CameraService       Basler acA4024-35uc x2 · a2A4508-20uc PRO               │
│                      pypylon · live/simu/test · 曝光 30000                   │
│                      原图 4508x4096 (P1) / 2448x2048 (P2)                    │
│  DataManagerService  MongoDB ← log_cache.json 兜底 + 同步线程                │
├──────────────────────────────────────────────────────────────────────────────┤
│                            训练侧  GCP · A100 x2                             │
│  yolo/ P1 检测     yolo_OBB/ P2 旋转框     yolo_cls/ 分类                    │
│  MLflow 实验追踪 · DVC 数据版本 · git commit 记录                            │
│  TensorRT 导出 .engine (含 DLA) ──► Jetson Orin NX 16GB                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **界面框架** | Tkinter + PyInstaller | 打包为单机可执行程序，产线工控机免环境部署 |
| **P1 定位模型** | `YOLOv11n` | 水平框检测引脚孔 |
| **P2 定位模型** | `YOLOv11n-OBB` | 旋转框检测侧边凸块 |
| **分类模型** | `YOLOv11n-cls`（后续实验 `yolo26m-cls`） | 裁剪图 5 类判定，输入 224×224 |
| **推理加速** | TensorRT `.engine`（含 DLA 变体） | 部署至 Jetson Orin NX 边缘设备 |
| **深度学习框架** | PyTorch + Ultralytics YOLO | 训练与导出 |
| **图像处理** | OpenCV | 拟合、仿射矫正、letterbox |
| **相机 SDK** | Basler pypylon | 工业相机采集，支持模拟模式 |
| **数据落库** | MongoDB + 本地 JSON 兜底 | 检测记录与后台同步 |
| **实验管理** | MLflow + DVC + Roboflow | 实验追踪、数据版本、数据集构建 |
| **训练平台** | GCP，A100 ×2 | 远程 Linux GPU 实例 |

---

## 🔧 硬件配置

### 运行设备

| 设备 | 配置 |
|------|------|
| **边缘设备** | Jetson Orin NX 16GB —— Ampere GPU + Arm Cortex-A78AE v8.2 64-bit CPU + 16GB LPDDR5 |
| **工控机** | i5-14600 + 32GB RAM + RTX A1000 |

### 相机与光源

| 器材 | 数量 |
|------|------|
| Basler acA4024-35uc 相机 | 2 |
| Basler a2A4508-20uc PRO 相机 | 1 |
| 镜头 C23-5028-5M | 2 |
| 镜头 V5024-MPZ | 1 |
| 相机支架 / 相机夹持 / 光源支架 | 2 / 3 / 1 |
| LED 光源 P-DL-116-W | 1 |
| 光源电源 IL-PA-24v24-2 (2ch×24V) | 1 |
| 相机 USB 线（3 米） | 3 |
| 变倍环 | 6 |

---

## 🚀 运行与部署

### 环境要求

- **产线端**：Windows 10/11 64 位、Basler 相机 + pylon Runtime、Python 3.12（或直接用打包好的 exe）
- **边缘端**：Jetson Orin NX 16GB，TensorRT engine（含 DLA 变体）
- **训练端**：GCP Linux GPU 实例（A100），CUDA 13.x，PyTorch
- **依赖管理**：`Training/` 与 `UI/` 各自独立的 `requirements.txt`

### 运行方式

```bash
# 产线应用（UI/ 目录下）
python app.py

# 打包为 Windows 可执行程序（输出在 UI/dist/）
pyinstaller app.spec

# 训练（Training/ 目录下，GPU 实例上执行）
python yolo/train.py         --batch 64   --epoch 600  --imgsz 640    # P1 检测
python yolo_OBB/train_OBB.py --batch 32   --epoch 500  --imgsz 1024   # P2 旋转框
python yolo_cls/train_cls.py --batch 1024 --epoch 1000                # 分类

# 模型评估
python yolo/test.py / yolo_OBB/test_OBB.py / yolo_cls/test_cls.py

# 查看实验追踪
mlflow ui --backend-store-uri file:///<local_mlruns>
```

### 运行模式

`UI/app_folder/setting.yaml` 在启动时读取，缺失则回退到模拟模式：

| 配置项 | 取值 | 说明 |
|--------|------|------|
| `app_mode` | `live` / `simu` / `test` | 实机相机 / Pylon 模拟 / 静态测试图 |
| `log` | `db` / `local` | 检测记录落 MongoDB 或仅落本地 |
| `save_mode` | `auto` / `manual` | 自动存图或人工触发 |

---

## 📁 项目结构

```
connector-insertion-inspection/
├── Training/                   # 训练与评估（远程 GPU 实例）
│   ├── yolo/                   # P1 面目标检测 train / test / predict
│   ├── yolo_OBB/               # P2 面旋转框检测 (OBB)
│   ├── yolo_cls/               # 裁剪图分类模型
│   ├── utils/                  # 裁剪 / 增强 / 精度评估 / UMAP 分析
│   │                           # git commit 与 DVC MD5 记录
│   └── Data/                   # 数据集与 data.yaml
├── UI/                         # 产线检测应用（Windows）
│   ├── app.py                  # 入口：状态机、登录权限、NG 锁屏
│   ├── services.py             # ModelService / CameraService / DataManagerService
│   ├── ui_manager.py           # Tkinter 布局与刷新
│   ├── configs.py              # AppConfig：路径、类别映射、常量
│   ├── crop_by_grid.py         # 网格裁剪工具
│   ├── gui_utils/              # 登录、用户管理、GT 上报对话框
│   └── app_folder/
│       ├── setting.yaml        # 运行时配置（模式 / 相机 / 阈值）
│       └── weights/            # 部署用 .pt / .engine 权重
└── pyproject.toml              # Python 3.12（uv 管理）
```

> `Training/` 与 `UI/` 中各有一份裁剪与类别映射逻辑（数据集制备 vs 产线推理），修改其一时需同步另一侧。

---

## 📊 性能指标

| 指标 | 数值 | 测试条件 |
|------|------|----------|
| **单 Pin 准确率** | 99.66% | 42,022 Pin，产线实测 |
| **单 Pin 过杀率** | 0.33% | 同上 |
| **整件准确率** | 95.3% | 2,784 件 |
| **整件过杀率** | 4.6% | 同上 |
| **分类模型 top-1** | 0.991 | 清洗后数据集 |
| **P1 面 F1-Score** | ≈ 100% | 合并「未插入 / 反插」两类后 |
| **技术目标（文档）** | ≥ 98% | 试产阶段验收线，**已达成** |

> 单 Pin 与整件两个维度差距明显：整件判定要求一件产品上全部端子同时判对，单件误判率被 Pin 数放大。

---

## 🗺️ 路线图

### ✅ 已完成

- [x] 两阶段检测管线（YOLOv11n + OBB + Cls 批量分类）
- [x] 仿射矫正裁剪链路
- [x] 数据集重建与全量标签复核
- [x] 自研样本审查与一键改标工作站
- [x] TensorRT 导出（含 DLA）与 Jetson 边缘部署
- [x] NG 锁屏与 GT 误判回流机制
- [x] MLflow + DVC 训练可复现体系

### 🚧 进行中

- [ ] 新端子型号的模型评估
- [ ] P1 面部署验证

### 📋 规划中

- [ ] P1 / P2 拆分为两个独立分类模型
- [ ] 评估 ResNet 等替代分类架构
- [ ] 自动上料与固定夹具（从源头消除手工放件导致的模糊）
- [ ] 配合自动化团队将整线升级为全自动

---

## 🛠️ 核心设计决策

### 两阶段而非端到端
定位与分类分离：定位模型只需学「端子在哪」，分类模型只需学「插得对不对」。两者可独立迭代，分类模型在 P1/P2 之间复用，且小目标检测问题被拆解成了两个各自可控的子问题。

### 单批推理
整件所有 ROI 裁剪图打包成一个 batch 送入分类模型，而非逐个 Pin 调用 —— 一次前向即完成整件判定，GPU 利用率与产线节拍都受益。

### 几何矫正优先于模型容量
与其让模型自己学会容忍工件倾斜，不如在预处理阶段用几何方法把倾斜消掉 —— 同样的模型容量因此能全部用在缺陷特征上。

### 运行模式抽象
`live` / `simu` / `test` 三模式共用同一套推理代码，没有相机也能开发调试与回归测试。

### 宁过杀不漏检
在人眼都无法判定的边缘样本上，不追求两类误差同时最优，而是明确牺牲过杀率来压低漏检率 —— 漏检流到客户端的代价远高于多一次人工复检。

---

## 📄 说明

本项目为企业内部产线项目，源码与产品图像涉及保密，未公开发布。文档、截图与演示视频中的标识信息已移除，性能指标为产线实测数据。

---

## 📧 联系方式

- **作者**：Lynn Yan（严雪）
- **邮箱**：yanxue6886@163.com
- **博客**：[CSDN](https://blog.csdn.net/weixin_45560266)

---

<p align="center">
  <sub>Built with ❤️ for Production-Line AI Inspection</sub>
</p>
