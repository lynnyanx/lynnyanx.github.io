# 🔧 Wire Crimping Defect AI Inspection

<p align="center">
  <strong>Production-line AI vision for terminal crimping quality — 14-class rotated-box (OBB) defect detection</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-architecture">Architecture</a> •
  <a href="#-model-improvement">Model Improvement</a> •
  <a href="#-performance-metrics">Performance</a> •
  <a href="#%EF%B8%8F-roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.12"/>
  <img src="https://img.shields.io/badge/YOLO11m--OBB-Rotated_Boxes-0EA5E9?style=flat-square" alt="YOLO11m-OBB"/>
  <img src="https://img.shields.io/badge/TensorRT-Accelerated-76B900?style=flat-square&logo=nvidia&logoColor=white" alt="TensorRT"/>
  <img src="https://img.shields.io/badge/Basler-pypylon-orange?style=flat-square" alt="Basler pypylon"/>
  <img src="https://img.shields.io/badge/Status-In_Production-brightgreen?style=flat-square" alt="Status"/>
</p>

---

## 📖 Overview

**Wire Crimping Defect AI Inspection** is a production-line vision system running at the Shenzhen plant. It grabs frames from a Basler industrial camera, runs **YOLO11m-OBB** (oriented bounding box) inference through TensorRT, and gives operators an annotated OK / NG / needs-review verdict for every crimped terminal — replacing an inspection step that previously relied entirely on the human eye.

Crimped terminals have a dozen-plus visual defect types. Manual inspection depends on experience, fatigues quickly, and the judgment criteria drift from person to person. This system addresses that with:

- 🎯 **14-class rotated-box detection**: OBB boxes fit the terminal's actual pose, so a tilted part doesn't confuse the geometry
- 🔁 **A built-in data feedback loop**: every operator verdict is stored alongside the model's detections, becoming the next round of fine-tuning data
- ⚠️ **Tri-state verdicts**: NG / OK / needs-review — measured on the line, "no box drawn at all" carries a 56% miss rate (9× the OK-box case), so silence is escalated instead of trusted

### 🔍 Defect Taxonomy (14 classes)

| # | Class | # | Class |
|---|-------|---|-------|
| 1 | OK (良品) | 8 | Outer mold compression little (外被压少) |
| 2 | Bell mouth missing (无喇叭口) | 9 | Outer mold misalignment (外模错位) |
| 3 | Core wire yellowish (露黄) | 10 | Shrapnel sink (弹片下陷) |
| 4 | Core wire bent back (芯线反折) | 11 | Terminal humped (端子驼背) |
| 5 | Core wire not exposed (未露芯线) | 12 | Terminal tilted backward (端子后仰) |
| 6 | Core wire too long (芯线过长) | 13 | Waterproof plug missing (防水塞遗失) |
| 7 | Glue overflow (溢胶) | 14 | Waterproof plug defect (防水塞不良) |

> Verdict rule: any defect box → **NG**; only an OK box → **OK**; no box at all → **needs review** (the model is uncertain both ways — measured as the riskiest output state).

---

## ✨ Features

### 📷 Acquisition & Inference
- **Basler industrial camera** driven by pypylon on a dedicated capture thread; camera parameters loaded from `camera_config.pfs`
- **Dual-resolution pipeline**: a resized stream feeds live continuous inference; the full-resolution frame is kept for the freeze-frame inspection shot
- **Continuous + one-shot modes**: live prediction on the video feed, plus a single full-resolution inference per capture (annotation font/line width scaled to resolution)
- **Camera emulation mode** (`PYLON_CAMEMU`): the whole app runs without physical hardware for development and regression testing
- **GPU → CPU automatic fallback** on inference failure — the line keeps running

### 🖥️ Operator Workstation (Tkinter)
- **Capture → confirm → archive workflow**: freeze the annotated frame, confirm or correct the defect labels on an always-visible button grid, save — the app returns to live automatically
- **Multi-shot per sample**: "save to same sample" groups multiple angles of one physical part; sample IDs persist across restarts
- **Saved-image review tab**: re-open any shot of the current sample, relabel it (files move between OK/NG folders automatically), zoom/pan/reset on static frames
- **Error-proofing**: OK and defect labels are mutually exclusive; saves are validated; one-click undo of the last save; custom labels are password-gated
- **Defect-first rendering**: when any defect is detected the OK box is hidden, so a single frame never shows contradictory conclusions

