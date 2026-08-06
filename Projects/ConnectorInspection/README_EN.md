# 🔌 Connector Insertion Inspector

<p align="center">
  <strong>AI Vision Inspection for Connector Wire Insertion Status</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-architecture">Architecture</a> •
  <a href="#-hardware">Hardware</a> •
  <a href="#-performance-metrics">Performance</a> •
  <a href="#%EF%B8%8F-roadmap">Roadmap</a>
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

## 📖 Overview

**Connector Insertion Inspector** is a production-line AI vision system that automatically classifies the insertion status of terminals at **both ends** of a connector wire harness, replacing manual visual inspection. It covers two faces of the workpiece (P1 pin-hole face / P2 side-bump face) through a **two-stage detection pipeline**: ROI localization → batch classification → result remapping.

The core problems it addresses:

- ❌ Manual inspection: micro-sinking and slightly loose terminals are hard for the human eye to judge consistently; full inspection is slow and miss rates climb with fatigue
- ✅ This system: **per-pin verdicts**, **geometric rectification that removes workpiece tilt**, and **AI filtering good parts while borderline ones go to manual re-inspection**

### 🎯 Objectives

| Type | Target |
|------|--------|
| **Primary** | Deploy a production-ready AI vision deep-learning system, fully replacing the manual inspection process |
| **Secondary** | 50% increase in inspection throughput |
| **Technical** | ≥ 98% defect-classification accuracy during the pilot phase |
| **Efficiency gain** | ~225 man-days |

### 🔍 Defect Definitions

| Face | Class | Criterion |
|------|-------|-----------|
| **P1** | OK | The gold-plated contact at the terminal wire tip is visible, showing two complete cylindrical contact points |
| **P1** | Reverse | The gold contact is partially visible, but the two cylinders fail to form a complete contact pattern |
| **P1** | Uninsert | The gold contact is not visible; the terminal cavity appears black (empty) |
| **P2** | OK | The lateral block is flush with the main surface, with no visible white stress marks or damage |
| **P2** | NG | The lateral block significantly protrudes from the main surface, showing slight white stress marks / damage |

> Training uses 5 labels (three for P1, two for P2); at inference `CLASS_ID_MAP` collapses them into OK / NG business verdicts.

---

## ✨ Features

### 🧠 Two-Stage Detection Pipeline
- **Stage 1 · ROI localization**: `YOLOv11n` finds horizontal boxes (pin holes) on the P1 face; `YOLOv11n-OBB` finds rotated boxes (side bumps) on P2
- **Stage 2 · Batch classification**: all ROI crops are packed into a **single batch** for one unified `YOLOv11n-cls` pass, judging every terminal on the part in one inference
- **Stage 3 · Result remapping**: classification results are mapped back to original image coordinates via the bounding-box data and rendered
- **Zero disk IO**: crops pass in memory straight to the classifier — no writes in the middle of the line's takt time

### 📐 Geometric Crop Rectification
- **Least-squares line fitting**: fits the terminal row's baseline to recover the workpiece's actual tilt angle
- **arctan2 + affine rectification**: a perspective transform de-rotates every P2 rotated-box crop
- **letterbox resize**: normalizes crops to 224×224 without stretch distortion

### 📷 Camera Acquisition
- **Three-camera setup**: 2× Basler acA4024-35uc + 1× a2A4508-20uc PRO, driven through pypylon
- **High-resolution capture**: 4508×4096 (P1) / 2448×2048 (P2), with 1024×1024 model input
- **Three run modes**: `live` (physical) / `simu` (Pylon-emulated) / `test` (static test images)
- **Externalized config**: camera serials, confidence (0.6), IoU (0.5) and imgsz all live in `setting.yaml`

### 🛡️ Line Error-Proofing
- **NG lock**: an NG verdict locks the screen until an admin (or admin-authorized user) unlocks it, so defects cannot be skipped
- **Two-tier permissions**: inspector / admin, bound to login state and operation rights
- **Save modes**: automatic or manual, balancing traceability against disk usage

### 🔄 Data Feedback Loop
- **Ground-truth reporting**: operators correct verdicts pin by pin directly in the UI (all 24 pins of a part on one screen), and corrections are written straight into the evaluation record store
- **Sample review workstation**: a purpose-built data review and one-key relabeling tool — AI pre-inference results overlay the original image, a pin-level interactive matrix corrects model errors on click, and keyboard shortcuts save or discard ambiguous images fast
- **Inspection logging**: MongoDB records every inspection, with a local `log_cache.json` fallback and a background sync thread so nothing is lost when the network drops