### 📊 Data Loop & Evaluation Tooling
- **Per-sample JSON records**: model detections (class, confidence, OBB coordinates) and the operator's verdict are stored together, one file per physical sample, atomic writes
- **Production-metric evaluation** (`evaluate_model.py`): replays every saved record as ground truth vs. prediction and reports image-level and sample-level recall / miss rate / precision / FPR — the same numbers the line cares about
- **Frozen test set**: model updates are compared on a fixed image set neither model has trained on
- **Interpretability suite**: GradCAM heatmaps, occlusion tests (delete / keep / control) and a blind-relabel protocol to audit both the model and the ground truth

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                Operator UI  Tkinter (Microsoft YaHei)              │
│  main.py        login → inspection frame switching                 │
│  ui/inspection  live / frozen / preview modes · label grid ·       │
│                 save & relabel · zoom/pan · hotkeys                │
├────────────────────────────────────────────────────────────────────┤
│                      Inference  InferenceManager                   │
│  continuous thread on resized stream · paused during freeze       │
│  one full-res predict per capture · model_lock serializes calls    │
│  YOLO11m-OBB @1280 · TensorRT engine · GPU→CPU auto fallback       │
│  defect-first rule → NG / OK / needs-review tri-state verdict      │
├────────────────────────────────────────────────────────────────────┤
│                     Camera & Data  CameraManager                   │
│  Basler via pypylon · capture thread · camera_config.pfs           │
│  resized frame (live) + full-resolution frame (capture)            │
│  DatabaseManager: per-sample JSON (detections + human verdicts)    │
├────────────────────────────────────────────────────────────────────┤
│                  Training & Evaluation  GCP · 2x A100              │
│  train.py reproducible fine-tune · eval_image_level.py             │
│  evaluate_model.py production metrics · frozen test set            │
│  GradCAM / occlusion / blind-relabel audits                        │
│  build_engine.py ONNX → TensorRT 11 engine (+ metadata header)     │
└────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Detection model** | YOLO11m-OBB (Ultralytics) | 14-class rotated-box detection, 1280 px train & inference |
| **Inference acceleration** | TensorRT engine | Custom `build_engine.py` (ONNX → TRT 11 Python API) |
| **DL framework** | PyTorch (cu128) | Training on GCP, 2× A100 |
| **Camera SDK** | Basler pypylon | Capture thread + `.pfs` parameter files + emulation mode |
| **UI framework** | Tkinter | Line workstation, Simplified Chinese UI |
| **Persistence** | Per-sample JSON | Atomic writes, model + human verdicts together |
| **Dependency management** | uv (Python 3.12) | Reproducible environment |
| **Interpretability** | GradCAM · occlusion tests | Model-attention audits on val set |

---

## 🔬 Model Improvement

The system shipped with an inherited baseline model. Instead of trusting handover numbers, the app logged **model detections and operator verdicts side by side** for every inspection from day one — 358 samples / 1,334 images in the first week — which made the real performance measurable:

**Baseline (production measurement)**: precision 97.6%, but image-level NG recall only **35.6%** — two out of three defective images passed. For quality inspection, misses are the fatal error side.

### Root causes found

1. **Label–architecture mismatch (key finding)** — the OK box spans ~70% of the image, beyond the YOLO-OBB box-regression range (DFL `reg_max` × stride). Boxes were truncated to 54–87% of true size, confidence capped at 0.8, and 35 duplicate false alarms appeared. **Fix**: cap the OK label's long side at ≤600 px @1280 → box-quality mAP50-95 jumped **0.58 → 0.99**, duplicates eliminated.
2. **Severe class imbalance & scarcity** — 650 OK boxes vs ≤25 for most defect classes; three classes had ≤5 samples. **Fix**: rebuilt the data pipeline (audit, split by physical sample ID to prevent leakage, rare-class stratification), LVIS repeat-factor oversampling, and merged remapped legacy datasets (+516 images) so every rare class has ≥140 training instances.
3. **Small, occluded key defect** — core-wire-bent-back is tiny and partially hidden by the waterproof plug; 640 px inference starved it of resolution (3.8% recall). **Fix**: 640 → 1280 px training and inference; the deployed model now measures 97% val recall on this class (AP50 0.95).
4. **Taxonomy gaps** — operator labels that were not model classes structurally inflated the miss statistics. **Fix**: added the 14th class, unified duplicate label names, re-reviewed 147 inconsistent boxes, and excluded ambiguous images entirely (deleting only the box would teach the model to ignore the defect).