### 🔬 Reproducible Training
- **Dual version binding**: every run logs its git commit hash and DVC dataset MD5 to MLflow
- **Timestamped run names**: `YYYYMMDD_HHMM_<model>_<task>`, so any experiment traces back to an exact code and data version
- **Feature-distribution analysis**: UMAP visualization pinpoints hard samples on class boundaries (105 borderline samples surfaced in one pass)

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                 Application Layer  Tkinter App (PyInstaller)                 │
│  app.py         state machine / auth / NG lock / save mode                   │
│  ui_manager.py  Tkinter layout & refresh (no business logic)                 │
│  gui_utils/     login & user mgmt / GT misjudgment dialog                    │
├──────────────────────────────────────────────────────────────────────────────┤
│              Inference Layer  ModelService (two stages + remap)              │
│  Stage 1 - ROI localization                                                  │
│    P1 face ──► YOLOv11n       ──► horizontal boxes (pin holes)               │
│    P2 face ──► YOLOv11n-OBB   ──► rotated boxes (side bumps)                 │
│            └─ affine rect.: least-squares → arctan2 → transform              │
│  Stage 2 - Batch classification (crops in memory, never on disk)             │
│    all ROI crops as ONE batch ──► YOLOv11n-cls  224x224                      │
│    5 classes → P1 OK/Rev/Uninsert · P2 OK/NG  conf 0.6 · IoU 0.5             │
│  Stage 3 - Remap: results mapped back via bbox coords and rendered           │
├──────────────────────────────────────────────────────────────────────────────┤
│                             Camera & Data Layer                              │
│  CameraService       Basler acA4024-35uc x2 · a2A4508-20uc PRO               │
│                      pypylon · live/simu/test · exposure 30000               │
│                      raw 4508x4096 (P1) / 2448x2048 (P2)                     │
│  DataManagerService  MongoDB ← log_cache.json fallback + sync                │
├──────────────────────────────────────────────────────────────────────────────┤
│                         Training Side  GCP · 2x A100                         │
│  yolo/ P1 det      yolo_OBB/ P2 rotated      yolo_cls/ classify              │
│  MLflow tracking · DVC dataset versions · git commit logging                 │
│  TensorRT export .engine (incl. DLA) ──► Jetson Orin NX 16GB                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **UI framework** | Tkinter + PyInstaller | Standalone executable — no environment setup on the line PC |
| **P1 localization** | `YOLOv11n` | Horizontal-box detection of pin holes |
| **P2 localization** | `YOLOv11n-OBB` | Rotated-box detection of side bumps |
| **Classifier** | `YOLOv11n-cls` (later experiment: `yolo26m-cls`) | 5-class crop verdict at 224×224 input |
| **Inference acceleration** | TensorRT `.engine` (incl. DLA variants) | Deployed to a Jetson Orin NX edge device |
| **DL framework** | PyTorch + Ultralytics YOLO | Training and export |
| **Image processing** | OpenCV | Line fitting, affine rectification, letterbox |
| **Camera SDK** | Basler pypylon | Industrial acquisition with an emulation mode |
| **Persistence** | MongoDB + local JSON fallback | Inspection records and background sync |
| **Experiment management** | MLflow + DVC + Roboflow | Tracking, data versioning, dataset construction |
| **Training platform** | GCP, 2× A100 | Remote Linux GPU instances |

---

## 🔧 Hardware

### Runtime Devices

| Device | Specification |
|--------|---------------|
| **Edge device** | Jetson Orin NX 16GB — Ampere GPU + Arm Cortex-A78AE v8.2 64-bit CPU + 16GB LPDDR5 |
| **Industrial PC** | i5-14600 + 32GB RAM + RTX A1000 |

### Cameras and Lighting

| Item | Qty |
|------|-----|
| Basler acA4024-35uc camera | 2 |
| Basler a2A4508-20uc PRO camera | 1 |
| Lens C23-5028-5M | 2 |
| Lens V5024-MPZ | 1 |
| Camera stand / holder / light holder | 2 / 3 / 1 |
| LED light P-DL-116-W | 1 |
| Light power supply IL-PA-24v24-2 (2ch×24V) | 1 |
| Camera USB cable (3 m) | 3 |
| Zoom ring | 6 |

---

## 🚀 Running and Deployment

### Requirements

- **Line side**: Windows 10/11 64-bit, Basler camera + pylon Runtime, Python 3.12 (or just the packaged exe)
- **Edge side**: Jetson Orin NX 16GB with TensorRT engines (incl. DLA variants)
- **Training side**: GCP Linux GPU instance (A100), CUDA 13.x, PyTorch
- **Dependencies**: `Training/` and `UI/` each have their own `requirements.txt`

### Commands

```bash
# Production app (from the UI/ directory)
python app.py

# Build the Windows executable (output in UI/dist/)
pyinstaller app.spec

# Training (from the Training/ directory, on the GPU instance)
python yolo/train.py         --batch 64   --epoch 600  --imgsz 640    # P1 detection
python yolo_OBB/train_OBB.py --batch 32   --epoch 500  --imgsz 1024   # P2 rotated boxes
python yolo_cls/train_cls.py --batch 1024 --epoch 1000                # classification

# Model evaluation
python yolo/test.py / yolo_OBB/test_OBB.py / yolo_cls/test_cls.py

# Experiment tracking
mlflow ui --backend-store-uri file:///<local_mlruns>
```

### Run Modes

`UI/app_folder/setting.yaml` is read at startup; if absent the app falls back to simulation defaults:

| Key | Values | Meaning |
|-----|--------|---------|
| `app_mode` | `live` / `simu` / `test` | Physical cameras / Pylon emulation / static test images |
| `log` | `db` / `local` | Log to MongoDB or local file only |
| `save_mode` | `auto` / `manual` | Automatic image saving or operator-triggered |

---

## 📁 Project Structure

```
connector-insertion-inspection/
├── Training/                   # Training & evaluation (remote GPU instance)
│   ├── yolo/                   # P1 face detection — train / test / predict
│   ├── yolo_OBB/               # P2 face rotated-box detection (OBB)
│   ├── yolo_cls/               # Crop classification model
│   ├── utils/                  # Cropping / augmentation / accuracy eval / UMAP
│   │                           # git commit and DVC MD5 logging
│   └── Data/                   # Datasets and data.yaml
├── UI/                         # Production inspection app (Windows)
│   ├── app.py                  # Entry point: state machine, auth, NG lock
│   ├── services.py             # ModelService / CameraService / DataManagerService
│   ├── ui_manager.py           # Tkinter layout & refresh
│   ├── configs.py              # AppConfig: paths, class maps, constants
│   ├── crop_by_grid.py         # Grid cropping utility
│   ├── gui_utils/              # Login, user management, GT reporting dialogs
│   └── app_folder/
│       ├── setting.yaml        # Runtime config (mode / cameras / thresholds)
│       └── weights/            # Deployed .pt / .engine weights
└── pyproject.toml              # Python 3.12 (managed with uv)
```

> Cropping and class-mapping logic exists in both `Training/` (dataset prep) and `UI/` (production inference) — a change to one usually needs mirroring in the other.

---

## 📊 Performance Metrics

| Metric | Value | Conditions |
|--------|-------|------------|
| **Per-pin accuracy** | 99.66% | 42,022 pins, measured on the line |
| **Per-pin false-positive rate** | 0.33% | Same run |
| **Per-part accuracy** | 95.3% | 2,784 parts |
| **Per-part false-positive rate** | 4.6% | Same run |
| **Classifier top-1** | 0.991 | Cleaned dataset |
| **P1 face F1-score** | ≈ 100% | After merging Uninsert / Reverse |
| **Documented technical target** | ≥ 98% | Pilot-phase acceptance bar — **met** |

> The gap between per-pin and per-part is structural: a part passes only if every terminal on it is judged correctly, so the per-pin error rate is amplified by the pin count.

---

## 🗺️ Roadmap

### ✅ Completed

- [x] Two-stage detection pipeline (YOLOv11n + OBB + batch classification)
- [x] Affine-rectified cropping chain
- [x] Dataset rebuild and full label review
- [x] Purpose-built sample review and one-key relabeling workstation
- [x] TensorRT export (incl. DLA) and Jetson edge deployment
- [x] NG lock and ground-truth feedback mechanism
- [x] MLflow + DVC reproducible training

### 🚧 In Progress

- [ ] Model evaluation for the new terminal variant
- [ ] P1 face deployment validation

### 📋 Planned

- [ ] Split P1 / P2 into two independent classification models
- [ ] Evaluate alternative classifier architectures such as ResNet
- [ ] Automatic feeding and fixture positioning (eliminate blur from manual handling at the source)
- [ ] Work with the automation team to make the whole line fully automatic

---

## 🛠️ Key Design Decisions

### Two stages instead of end-to-end
Localization and classification stay separate: the locator only learns *where the terminals are*, the classifier only learns *whether they are seated*. Each iterates independently, the classifier is reused across P1 and P2, and the small-object detection problem is decomposed into two individually tractable ones.

### One batch per part
Every ROI crop from a part is packed into a single batch for the classifier instead of one call per pin — a single forward pass judges the whole part, which helps both GPU utilization and line takt time.

### Geometric rectification over model capacity
Rather than asking the model to learn tolerance for workpiece tilt, the tilt is removed geometrically in preprocessing — so the same model capacity goes entirely toward defect features.

### Run-mode abstraction
`live` / `simu` / `test` share one inference path, so development and regression testing work with no camera attached.

### Accept over-kill to avoid misses
On borderline samples the human eye cannot resolve, the goal is not to optimize both error types at once — false-positive rate is deliberately traded away to drive the miss rate down, because a defect reaching the customer costs far more than one extra manual re-inspection.

---

## 📄 Notice

This is an internal production-line project. The source code and product imagery are confidential and not publicly released. Identifying marks have been removed from the documentation, screenshots and demo video; the performance figures are measured on the production line.

---

## 📧 Contact

- **Author**: Lynn Yan
- **Email**: yanxue6886@163.com
- **Blog**: [CSDN](https://blog.csdn.net/weixin_45560266)

---

<p align="center">
  <sub>Built with ❤️ for Production-Line AI Inspection</sub>
</p>