### Verified on a frozen test set

1,008 images from later production batches — never seen by either model:

| Metric | Baseline | Fine-tuned |
|--------|---------:|-----------:|
| Accuracy | 71.1% | **85.0%** |
| NG recall | 59.1% | **84.3%** |

### Production acceptance — the real test

The delivered model (finetune 20260728, 14 classes, 1280 px, conf 0.6) was accepted against **8,224 production images / 2,060 samples** collected 2026-07-31 ~ 08-01, after the training cutoff — no data contamination:

| Acceptance metric | Result | Customer bar |
|---|---:|---|
| Sample-level NG recall | **99.6%** | ≥ 95% ✅ |
| Per-image NG recall | **96.08%** | ≥ 95% ✅ |
| Overall accuracy | **99.56%** | ≥ 95% ✅ |
| False-alarm rate | **0.146%** (~1.5 per 1,000 images) | — |

The single missed sample (1 of 2,060) carried an operator label outside the 14 trained classes — structurally undetectable by construction. Metrics were computed directly from the archived `model_detections`, with no re-inference.

### Blind review — auditing the ground truth itself

Operators label with the model's boxes already on screen, so their verdicts anchor to the model. All 64 model–operator disagreements were blind re-reviewed (without the model's output visible), validated by a 24/24 control group of originally-agreeing samples reproducing perfectly. Result: **the model was right in 44% of disagreements** — 24 recorded "misses" were operator over-labels, and 4 recorded "false alarms" were real defects the model caught first. Blind adjudication moved per-image NG recall from 92.5% to 96.1% and precision from 97.6% to 98.2% — the anchored labels had been *underestimating* the model.

---

## 🚀 Running and Deployment

### Requirements

- **Line side**: Windows 10/11, Basler camera + pylon runtime (or emulation mode), Python 3.12 via `uv`
- **Training side**: GCP Linux GPU instances (2× A100), PyTorch cu128

### Commands

```bash
# Production app
uv run main.py

# Rebuild the TensorRT engine on a new machine (engines are machine-specific)
python build_engine.py app_folder/weights/<model>.pt

# Fine-tune / evaluate
python train.py
python evaluate_model.py --from <date>   # production-metric report
python eval_image_level.py               # frozen-test image-level metric
```

> **TensorRT engines are machine-specific**: `.engine` files are compiled for the exact GPU + TensorRT version that built them. `build_engine.py` exists because Ultralytics' own `export(format='engine')` path fails on TensorRT 11 (the removed `EXPLICIT_BATCH` flag) — it exports ONNX, builds the engine through the TensorRT Python API, and prepends the metadata header Ultralytics expects.

---

## 📁 Project Structure

```
SZ_Crimping/
├── main.py                # Tk root: login → inspection switching
├── config.py              # Central config: model path, thresholds, classes, camera
├── build_engine.py        # ONNX → TensorRT 11 engine builder
├── train.py               # Reproducible fine-tuning
├── evaluate_model.py      # Production-metric evaluation (operator GT vs model)
├── eval_image_level.py    # Frozen-test image-level metric
├── gradcam_eval.py        # GradCAM attention audit
├── occlusion_eval.py      # Occlusion sensitivity tests
├── core/
│   ├── camera.py          # CameraManager — pypylon capture thread
│   ├── inference.py       # InferenceManager — threads, tri-state verdict
│   └── database.py        # DatabaseManager — per-sample JSON records
├── ui/
│   ├── login.py           # Login screen
│   ├── inspection.py      # Main screen: live / frozen / preview
│   └── components.py      # MultiSelectPanel label grid
└── app_folder/
    ├── weights/           # .pt / .onnx / .engine
    ├── classes/           # Class-name files (CN / CH / EN)
    └── camera_config.pfs  # Basler camera parameters
```

---

## 📊 Performance Metrics

| Metric | Value | Conditions |
|--------|-------|------------|
| **Sample-level NG recall (acceptance)** | 99.6% | 2,060 samples — the only miss is an out-of-taxonomy label; customer bar ≥95% |
| **Per-image NG recall (acceptance)** | 96.1% | 8,224 production images, collected after the training cutoff |
| **Overall accuracy (acceptance)** | 99.56% | Same run; false-alarm rate 0.146% (~1.5 per 1,000 images) |
| **Frozen-test NG recall** | 59.1% → 84.3% | 1,008 images, baseline vs fine-tuned |
| **OK-box quality (mAP50-95)** | 0.58 → 0.99 | After fixing the label–architecture mismatch |
| **Core-wire-bent-back recall** | 3.8% → 97% | The hardest class; AP50 0.95 on val, deployed model |
| **Overall mAP@0.5 (val)** | 0.96 | 14 classes, 332-image val set, deployed 20260728 model |
| **Training data** | 2,649 images | 1280 px, GCP 2× A100 |

> Sample-level recall runs well above image-level (99.6% vs 96.1% on the acceptance run; 64.8% vs 35.6% at baseline) because a defect only needs to be caught in one of the multiple shots per sample — multi-shot inspection is the cheapest recall boost available, is built into the workflow, and is the direct evidence for not reducing shots per sample.

---

## 🗺️ Roadmap

### ✅ Completed

- [x] Tkinter line workstation: live / frozen / preview, label grid, relabeling, undo
- [x] Per-sample JSON records — model detections + operator verdicts side by side
- [x] Production-metric evaluation tooling and frozen test set
- [x] Data pipeline rebuild: leakage-free splits, oversampling, legacy-set merge
- [x] Label–architecture mismatch fix (OK-box capping)
- [x] 1280 px fine-tune — deployed with TensorRT engine
- [x] Tri-state verdict (NG / OK / needs-review) in the production app
- [x] GradCAM + occlusion interpretability audits
- [x] **Production acceptance passed** — 99.6% sample-level NG recall on 8,224 images / 2,060 samples vs the customer's ≥95% requirement
- [x] Blind review of all model–operator disagreements — anchoring-corrected metrics (the model was right in 44% of them)

### 🚧 In Progress

- [ ] Automated capture: line/fixture-triggered acquisition and verdicts, decoupling takt time from manual key-presses — operators handle only NG and needs-review parts

### 📋 Planned

- [ ] Extend to other wire types — the capture → label → convert → fine-tune → frozen-set regression pipeline is reusable as-is
- [ ] Strengthen weak classes: waterproof plug defect (73.4%), terminal humped (50%), outer mold misalignment (50%), core wire yellowish (75%)
- [ ] Periodic frozen-set regression plus blind review after every model update

---

## 🛠️ Key Design Decisions

### Measure on the line, not on the handover sheet
The app records the model's detections and the operator's verdict for every single inspection. The baseline model's real recall (35.6%) was invisible in its training metrics — it only surfaced because production data doubled as an evaluation set from day one.

### Match the labels to the architecture
The most valuable fix cost no new data: the OK box simply exceeded what YOLO-OBB's box regression can express (DFL `reg_max` × stride). Recognizing an *architecture-imposed* label constraint turned an apparently noisy model into a well-behaved one (mAP50-95 0.58 → 0.95).

### Silence is not safety
"No box at all" was measured to be 9× more dangerous than a confident OK verdict. Rather than mapping silence to OK, the app escalates it as a third verdict state with an operator prompt — a policy change worth more than several points of model accuracy.

### Exclude ambiguity, don't hide it
Images with unresolvable labels are excluded from training entirely. Deleting just the box would leave the defect visible in a "background" image — actively teaching the model to ignore it.

### Audit the model *and* the ground truth
GradCAM and occlusion tests verify the model attends to the defect region, and blind-relabel rounds check the operators' consistency — both sides of the metric are validated, not just the model.

---

## 📄 Notice

This is an internal production-line project. The source code is confidential and not publicly released. Performance figures are measured on the production line; screenshots and demo video show the system running on real production samples.

---

## 📧 Contact

- **Author**: Lynn Yan
- **Email**: yanxue6886@163.com
- **Blog**: [CSDN](https://blog.csdn.net/weixin_45560266)

---

<p align="center">
  <sub>Built with ❤️ for Production-Line AI Inspection</sub>
</p>
