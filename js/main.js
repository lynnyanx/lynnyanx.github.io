/**
 * 主逻辑模块
 * 初始化应用和处理交互
 * 需求: 7.1, 7.2, 2.2, 3.2
 */

// 示例数据 - 需求 1.1, 1.2, 1.3
const personalInfo = {
  name: { zh: '严雪', en: 'Lynn Yan' },
  title: { zh: '机器视觉算法工程师', en: 'Machine Vision Algorithm Engineer' },
  avatar: 'assets/images/avatar.png',
  bio: { 
    zh: '拥有 3 年+ 机器视觉与工业物联网实战经验，具备"算法研发(Python) + 工程落地(C#) + 边缘部署(C++)"的完整技术闭环能力。精通 SOTA 视觉模型（PatchCore、YOLO）及 2.5D 视觉技术，擅长通过模型量化及 ONNX Runtime 技术解决工业现场落地痛点。', 
    en: 'Over 3 years of experience in machine vision and industrial IoT. Full-stack capabilities spanning algorithm R&D (Python), engineering deployment (C#), and edge deployment (C++). Expert in SOTA vision models (PatchCore, YOLO) and 2.5D vision technology, specializing in industrial deployment optimization via ONNX Runtime.' 
  },
  email: 'yanxue6886@163.com',
  social: {
    github: 'https://github.com/lynnyanx',
    linkedin: 'https://blog.csdn.net/weixin_45560266',
    twitter: ''
  }
};

// 技能数据 - 按类别分组 - 需求 2.1, 2.2
// 真实技能数据
const skills = [
  // 核心语言
  { name: 'Python', category: 'backend', level: 5 },
  { name: 'C# (.NET 8)', category: 'backend', level: 4 },
  { name: 'C++', category: 'backend', level: 4 },
  { name: 'Cython', category: 'backend', level: 4 },
  { name: 'LabVIEW', category: 'tools', level: 3 },
  // 机器视觉
  { name: '2.5D 视觉 (PMD/PS)', category: 'frontend', level: 5 },
  { name: 'Halcon', category: 'frontend', level: 4 },
  { name: 'OpenCV', category: 'frontend', level: 4 },
  { name: 'PatchCore', category: 'frontend', level: 5 },
  { name: 'YOLOv8/v11', category: 'frontend', level: 4 },
  // 架构与工程
  { name: 'WPF/MVVM', category: 'backend', level: 4 },
  { name: 'Clean Architecture', category: 'backend', level: 4 },
  { name: 'DDD', category: 'backend', level: 3 },
  { name: 'FastAPI', category: 'backend', level: 4 },
  { name: 'Vue.js', category: 'frontend', level: 3 },
  // AI 部署
  { name: 'PyTorch', category: 'tools', level: 4 },
  { name: 'ONNX Runtime', category: 'tools', level: 5 },
  { name: 'vLLM', category: 'tools', level: 4 },
  { name: 'Docker', category: 'tools', level: 4 },
  { name: 'LLM 量化 (GPTQ)', category: 'tools', level: 4 },
  // 系统与运维
  { name: 'Linux', category: 'tools', level: 3 },
  { name: 'MySQL', category: 'tools', level: 3 },
  { name: 'Redis', category: 'tools', level: 3 },
  { name: 'Git', category: 'tools', level: 4 }
];

/**
 * 项目类型枚举
 * 需求 3.5: 项目类型标签
 * @typedef {'ai-vision' | 'ai-llm' | 'web-iot' | 'web-platform' | 'desktop' | 'other'} ProjectType
 */

/**
 * 多媒体资源类型
 * 需求 3.6, 3.7: 多媒体资源展示
 * @typedef {Object} ProjectMedia
 * @property {string[]} [screenshots] - 截图数组
 * @property {string} [gif] - 演示 GIF 动图
 * @property {string} [architectureDiagram] - 架构图
 * @property {string} [video] - 视频链接
 */

/**
 * 项目类型标签配置
 * 需求 3.5: 不同项目类型的标签样式
 */
const projectTypeConfig = {
  'ai-vision': { 
    zh: 'AI 视觉', 
    en: 'AI Vision',
    color: 'purple'
  },
  'ai-llm': { 
    zh: 'AI 大模型', 
    en: 'AI LLM',
    color: 'purple'
  },
  'web-iot': { 
    zh: 'Web 物联网', 
    en: 'Web IoT',
    color: 'green'
  },
  'web-platform': { 
    zh: 'Web 平台', 
    en: 'Web Platform',
    color: 'green'
  },
  'desktop': { 
    zh: '桌面应用', 
    en: 'Desktop App',
    color: 'blue'
  },
  'other': { 
    zh: '其他', 
    en: 'Other',
    color: 'gray'
  }
};

/**
 * 项目资源映射配置
 * 需求 2.1, 3.1, 4.1, 5.1: 为详情页提供项目资源路径
 * @type {Object.<string, ProjectAssets>}
 */
const projectAssets = {
  'ai-vision-platform': {
    assetsPath: 'Projects/AIVison',
    readme: {
      zh: 'README_ZH.md',
      en: 'README_EN.md'
    },
    videos: [
      'Video/1.MainWindow.mp4',
      'Video/2.Single image inference.mp4',
      'Video/3.Batch inference.mp4',
      'Video/4.Object Detection.mp4',
      'Video/5.Dataset preparation.mp4',
      'Video/6.Training.mp4'
    ],
    hoverPreview: 'Video/2.Single image inference.mp4',
    screenshots: [
      'Images/main_window.PNG',
      'Images/inference_result.PNG',
      'Images/inference_result_batch.PNG',
      'Images/inference_result_yolo.PNG',
      'Images/training_dialog.PNG',
      'Images/statistics_dashboard.PNG',
      'Images/camera_preview.PNG',
      'Images/incremental_learning.PNG',
      'Images/Code.png'
    ],
    architectureDiagram: {
      type: 'pdf',
      path: 'ARCHITECTURE.pdf'
    }
  },
  'connector-insertion-inspection': {
    assetsPath: 'Projects/ConnectorInspection',
    readme: {
      zh: 'README_ZH.md',
      en: 'README_EN.md'
    },
    videos: [
      'Video/1.Production Inspection App.mp4',
      'Video/2.Sample Review Workstation.mp4'
    ],
    hoverPreview: 'Video/1.Production Inspection App.mp4',
    screenshots: [
      'Images/app_ui_inspection.jpg',
      'Images/gt_dialog.jpg',
      'Images/data_review_tool.jpg',
      'Images/roi_detection.jpg',
      'Images/crop_rectification.jpg',
      'Images/class_samples.jpg',
      'Images/feature_distribution.png',
      'Images/confusion_matrix.png',
      'Images/training_curves.png',
      'Images/augmentation_comparison.jpg'
    ],
    architectureDiagram: null
  },
  'project-management': {
    assetsPath: 'Projects/Project Management',
    readme: {
      zh: 'README_ZH.md',
      en: 'README_EN.md'
    },
    videos: [
      'Video/1.Quickly View.mp4',
      'Video/2.Project View.mp4',
      'Video/3.Task View.mp4',
      'Video/4.Report View.mp4'
    ],
    hoverPreview: 'Video/1.Quickly View.mp4',
    screenshots: [
      'Images/MainDashboard.png',
      'Images/Project.png',
      'Images/Task.png',
      'Images/Report.png'
    ],
    architectureDiagram: {
      type: 'image',
      path: 'ARCHITECTURE_EN.md'
    }
  },
  'iot-system': {
    assetsPath: 'Projects/IOTsystem',
    readme: {
      zh: 'Readme_ZH.md',
      en: 'Readme.md'
    },
    videos: [],
    screenshots: [
      'Image/Main.png',
      'Image/IOT Node Dashboard.png',
      'Image/Equipment Map.png',
      'Image/Equipment statistic.png',
      'Image/Equipment status statistic.png',
      'Image/Sample Chart.png',
      'Image/OOS web system.png'
    ],
    architectureDiagram: null
  },
  'sam3-segmentation': {
    assetsPath: 'Projects/SAM3',
    readme: null,
    videos: [
      'Sam3 -Prompt-based all-in-one segmentation large model.mp4'
    ],
    screenshots: [
      'SAM3-Web Deploy.png'
    ],
    architectureDiagram: null
  },
  '2.5d-detection': {
    assetsPath: 'Projects/2.5D Precision detection system',
    readme: null,
    videos: [],
    screenshots: [],
    architectureDiagram: null
  },
  'llm-private-cloud': {
    assetsPath: null,
    readme: null,
    videos: [],
    screenshots: [],
    architectureDiagram: null
  }
};

// 项目数据 - 需求 3.1, 3.2, 3.5, 3.6, 3.7
// 真实项目数据
const projects = [
  {
    id: 'ai-vision-platform',
    type: 'ai-vision',
    title: { 
      zh: '工业级 AI 视觉通用推理平台', 
      en: 'Industrial AI Vision Inference Platform' 
    },
    description: { 
      zh: '基于 .NET 8 (WPF) 开发的全生命周期 AI 视觉平台，集成数据标注、模型训练、ONNX 转换、自动部署到实时推理的完整 MLOps 闭环。支持无监督异常检测 (PatchCore)、目标检测 (YOLO) 及图像分类 (ResNet) 三大核心任务。', 
      en: 'A full-lifecycle AI vision platform built with .NET 8 (WPF), integrating complete MLOps pipeline from data labeling, model training, ONNX conversion, auto-deployment to real-time inference. Supports anomaly detection (PatchCore), object detection (YOLO), and image classification (ResNet).' 
    },
    thumbnail: 'Projects/AIVison/Images/main_window.PNG',
    media: {
      screenshots: [
        'Projects/AIVison/Images/main_window.PNG',
        'Projects/AIVison/Images/inference_result.PNG',
        'Projects/AIVison/Images/inference_result_batch.PNG',
        'Projects/AIVison/Images/inference_result_yolo.PNG',
        'Projects/AIVison/Images/training_dialog.PNG',
        'Projects/AIVison/Images/statistics_dashboard.PNG',
        'Projects/AIVison/Images/camera_preview.PNG',
        'Projects/AIVison/Images/incremental_learning.PNG'
      ],
      gif: '',
      architectureDiagram: ''
    },
    techStack: ['.NET 8', 'WPF', 'ONNX Runtime', 'PyTorch', 'MVVM', 'AvalonDock'],
    links: {
      demo: '',
      github: ''
    },
    highlights: {
      zh: ['MLOps 全流程自动化', '无代码训练部署', 'GPU 加速推理 <50ms', '增量学习系统', '实时统计仪表盘'],
      en: ['Full MLOps Automation', 'No-code Training', 'GPU Inference <50ms', 'Incremental Learning', 'Real-time Dashboard']
    },
    technical: {
      metrics: [
        { value: '<50ms', label: { zh: 'GPU 单帧推理延迟', en: 'GPU Inference Latency' } },
        { value: '3', label: { zh: '可插拔任务引擎', en: 'Pluggable Task Engines' } },
        { value: '100%', label: { zh: 'MLOps 流程自动化', en: 'MLOps Pipeline Automated' } },
        { value: 'Sub-pixel', label: { zh: '缺陷分割精度', en: 'Defect Segmentation' } }
      ],
      architecture: [
        {
          name: { zh: 'MLOps 流水线', en: 'MLOps Pipeline' },
          desc: {
            zh: '一键完成「数据标注 → 模型训练 → ONNX 导出 → 自动部署」全流程，零人工干预。',
            en: 'One-click pipeline covering labeling → training → ONNX export → auto deployment, with zero manual steps.'
          }
        },
        {
          name: { zh: '插件化任务引擎', en: 'Plugin Task Engine' },
          desc: {
            zh: '工厂模式构建可插拔引擎：分类 (ResNet)、目标检测 (YOLO)、异常检测 (PatchCore) 统一调度、热切换。',
            en: 'Factory-pattern pluggable engines — classification (ResNet), detection (YOLO), anomaly detection (PatchCore) — under one unified scheduler.'
          }
        },
        {
          name: { zh: '跨栈模型交付', en: 'Cross-stack Model Delivery' },
          desc: {
            zh: '以 ONNX 为统一中间格式：PyTorch 侧训练导出，C# 侧 ONNX Runtime (CUDA) 直接加载，训练与部署完全解耦。',
            en: 'ONNX as the universal interchange format: PyTorch exports, C# ONNX Runtime (CUDA) loads directly — training and deployment fully decoupled.'
          }
        },
        {
          name: { zh: 'IDE 式工作区', en: 'IDE-style Workspace' },
          desc: {
            zh: 'WPF MVVM + AvalonDock 停靠式多窗口布局，相机预览、标注、训练、统计面板自由组合。',
            en: 'WPF MVVM + AvalonDock dockable multi-window layout: camera preview, labeling, training and statistics panels freely arranged.'
          }
        },
        {
          name: { zh: '实时监控', en: 'Real-time Monitoring' },
          desc: {
            zh: 'LiveCharts 实时仪表盘，持续追踪良品率与 P95 推理延迟。',
            en: 'LiveCharts real-time dashboard tracking yield rate and P95 inference latency.'
          }
        }
      ],
      challenges: [
        {
          problem: {
            zh: '算法研发 (Python) 与产线软件 (C#) 技术栈割裂，模型交付需要人工转换、易出错。',
            en: 'Algorithm R&D (Python) and production software (C#) live in separate stacks — model handoff was manual and error-prone.'
          },
          solution: {
            zh: '以 ONNX 为统一交付格式，训练侧一键导出、推理侧直接加载，模型更新零代码改动。',
            en: 'Standardized on ONNX: one-click export on the training side, direct loading on the inference side — model updates require zero code changes.'
          }
        },
        {
          problem: {
            zh: '现场工程师没有算法背景，无法自行完成模型训练与迭代。',
            en: 'Field engineers have no ML background and could not train or iterate models themselves.'
          },
          solution: {
            zh: '全流程可视化无代码设计：标注、训练、部署均为图形化一键操作，并内置增量学习持续吸收新缺陷样本。',
            en: 'Fully visual no-code workflow — labeling, training and deployment are one-click GUI operations, with built-in incremental learning to absorb new defect samples.'
          }
        },
        {
          problem: {
            zh: '缺陷轮廓提取精度不足，边缘毛刺导致误判。',
            en: 'Coarse defect contour extraction caused false judgments at ragged edges.'
          },
          solution: {
            zh: '基于 BFS 洪水填充算法实现亚像素级缺陷区域分割，显著提升轮廓精度。',
            en: 'BFS flood-fill algorithm achieves sub-pixel defect region segmentation, sharply improving contour precision.'
          }
        },
        {
          problem: {
            zh: '推理延迟波动影响产线节拍稳定性。',
            en: 'Inference latency jitter threatened production line takt time.'
          },
          solution: {
            zh: 'ONNX Runtime CUDA 加速 + P95 延迟实时监控，单帧推理稳定在 50ms 以内。',
            en: 'ONNX Runtime CUDA acceleration plus live P95 latency monitoring keeps per-frame inference stably under 50ms.'
          }
        }
      ]
    }
  },
  {
    id: 'connector-insertion-inspection',
    type: 'ai-vision',
    title: {
      zh: '连接器端子插入 AI 检测系统',
      en: 'Connector Wire Insertion AI Inspection'
    },
    description: {
      zh: '产线级 AI 视觉检测系统，自动判定连接器线束两端端子的插入状态（正常 / 未插入 / 反插）。覆盖工件两个检测面，采用「YOLOv11n 定位 + YOLOv11n-OBB 旋转框 + 共享分类器批量推理」两阶段管线，经 TensorRT 导出部署至 Jetson Orin NX 边缘设备。单 Pin 级实测准确率 99.66%，过杀率 0.33%。',
      en: 'A production-line AI vision system that classifies the insertion status of terminals at both ends of a connector harness (OK / Not Inserted / Reversed). It covers both faces of the workpiece with a two-stage pipeline — YOLOv11n localization + YOLOv11n-OBB rotated boxes + batched inference through a shared classifier — exported to TensorRT and deployed on a Jetson Orin NX edge device. Measured per-pin accuracy 99.66% at a 0.33% false-positive rate.'
    },
    thumbnail: 'Projects/ConnectorInspection/Images/app_ui_inspection.jpg',
    media: {
      screenshots: [
        'Projects/ConnectorInspection/Images/app_ui_inspection.jpg',
        'Projects/ConnectorInspection/Images/gt_dialog.jpg',
        'Projects/ConnectorInspection/Images/data_review_tool.jpg',
        'Projects/ConnectorInspection/Images/roi_detection.jpg',
        'Projects/ConnectorInspection/Images/crop_rectification.jpg',
        'Projects/ConnectorInspection/Images/class_samples.jpg',
        'Projects/ConnectorInspection/Images/feature_distribution.png',
        'Projects/ConnectorInspection/Images/confusion_matrix.png',
        'Projects/ConnectorInspection/Images/training_curves.png',
        'Projects/ConnectorInspection/Images/augmentation_comparison.jpg'
      ],
      gif: '',
      architectureDiagram: ''
    },
    techStack: ['Python', 'YOLOv11n (Det/OBB/Cls)', 'TensorRT', 'Jetson Orin NX', 'MLflow', 'MongoDB'],
    links: {
      demo: '',
      github: ''
    },
    highlights: {
      zh: ['两阶段批量推理', '99.66% 单 Pin 准确率', '仿射矫正裁剪链路', 'Jetson 边缘部署', '人机协同兜底策略'],
      en: ['Two-stage Batch Inference', '99.66% Per-pin Accuracy', 'Affine-rectified Cropping', 'Jetson Edge Deployment', 'Human-AI Fallback']
    },
    technical: {
      metrics: [
        { value: '99.66%', label: { zh: '单 Pin 实测准确率（42,022 Pin）', en: 'Per-pin Accuracy (42,022 pins)' } },
        { value: '0.33%', label: { zh: '过杀率', en: 'False-positive Rate' } },
        { value: '3', label: { zh: '推理模型 · 两阶段管线', en: 'Models in a 2-stage Pipeline' } },
        { value: '225', label: { zh: '预估人效收益（人日）', en: 'Man-days Saved' } }
      ],
      architecture: [
        {
          name: { zh: '两阶段批量推理', en: 'Two-stage Batch Inference' },
          desc: {
            zh: 'Stage 1 定位 ROI：P1 面 YOLOv11n 出水平框（引脚孔）、P2 面 YOLOv11n-OBB 出旋转框（侧边凸块）；Stage 2 把整件全部裁剪图打包成单批送入共享 YOLOv11n-cls，一次前向判完整件；Stage 3 按 bbox 坐标把结果回映到原图渲染。',
            en: 'Stage 1 localizes ROIs — YOLOv11n horizontal boxes (pin holes) on P1, YOLOv11n-OBB rotated boxes (side bumps) on P2. Stage 2 packs every crop from the part into a single batch through the shared YOLOv11n-cls, judging the whole part in one forward pass. Stage 3 remaps results onto the original image via bbox coordinates.'
          }
        },
        {
          name: { zh: '几何矫正裁剪', en: 'Geometric Crop Rectification' },
          desc: {
            zh: '最小二乘直线拟合 → arctan2 求角 → 仿射矫正透视变换，把旋转工件上的每个端子裁剪图转正，再以 letterbox resize 统一尺寸。',
            en: 'Least-squares line fitting → arctan2 for the angle → affine rectification, de-rotating every terminal crop off a tilted workpiece, then letterbox resize for consistent dimensions.'
          }
        },
        {
          name: { zh: '边缘部署', en: 'Edge Deployment' },
          desc: {
            zh: '训练权重导出 TensorRT engine（含 DLA 变体）部署至 Jetson Orin NX 16GB；Tkinter 桌面应用经 PyInstaller 打包为单机程序，对接 3 台 Basler 工业相机（pypylon，原图 4508×4096 / 2448×2048），支持实机 / 模拟 / 静态图三种运行模式。',
            en: 'Trained weights are exported to TensorRT engines (including DLA variants) for a Jetson Orin NX 16GB; a Tkinter desktop app is packaged standalone with PyInstaller, driving three Basler cameras via pypylon (raw 4508×4096 / 2448×2048) with live / simulated / static-image run modes.'
          }
        },
        {
          name: { zh: '可复现训练', en: 'Reproducible Training' },
          desc: {
            zh: '每次训练自动将 git commit hash 与 DVC 数据集 MD5 记录到 MLflow，运行名带时间戳，任何一次实验都能回溯到确切的代码与数据版本。',
            en: 'Every run logs its git commit hash and DVC dataset MD5 to MLflow under a timestamped run name, so any experiment traces back to an exact code and data version.'
          }
        },
        {
          name: { zh: '数据回流闭环', en: 'Data Feedback Loop' },
          desc: {
            zh: 'MongoDB 记录每次检测（本地 log_cache.json 兜底 + 后台同步线程）；产线人员可在 UI 上按 Pin 逐个修正判定（整件 24 Pin 一屏可改），并配套自研样本审查与一键改标工作站 —— AI 预推理结果与原图联动、Pin 级矩阵点击改标、快捷键丢弃模糊难分图，误判样本直接回流下一轮训练。',
            en: 'MongoDB logs every inspection (with a local log_cache.json fallback and background sync thread); operators correct verdicts pin by pin in the UI (all 24 pins on one screen), backed by a purpose-built review workstation — AI pre-inference overlaid on the original image, click-to-relabel pin matrix, and shortcut keys to discard ambiguous frames — feeding misjudged samples straight into the next training round.'
          }
        }
      ],
      challenges: [
        {
          problem: {
            zh: '交接来的数据集从根上不可用：15,372 张训练图仅来自 15+ 个实物样本，单样本重复拍摄 16 次以上，模型严重过拟合，模糊图被误判为「反插」。',
            en: 'The inherited dataset was unusable at its root: 15,372 training images came from only 15+ physical samples, each shot 16+ times. The model overfit badly and misclassified blurred images as "Reversed".'
          },
          solution: {
            zh: '实测优先于交接材料上的指标 —— 接手八天内推翻重来：重新采集 4,968 张真实图像，全量清洗数据集并复核每一条标签，再配合模糊增强提升鲁棒性。',
            en: 'Measured results outrank the numbers on the handover sheet — overturned within eight days: collected 4,968 new real images, cleaned the entire dataset, re-reviewed every label, and added blur augmentation for robustness.'
          }
        },
        {
          problem: {
            zh: '过度数据增强产生大量失真样本，混淆矩阵显示类间边界被污染，「未插入」与「反插」两类互相串扰。',
            en: 'Over-augmentation produced many distorted images; the confusion matrix showed contaminated class boundaries, with Not Inserted and Reversed bleeding into each other.'
          },
          solution: {
            zh: '收紧增强策略，合并两个易混类，改用 yolo26m-cls 重训，分类 top-1 准确率提升至 0.991，P1 面 F1-Score 接近 100%。',
            en: 'Tightened the augmentation strategy, merged the two confusable classes and retrained on yolo26m-cls, lifting classifier top-1 accuracy to 0.991 with P1-face F1 approaching 100%.'
          }
        },
        {
          problem: {
            zh: '反插类准确率偏低，排查发现模型在 P1 面学到的是背景特征，没有聚焦到金属端子头本身。',
            en: 'Reversed-class accuracy lagged; investigation showed the model had learned P1-face background features instead of focusing on the metal terminal head itself.'
          },
          solution: {
            zh: '冻结 backbone 微调 + 硬样本过采样（复制 20~30 倍），并用 UMAP 特征分布定位出 105 个边缘样本做定向清理与补采。',
            en: 'Frozen-backbone fine-tuning plus hard-sample oversampling (duplicated 20–30×), using UMAP feature distributions to pinpoint 105 borderline samples for targeted cleanup and re-collection.'
          }
        },
        {
          problem: {
            zh: '部分边缘样本（如端子轻微松动）连人工复检都无法确认，任何纯自动方案都会在这里失效。',
            en: 'Some borderline parts (e.g. a slightly loose terminal) cannot be resolved even by manual re-inspection — any fully automatic scheme fails there.'
          },
          solution: {
            zh: '改为人机协同：AI 负责过滤良品，边缘件转人工复检；判定策略上优先保证不漏检、接受一定过杀，让检验员把精力从全检转向缺陷确认。',
            en: 'Shifted to human-AI collaboration: AI filters the good parts and routes borderline ones to manual re-inspection, with a policy that prioritizes never missing a defect over avoiding over-kill — moving inspectors from full inspection to defect confirmation.'
          }
        }
      ]
    }
  },
  {
    id: 'project-management',
    type: 'web-platform',
    title: { 
      zh: 'ProjectFlow 项目管理系统', 
      en: 'ProjectFlow Management System' 
    },
    description: { 
      zh: '基于 FastAPI + Vue 3 + PostgreSQL 构建的现代化全栈项目管理系统。支持项目全生命周期管理、任务分配追踪、日报管理、实时通知及 MinIO 文件存储。', 
      en: 'A modern full-stack project management system built with FastAPI + Vue 3 + PostgreSQL. Features project lifecycle management, task tracking, daily reports, real-time notifications, and MinIO file storage.' 
    },
    thumbnail: 'Projects/Project Management/Images/MainDashboard.png',
    media: {
      screenshots: [
        'Projects/Project Management/Images/MainDashboard.png',
        'Projects/Project Management/Images/Project.png',
        'Projects/Project Management/Images/Task.png',
        'Projects/Project Management/Images/Report.png'
      ],
      gif: '',
      architectureDiagram: ''
    },
    techStack: ['FastAPI', 'Vue 3', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'MinIO'],
    links: {
      demo: '',
      github: ''
    },
    highlights: {
      zh: ['智能仪表盘', 'JWT 安全认证', '实时消息推送', 'PDF 导出', 'Docker 部署'],
      en: ['Smart Dashboard', 'JWT Authentication', 'Real-time Notifications', 'PDF Export', 'Docker Deploy']
    },
    technical: {
      metrics: [
        { value: '4', label: { zh: '核心业务模块', en: 'Core Business Modules' } },
        { value: '100%', label: { zh: 'Docker 容器化交付', en: 'Containerized Delivery' } },
        { value: 'JWT', label: { zh: '无状态安全认证', en: 'Stateless Authentication' } },
        { value: 'REST', label: { zh: '标准化 API 设计', en: 'Standardized API Design' } }
      ],
      architecture: [
        {
          name: { zh: '异步后端', en: 'Async Backend' },
          desc: {
            zh: 'FastAPI 异步框架 + SQLAlchemy ORM + PostgreSQL，Pydantic 模型对所有请求做严格数据校验。',
            en: 'FastAPI async framework + SQLAlchemy ORM + PostgreSQL, with strict Pydantic validation on every request.'
          }
        },
        {
          name: { zh: '组件化前端', en: 'Component Frontend' },
          desc: {
            zh: 'Vue 3 Composition API 组织业务逻辑，Tailwind CSS 构建响应式管理界面。',
            en: 'Vue 3 Composition API for business logic, Tailwind CSS for the responsive management UI.'
          }
        },
        {
          name: { zh: '对象存储', en: 'Object Storage' },
          desc: {
            zh: 'MinIO 统一管理项目附件与报表文件，与业务数据库解耦。',
            en: 'MinIO manages project attachments and report files, decoupled from the business database.'
          }
        },
        {
          name: { zh: '一键部署', en: 'One-command Deploy' },
          desc: {
            zh: 'Docker Compose 编排前端、后端、PostgreSQL 与 MinIO，一条命令拉起完整环境。',
            en: 'Docker Compose orchestrates frontend, backend, PostgreSQL and MinIO — the full stack comes up with a single command.'
          }
        }
      ],
      challenges: [
        {
          problem: {
            zh: '多角色协作场景下，权限边界容易混乱、越权操作难防范。',
            en: 'With multiple collaborating roles, permission boundaries blur and unauthorized operations are hard to prevent.'
          },
          solution: {
            zh: 'JWT 认证 + 基于角色的访问控制 (RBAC)，接口级权限校验，前后端双重拦截。',
            en: 'JWT authentication + role-based access control with per-endpoint checks, enforced on both frontend and backend.'
          }
        },
        {
          problem: {
            zh: '任务分配与状态变更无法及时触达相关成员，信息滞后。',
            en: 'Task assignments and status changes did not reach members promptly, causing information lag.'
          },
          solution: {
            zh: '站内实时消息通知中心：任务分配、状态变更、日报提交即时推送给相关人。',
            en: 'Real-time in-app notification center pushes task assignments, status changes and report submissions to the right people instantly.'
          }
        },
        {
          problem: {
            zh: '管理层缺乏项目全景视图，进度汇报依赖人工整理。',
            en: 'Management lacked a portfolio-level view; progress reporting relied on manual compilation.'
          },
          solution: {
            zh: '聚合统计仪表盘 + 日报体系 + PDF 报表导出，项目健康度一屏可见。',
            en: 'Aggregated dashboard + daily-report system + PDF export puts project health on a single screen.'
          }
        }
      ]
    }
  },
  {
    id: 'iot-system',
    type: 'web-iot',
    title: { 
      zh: 'Climate Chamber 物联网监控系统', 
      en: 'Climate Chamber IoT Monitoring System' 
    },
    description: { 
      zh: '基于 Grafana 构建的工业物联网云监控系统，实现 100+ 节点设备的实时数据采集与可视化监控。采用 Mesh 组网与串口多线程并发技术，支持设备状态追踪与统计分析。', 
      en: 'An industrial IoT cloud monitoring system built with Grafana, enabling real-time data collection and visualization for 100+ device nodes. Features Mesh networking and multi-threaded serial communication.' 
    },
    thumbnail: 'Projects/IOTsystem/Image/Main.png',
    media: {
      screenshots: [
        'Projects/IOTsystem/Image/Main.png',
        'Projects/IOTsystem/Image/IOT Node Dashboard.png',
        'Projects/IOTsystem/Image/Equipment Map.png',
        'Projects/IOTsystem/Image/Equipment statistic.png',
        'Projects/IOTsystem/Image/Equipment status statistic.png',
        'Projects/IOTsystem/Image/Sample Chart.png'
      ],
      gif: '',
      architectureDiagram: ''
    },
    techStack: ['Flask', 'Vue.js', 'Grafana', 'MySQL', 'Docker', 'Redis'],
    links: {
      demo: '',
      github: ''
    },
    highlights: {
      zh: ['100+ 设备节点', 'Mesh 组网', '实时数据采集', 'Grafana 可视化', '设备状态追踪'],
      en: ['100+ Device Nodes', 'Mesh Networking', 'Real-time Collection', 'Grafana Visualization', 'Status Tracking']
    },
    technical: {
      metrics: [
        { value: '100+', label: { zh: '实时接入设备节点', en: 'Live Device Nodes' } },
        { value: '24/7', label: { zh: '不间断数据采集', en: 'Continuous Collection' } },
        { value: 'Mesh', label: { zh: '自组网拓扑', en: 'Self-organizing Topology' } },
        { value: 'Grafana', label: { zh: '专业级可视化', en: 'Pro-grade Visualization' } }
      ],
      architecture: [
        {
          name: { zh: '采集层', en: 'Collection Layer' },
          desc: {
            zh: '串口多线程并发 + Mesh 组网，100+ 设备节点稳定接入，通道相互隔离。',
            en: 'Multi-threaded serial concurrency + Mesh networking connect 100+ device nodes stably, with isolated channels.'
          }
        },
        {
          name: { zh: '服务层', en: 'Service Layer' },
          desc: {
            zh: 'Flask REST API 提供数据服务，MySQL 持久化历史数据，Redis 缓存热点状态。',
            en: 'Flask REST API for data services, MySQL for historical persistence, Redis for hot-state caching.'
          }
        },
        {
          name: { zh: '可视化层', en: 'Visualization Layer' },
          desc: {
            zh: 'Grafana 仪表盘体系：设备地图、状态统计、历史趋势图表，多维度实时监控。',
            en: 'Grafana dashboard suite — device map, status statistics and historical trends for multi-dimensional live monitoring.'
          }
        },
        {
          name: { zh: '部署层', en: 'Deployment Layer' },
          desc: {
            zh: 'Docker 容器化交付，工厂内网私有化部署，数据不出厂。',
            en: 'Dockerized delivery, deployed on the factory intranet — data never leaves the plant.'
          }
        }
      ],
      challenges: [
        {
          problem: {
            zh: '上百节点同时上报数据，串口通信易阻塞、丢包。',
            en: 'With 100+ nodes reporting simultaneously, serial communication was prone to blocking and packet loss.'
          },
          solution: {
            zh: '多线程并发采集 + Mesh 自组网拓扑，各通道相互隔离，单点故障不影响整体链路。',
            en: 'Multi-threaded concurrent collection + Mesh self-organizing topology isolate channels so a single failure never takes down the pipeline.'
          }
        },
        {
          problem: {
            zh: '设备故障发现滞后，依赖人工巡检。',
            en: 'Equipment failures were discovered late, relying on manual inspection rounds.'
          },
          solution: {
            zh: '设备状态全生命周期追踪与统计分析，异常状态在仪表盘可视化预警。',
            en: 'Full-lifecycle device status tracking and statistics, with anomalies surfaced visually on the dashboards.'
          }
        },
        {
          problem: {
            zh: '自研可视化界面开发成本高、周期长。',
            en: 'Building custom visualization UIs in-house was slow and expensive.'
          },
          solution: {
            zh: '复用 Grafana 生态快速搭建专业级监控面板，研发精力聚焦数据采集链路本身。',
            en: 'Leveraged the Grafana ecosystem for professional dashboards, focusing engineering effort on the data pipeline itself.'
          }
        }
      ]
    }
  },
  {
    id: 'sam3-segmentation',
    type: 'ai-llm',
    title: { 
      zh: 'SAM3 提示词驱动全能分割大模型', 
      en: 'SAM3 Prompt-based All-in-one Segmentation Model' 
    },
    description: { 
      zh: '基于 Segment Anything Model 3 的 Web 部署方案，支持点击、框选、文本提示等多种交互方式进行图像分割。实现了大模型在工业视觉场景的快速落地应用。', 
      en: 'A web deployment solution based on Segment Anything Model 3, supporting multiple interaction modes including click, box selection, and text prompts for image segmentation. Enables rapid deployment of large models in industrial vision scenarios.' 
    },
    thumbnail: 'Projects/SAM3/SAM3-Web Deploy.png',
    media: {
      screenshots: [
        'Projects/SAM3/SAM3-Web Deploy.png'
      ],
      gif: '',
      architectureDiagram: ''
    },
    techStack: ['PyTorch', 'SAM3', 'FastAPI', 'Docker', 'CUDA', 'Web UI'],
    links: {
      demo: '',
      github: ''
    },
    highlights: {
      zh: ['多模式交互', '零样本分割', 'Web 部署', '实时推理', '工业级应用'],
      en: ['Multi-mode Interaction', 'Zero-shot Segmentation', 'Web Deploy', 'Real-time Inference', 'Industrial Application']
    },
    technical: {
      metrics: [
        { value: '3', label: { zh: '交互提示模式', en: 'Prompt Modes' } },
        { value: '0-shot', label: { zh: '免训练分割', en: 'Training-free Segmentation' } },
        { value: '1', label: { zh: '次编码·多次分割', en: 'Encode Once, Prompt Many' } },
        { value: 'Web', label: { zh: '浏览器即开即用', en: 'Runs in the Browser' } }
      ],
      architecture: [
        {
          name: { zh: '推理服务', en: 'Inference Service' },
          desc: {
            zh: 'PyTorch 加载 SAM3 大模型，FastAPI 封装为 REST 推理接口，前后端彻底分离。',
            en: 'SAM3 loaded via PyTorch and wrapped as a FastAPI REST inference service, fully decoupled from the frontend.'
          }
        },
        {
          name: { zh: '交互前端', en: 'Interactive Frontend' },
          desc: {
            zh: 'Web UI 支持点击、框选、文本提示三种分割方式，分割结果实时叠加显示。',
            en: 'Web UI supports click, box and text prompts, overlaying segmentation results in real time.'
          }
        },
        {
          name: { zh: 'GPU 部署', en: 'GPU Deployment' },
          desc: {
            zh: 'Docker + CUDA 容器化 GPU 服务，环境一致、开箱即用。',
            en: 'Docker + CUDA containerized GPU service — consistent environments, ready out of the box.'
          }
        }
      ],
      challenges: [
        {
          problem: {
            zh: '工业新品类频繁出现、缺陷样本积累慢，传统「采数据→标注→训练」模式跟不上节奏。',
            en: 'New industrial part types appear constantly and defect samples accumulate slowly — the traditional collect→label→train loop cannot keep up.'
          },
          solution: {
            zh: '提示词驱动的零样本分割：新对象无需任何训练，点击或一句描述即可分割。',
            en: 'Prompt-driven zero-shot segmentation: new objects need no training at all — a click or a phrase is enough.'
          }
        },
        {
          problem: {
            zh: '大模型单次推理成本高，交互式使用体验卡顿。',
            en: 'Large-model inference is expensive per call, making interactive use sluggish.'
          },
          solution: {
            zh: '利用 SAM 架构特性：图像特征一次编码缓存，后续提示复用同一 embedding，交互响应接近实时。',
            en: "Exploits the SAM architecture: image features are encoded once and cached, so subsequent prompts reuse the embedding for near-real-time interaction."
          }
        },
        {
          problem: {
            zh: '算法能力难以触达产线上的非技术用户。',
            en: 'Algorithm capabilities were out of reach for non-technical users on the line.'
          },
          solution: {
            zh: 'Web 端交互界面，浏览器打开即用，无需安装任何客户端或配置环境。',
            en: 'A web interface that works straight from the browser — no client installation, no environment setup.'
          }
        }
      ]
    }
  },
  {
    id: '2.5d-detection',
    type: 'ai-vision',
    title: { 
      zh: '2.5D 多模式精密检测系统', 
      en: '2.5D Multi-mode Precision Detection System' 
    },
    description: { 
      zh: '基于 PMD 相位偏折与光度立体技术的 2.5D 视觉检测系统，有效解决微小形变与高反光表面的检测难题。通过 Cython + OpenMP 并行优化，将处理耗时从 4s 压缩至 40ms。', 
      en: 'A 2.5D vision detection system based on PMD phase deflection and photometric stereo technology, effectively solving detection challenges for micro-deformation and highly reflective surfaces. Processing time reduced from 4s to 40ms via Cython + OpenMP optimization.' 
    },
    thumbnail: '',
    media: {
      screenshots: [],
      gif: '',
      architectureDiagram: ''
    },
    techStack: ['C#', 'C++', 'Python', 'Cython', 'OpenMP', 'Halcon'],
    links: {
      demo: '',
      github: ''
    },
    highlights: {
      zh: ['PMD 相位偏折', '光度立体算法', '性能提升 100x', 'Clean Architecture', '硬件抽象层'],
      en: ['PMD Phase Deflection', 'Photometric Stereo', '100x Performance', 'Clean Architecture', 'Hardware Abstraction']
    },
    technical: {
      metrics: [
        { value: '100x', label: { zh: '处理性能提升', en: 'Processing Speedup' } },
        { value: '40ms', label: { zh: '单件处理耗时（原 4s）', en: 'Per-part Time (was 4s)' } },
        { value: '6', label: { zh: '通道数据融合', en: 'Fused Data Channels' } },
        { value: '2.5D', label: { zh: '低成本替代 3D 线扫', en: 'Low-cost 3D Alternative' } }
      ],
      architecture: [
        {
          name: { zh: '成像层', en: 'Imaging Layer' },
          desc: {
            zh: 'PMD 相位偏折 + 光度立体 (PS) 双模式成像，多光源时序采集原始图像序列。',
            en: 'Dual-mode imaging — PMD phase deflection + photometric stereo — with multi-light sequential capture.'
          }
        },
        {
          name: { zh: '算法层', en: 'Algorithm Layer' },
          desc: {
            zh: '重构法线图、高度图、曲率图等 6 通道表面数据，多通道融合放大微小形变特征。',
            en: 'Reconstructs 6 channels of surface data (normal, height, curvature maps), fusing them to amplify micro-deformation features.'
          }
        },
        {
          name: { zh: '性能层', en: 'Performance Layer' },
          desc: {
            zh: 'Python 算法原型 → Cython 静态编译 + OpenMP 多核并行，热点循环以 C 速度执行。',
            en: 'Python prototypes compiled with Cython + OpenMP parallelism — hot loops run at C speed across all cores.'
          }
        },
        {
          name: { zh: '软件架构', en: 'Software Architecture' },
          desc: {
            zh: 'C# Clean Architecture + HAL 硬件抽象层，相机与光源硬件可替换，业务逻辑零改动。',
            en: 'C# Clean Architecture with a hardware abstraction layer — cameras and light sources are swappable with zero business-logic changes.'
          }
        }
      ],
      challenges: [
        {
          problem: {
            zh: '高反光表面在 2D 成像下过曝、特征丢失，传统视觉方案失效。',
            en: 'Highly reflective surfaces blow out in 2D imaging and lose all features — conventional vision fails outright.'
          },
          solution: {
            zh: 'PMD 相位偏折技术通过条纹相位变化对镜面级反光表面成像，反光越强信号越清晰。',
            en: 'PMD phase deflection images mirror-like surfaces through fringe phase shifts — the stronger the reflection, the clearer the signal.'
          }
        },
        {
          problem: {
            zh: '微小形变在灰度图中几乎不可见，人工目检漏检率高。',
            en: 'Micro-deformations are nearly invisible in grayscale images; manual inspection missed them frequently.'
          },
          solution: {
            zh: '光度立体重构表面法线与曲率，将几何形变放大为高对比度的可检测信号。',
            en: 'Photometric stereo reconstructs surface normals and curvature, amplifying geometric deviations into high-contrast, detectable signals.'
          }
        },
        {
          problem: {
            zh: 'Python 算法单件处理 4 秒，完全无法满足产线节拍。',
            en: 'The Python algorithm took 4 seconds per part — far too slow for production takt time.'
          },
          solution: {
            zh: 'Cython 静态编译 + OpenMP 多核并行优化，单件耗时压缩至 40ms，性能提升 100 倍。',
            en: 'Cython static compilation + OpenMP parallelization cut per-part time to 40ms — a 100x speedup.'
          }
        },
        {
          problem: {
            zh: '3D 线扫方案精度高但成本高昂，难以大规模推广。',
            en: '3D line-scan systems are accurate but too expensive to deploy at scale.'
          },
          solution: {
            zh: '2.5D 多模式方案以面阵相机与可控光源组合实现低成本替代，覆盖同类检测需求。',
            en: 'The 2.5D multi-mode approach combines area-scan cameras with controlled lighting as a low-cost alternative covering the same inspection needs.'
          }
        }
      ]
    }
  },
  {
    id: 'llm-private-cloud',
    type: 'ai-llm',
    title: { 
      zh: '大语言模型私有化部署架构', 
      en: 'LLM Private Cloud Architecture' 
    },
    description: { 
      zh: '基于消费级硬件 (RTX 50-Series) 构建的高吞吐、低延迟本地大模型推理集群。采用 WSL2 + Docker + vLLM 架构，通过 GPTQ 4-bit 量化部署 Qwen2.5-14B 模型，推理吞吐量提升 10 倍以上。', 
      en: 'A high-throughput, low-latency local LLM inference cluster built on consumer hardware (RTX 50-Series). Uses WSL2 + Docker + vLLM architecture with GPTQ 4-bit quantization for Qwen2.5-14B, achieving 10x+ inference throughput improvement.' 
    },
    thumbnail: '',
    media: {
      screenshots: [],
      gif: '',
      architectureDiagram: ''
    },
    techStack: ['vLLM', 'Docker', 'WSL2', 'CUDA', 'GPTQ', 'Open WebUI'],
    links: {
      demo: '',
      github: ''
    },
    highlights: {
      zh: ['GPTQ 4-bit 量化', 'vLLM 推理加速', 'OpenAI 兼容 API', 'RAG 知识库', '局域网服务'],
      en: ['GPTQ 4-bit Quantization', 'vLLM Acceleration', 'OpenAI Compatible API', 'RAG Knowledge Base', 'LAN Service']
    },
    technical: {
      metrics: [
        { value: '10x+', label: { zh: '推理吞吐量提升', en: 'Throughput Gain' } },
        { value: '9GB', label: { zh: '量化后显存占用（原 28GB）', en: 'VRAM After Quantization (was 28GB)' } },
        { value: '8k+', label: { zh: '长上下文支持', en: 'Context Length' } },
        { value: '14B', label: { zh: '部署模型参数规模', en: 'Model Parameters Deployed' } }
      ],
      architecture: [
        {
          name: { zh: '推理引擎', en: 'Inference Engine' },
          desc: {
            zh: 'vLLM + PagedAttention 显存分页管理，Continuous Batching 动态批处理调度高并发请求。',
            en: 'vLLM with PagedAttention for paged KV-cache memory and continuous batching to schedule concurrent requests.'
          }
        },
        {
          name: { zh: '模型量化', en: 'Model Quantization' },
          desc: {
            zh: 'GPTQ 4-bit 量化 Qwen2.5-14B，显存占用从 28GB 压缩至 9GB，精度损失可控。',
            en: 'GPTQ 4-bit quantization of Qwen2.5-14B compresses VRAM from 28GB to 9GB with controlled accuracy loss.'
          }
        },
        {
          name: { zh: '运行时环境', en: 'Runtime Environment' },
          desc: {
            zh: 'WSL2 + Docker + CUDA 技术栈，运行于消费级 RTX 50 系显卡，无需专用服务器。',
            en: 'WSL2 + Docker + CUDA stack running on a consumer RTX 50-series GPU — no dedicated server hardware required.'
          }
        },
        {
          name: { zh: '服务层', en: 'Service Layer' },
          desc: {
            zh: 'OpenAI 兼容 API + Open WebUI 交互界面 + RAG 知识库，局域网内多人共享服务。',
            en: 'OpenAI-compatible API + Open WebUI + RAG knowledge base, shared across the LAN by multiple users.'
          }
        }
      ],
      challenges: [
        {
          problem: {
            zh: '14B 模型 FP16 权重需约 28GB 显存，远超消费级显卡容量。',
            en: 'A 14B model needs ~28GB of VRAM in FP16 — far beyond any consumer GPU.'
          },
          solution: {
            zh: 'GPTQ 4-bit 量化将显存占用压缩至 9GB，同时保留 8k+ 长上下文能力。',
            en: 'GPTQ 4-bit quantization compresses it to 9GB while preserving 8k+ context length.'
          }
        },
        {
          problem: {
            zh: 'HuggingFace 原生推理吞吐低、并发能力差，多人使用即卡顿。',
            en: 'Native HuggingFace inference has low throughput and poor concurrency — it stalled with just a few users.'
          },
          solution: {
            zh: 'vLLM Continuous Batching + PagedAttention 推理加速，吞吐量提升 10 倍以上。',
            en: 'vLLM continuous batching + PagedAttention lifted throughput by more than 10x.'
          }
        },
        {
          problem: {
            zh: '私有化部署的模型难以接入现有 AI 工具生态。',
            en: 'Privately deployed models are hard to plug into the existing AI tool ecosystem.'
          },
          solution: {
            zh: '暴露 OpenAI 兼容 API，任何支持 OpenAI 协议的客户端与框架均可无缝接入。',
            en: 'Exposing an OpenAI-compatible API lets any OpenAI-protocol client or framework connect seamlessly.'
          }
        }
      ]
    }
  }
];

/**
 * 技能分组函数
 * 需求 2.2: 按类别（如前端、后端、工具等）分组显示技能
 * @param {Array} skillList - 技能列表
 * @returns {Object} - 按类别分组的技能对象
 */
function groupSkillsByCategory(skillList) {
  const groups = {};
  
  for (const skill of skillList) {
    const category = skill.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(skill);
  }
  
  return groups;
}

/**
 * 渲染技能分组
 * 需求 2.2: 按类别分组显示技能
 */
function renderSkills() {
  const container = document.getElementById('skills-grid');
  if (!container) return;
  
  const groupedSkills = groupSkillsByCategory(skills);
  const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
  
  container.innerHTML = '';
  
  // 定义类别顺序
  const categoryOrder = ['frontend', 'backend', 'tools', 'other'];
  
  for (const category of categoryOrder) {
    const categorySkills = groupedSkills[category];
    if (!categorySkills || categorySkills.length === 0) continue;
    
    // 获取类别标签
    const categoryLabel = typeof i18n !== 'undefined' 
      ? i18n.t(`skills.${category}`) 
      : category;

    // 创建技能分组容器
    const groupDiv = document.createElement('div');
    groupDiv.className = 'skill-group';
    
    // 创建分组标题
    const titleEl = document.createElement('h3');
    titleEl.className = 'skill-group-title';
    titleEl.textContent = categoryLabel;
    titleEl.setAttribute('data-category', category);
    groupDiv.appendChild(titleEl);
    
    // 创建技能标签容器
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'skill-tags';
    
    for (const skill of categorySkills) {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = skill.name;
      tag.appendChild(nameSpan);
      if (skill.level) {
        tag.setAttribute('data-level', skill.level);
        // 熟练度圆点指示
        const levelDiv = document.createElement('span');
        levelDiv.className = 'skill-level';
        for (let i = 1; i <= 5; i++) {
          const dot = document.createElement('span');
          dot.className = 'skill-level-dot' + (i <= skill.level ? ' active' : '');
          levelDiv.appendChild(dot);
        }
        tag.appendChild(levelDiv);
      }
      tagsDiv.appendChild(tag);
    }
    
    groupDiv.appendChild(tagsDiv);
    container.appendChild(groupDiv);
  }
}

/**
 * 渲染项目卡片
 * 需求 3.2: 项目卡片包含项目名称、描述、技术栈和链接
 * 需求 3.4: 如果项目包含预览图则显示缩略图
 */
function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;
  
  const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
  
  container.innerHTML = '';
  
  for (const project of projects) {
    const card = createProjectCard(project, locale);
    container.appendChild(card);
  }
}

/**
 * 创建单个项目卡片
 * 需求 3.2: 包含项目名称、描述、技术栈和链接
 * 需求 3.4: 条件渲染缩略图
 * 需求 3.5: 显示项目类型标签
 * 需求 3.6: 支持点击查看更多媒体资源
 * 需求 1.1: 点击卡片跳转到详情页
 * @param {Object} project - 项目数据
 * @param {string} locale - 当前语言
 * @returns {HTMLElement} - 项目卡片元素
 */
function createProjectCard(project, locale) {
  const card = document.createElement('article');
  card.className = 'project-card';
  card.setAttribute('data-project-id', project.id);
  
  // 添加点击事件跳转到详情页 - 需求 1.1
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    // 如果点击的是链接或按钮，不触发卡片跳转
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    // 使用 hash 路由传递项目 ID，避免服务器重写 URL 时丢失参数
    const targetUrl = `./project.html#id=${encodeURIComponent(project.id)}`;
    console.log('Navigating to:', targetUrl);
    window.location.href = targetUrl;
  });
  
  // 条件渲染缩略图 - 需求 3.4
  if (project.thumbnail) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'project-thumbnail';
    const img = document.createElement('img');
    img.src = project.thumbnail;
    img.alt = project.title[locale] || project.title.zh;
    img.onerror = function() {
      this.parentElement.remove();
    };
    imgWrapper.appendChild(img);
    card.appendChild(imgWrapper);

    // 悬停播放演示视频预览
    const assets = projectAssets[project.id];
    if (assets && assets.assetsPath && assets.hoverPreview) {
      const badge = document.createElement('span');
      badge.className = 'video-badge';
      badge.textContent = '▶ DEMO';
      imgWrapper.appendChild(badge);

      let video = null;
      card.addEventListener('mouseenter', () => {
        if (!video) {
          video = document.createElement('video');
          video.className = 'thumb-video';
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.preload = 'none';
          video.src = encodeURI(`${assets.assetsPath}/${assets.hoverPreview}`);
          video.addEventListener('canplay', () => video.classList.add('ready'));
          video.addEventListener('error', () => video.remove());
          imgWrapper.appendChild(video);
        }
        video.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        if (video) video.pause();
      });
    }
  }
  
  // 项目内容区域
  const content = document.createElement('div');
  content.className = 'project-content';
  
  // 项目类型标签 - 需求 3.5
  if (project.type && projectTypeConfig[project.type]) {
    const typeConfig = projectTypeConfig[project.type];
    const typeTag = document.createElement('span');
    typeTag.className = `project-type-tag type-${typeConfig.color}`;
    typeTag.textContent = typeConfig[locale] || typeConfig.zh;
    content.appendChild(typeTag);
  }
  
  // 项目标题
  const title = document.createElement('h3');
  title.className = 'project-title';
  title.textContent = project.title[locale] || project.title.zh;
  content.appendChild(title);
  
  // 项目描述
  const desc = document.createElement('p');
  desc.className = 'project-description';
  desc.textContent = project.description[locale] || project.description.zh;
  content.appendChild(desc);
  
  // 技术栈标签
  if (project.techStack && project.techStack.length > 0) {
    const techDiv = document.createElement('div');
    techDiv.className = 'project-tech-stack';
    for (const tech of project.techStack) {
      const techTag = document.createElement('span');
      techTag.className = 'tech-tag';
      techTag.textContent = tech;
      techDiv.appendChild(techTag);
    }
    content.appendChild(techDiv);
  }
  
  // 项目链接
  const linksDiv = document.createElement('div');
  linksDiv.className = 'project-links';
  
  if (project.links.demo) {
    const demoLink = document.createElement('a');
    demoLink.href = project.links.demo;
    demoLink.target = '_blank';
    demoLink.rel = 'noopener noreferrer';
    demoLink.className = 'project-link demo-link';
    demoLink.textContent = typeof i18n !== 'undefined' 
      ? i18n.t('projects.viewDemo') 
      : (locale === 'zh' ? '在线演示' : 'Live Demo');
    linksDiv.appendChild(demoLink);
  }
  
  if (project.links.github) {
    const codeLink = document.createElement('a');
    codeLink.href = project.links.github;
    codeLink.target = '_blank';
    codeLink.rel = 'noopener noreferrer';
    codeLink.className = 'project-link code-link';
    codeLink.textContent = typeof i18n !== 'undefined' 
      ? i18n.t('projects.viewCode') 
      : (locale === 'zh' ? '查看源码' : 'View Code');
    linksDiv.appendChild(codeLink);
  }
  
  // 查看更多媒体按钮 - 需求 3.6
  if (hasMediaResources(project) || (project.highlights && project.highlights[locale])) {
    const mediaBtn = document.createElement('button');
    mediaBtn.className = 'project-view-media';
    mediaBtn.textContent = locale === 'zh' ? '📷 查看详情' : '📷 View Details';
    mediaBtn.onclick = (e) => {
      e.stopPropagation();
      openMediaModal(project);
    };
    linksDiv.appendChild(mediaBtn);
  }
  
  // 查看项目详情按钮 - 明确的跳转提示
  const detailBtn = document.createElement('a');
  detailBtn.href = `./project.html#id=${encodeURIComponent(project.id)}`;
  detailBtn.className = 'project-detail-link';
  detailBtn.textContent = locale === 'zh' ? '→ 查看完整项目' : '→ View Full Project';
  detailBtn.onclick = (e) => {
    e.stopPropagation();
  };
  linksDiv.appendChild(detailBtn);
  
  content.appendChild(linksDiv);
  card.appendChild(content);
  
  return card;
}

/**
 * 渲染社交媒体链接
 * 需求 1.3: 显示社交媒体链接
 */
function renderSocialLinks() {
  const container = document.getElementById('social-links');
  if (!container) return;
  
  container.innerHTML = '';
  
  const socialIcons = {
    github: '📦',
    linkedin: '💼',
    twitter: '🐦'
  };
  
  for (const [platform, url] of Object.entries(personalInfo.social)) {
    if (!url) continue;
    
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = `social-link social-${platform}`;
    link.setAttribute('aria-label', platform);
    link.textContent = socialIcons[platform] || '🔗';
    container.appendChild(link);
  }
}

/**
 * 更新页面动态内容（语言切换时调用）
 */
function updateDynamicContent() {
  const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
  
  // 更新 Hero 区域的个人信息
  const heroName = document.getElementById('hero-name');
  const heroTitle = document.getElementById('hero-title');
  const heroBio = document.getElementById('hero-bio');
  
  if (heroName) {
    heroName.textContent = personalInfo.name[locale] || personalInfo.name.zh;
  }
  // hero-title 被打字机特效接管时（effects.js），不直接覆盖文本
  if (heroTitle && !window.heroTypewriter) {
    heroTitle.textContent = personalInfo.title[locale] || personalInfo.title.zh;
  }
  if (heroBio) {
    heroBio.textContent = personalInfo.bio[locale] || personalInfo.bio.zh;
  }
  
  // 更新技能分组标题
  const skillGroupTitles = document.querySelectorAll('.skill-group-title');
  skillGroupTitles.forEach(el => {
    const category = el.getAttribute('data-category');
    if (category && typeof i18n !== 'undefined') {
      el.textContent = i18n.t(`skills.${category}`);
    }
  });
  
  // 重新渲染技能（更新分组标题）
  renderSkills();
  
  // 重新渲染项目卡片（因为标题和描述需要切换语言）
  renderProjects();
}

/**
 * 绑定语言切换按钮事件
 * 需求 7.2: 点击语言切换按钮时切换语言
 */
function bindLangToggle() {
  const langToggle = document.getElementById('lang-toggle');
  if (!langToggle) return;
  
  langToggle.addEventListener('click', async () => {
    if (typeof i18n !== 'undefined') {
      await i18n.toggleLocale();
      // 更新动态渲染的内容
      updateDynamicContent();
    }
  });
}

/**
 * 初始化应用
 * 需求 7.1: 初始化时检测语言
 */
async function initApp() {
  try {
    // 初始化 i18n 模块
    if (typeof i18n !== 'undefined') {
      await i18n.init();
    }
    
    // 绑定语言切换按钮事件
    bindLangToggle();
    
    // 渲染社交链接
    renderSocialLinks();
    
    // 渲染技能分组
    renderSkills();
    
    // 渲染项目卡片
    renderProjects();
    
    // 创建多媒体模态框
    createMediaModal();
    
    // 更新动态内容（确保初始语言正确）
    updateDynamicContent();
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

/**
 * 多媒体展示模态框管理
 * 需求 3.6, 3.7: 支持多媒体资源展示
 */
let currentCarouselIndex = 0;
let currentCarouselSlides = [];

/**
 * 创建多媒体模态框
 */
function createMediaModal() {
  // 检查是否已存在
  if (document.getElementById('media-modal')) return;
  
  const modal = document.createElement('div');
  modal.id = 'media-modal';
  modal.className = 'media-modal';
  modal.innerHTML = `
    <div class="media-modal-header">
      <h3 class="media-modal-title" id="media-modal-title"></h3>
      <button class="media-modal-close" onclick="closeMediaModal()" aria-label="关闭">×</button>
    </div>
    <div class="media-modal-content" id="media-modal-content"></div>
  `;
  document.body.appendChild(modal);
  
  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeMediaModal();
    }
  });
  
  // ESC 键关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMediaModal();
    }
  });
}

/**
 * 打开多媒体模态框
 * @param {Object} project - 项目数据
 */
function openMediaModal(project) {
  const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
  const modal = document.getElementById('media-modal');
  const titleEl = document.getElementById('media-modal-title');
  const contentEl = document.getElementById('media-modal-content');
  
  if (!modal || !contentEl) return;
  
  // 设置标题
  titleEl.textContent = project.title[locale] || project.title.zh;
  
  // 构建内容
  let contentHTML = '';
  
  // 项目亮点
  if (project.highlights && project.highlights[locale] && project.highlights[locale].length > 0) {
    contentHTML += `
      <div class="media-highlights">
        <h4 class="media-section-title">✨ ${locale === 'zh' ? '项目亮点' : 'Highlights'}</h4>
        <div class="highlights-list">
          ${project.highlights[locale].map(h => `<span class="highlight-tag">${h}</span>`).join('')}
        </div>
      </div>
    `;
  }
  
  // 截图轮播
  if (project.media && project.media.screenshots && project.media.screenshots.length > 0) {
    currentCarouselSlides = project.media.screenshots;
    currentCarouselIndex = 0;
    
    contentHTML += `
      <div class="media-carousel">
        <h4 class="media-section-title">📸 ${locale === 'zh' ? '项目截图' : 'Screenshots'}</h4>
        <div class="carousel-container">
          <div class="carousel-slides" id="carousel-slides">
            ${project.media.screenshots.map((src, i) => `
              <div class="carousel-slide">
                <img src="${src}" alt="Screenshot ${i + 1}" loading="lazy">
              </div>
            `).join('')}
          </div>
          ${project.media.screenshots.length > 1 ? `
            <button class="carousel-nav prev" onclick="prevSlide()">‹</button>
            <button class="carousel-nav next" onclick="nextSlide()">›</button>
          ` : ''}
        </div>
        ${project.media.screenshots.length > 1 ? `
          <div class="carousel-dots" id="carousel-dots">
            ${project.media.screenshots.map((_, i) => `
              <span class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
  
  // GIF 动图
  if (project.media && project.media.gif) {
    contentHTML += `
      <div class="media-gif">
        <h4 class="media-section-title">🎬 ${locale === 'zh' ? '演示动图' : 'Demo GIF'}</h4>
        <div class="media-gif-container">
          <img src="${project.media.gif}" alt="Demo GIF" loading="lazy">
        </div>
      </div>
    `;
  }
  
  // 架构图
  if (project.media && project.media.architectureDiagram) {
    contentHTML += `
      <div class="media-architecture">
        <h4 class="media-section-title">🏗️ ${locale === 'zh' ? '系统架构' : 'Architecture'}</h4>
        <div class="media-architecture-container">
          <img src="${project.media.architectureDiagram}" alt="Architecture Diagram" loading="lazy">
        </div>
      </div>
    `;
  }
  
  // 如果没有任何媒体内容
  if (!contentHTML) {
    contentHTML = `<p style="color: var(--text-light); text-align: center;">${locale === 'zh' ? '暂无更多媒体资源' : 'No media resources available'}</p>`;
  }
  
  contentEl.innerHTML = contentHTML;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * 关闭多媒体模态框
 */
function closeMediaModal() {
  const modal = document.getElementById('media-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * 轮播图导航 - 上一张
 */
function prevSlide() {
  if (currentCarouselSlides.length <= 1) return;
  currentCarouselIndex = (currentCarouselIndex - 1 + currentCarouselSlides.length) % currentCarouselSlides.length;
  updateCarousel();
}

/**
 * 轮播图导航 - 下一张
 */
function nextSlide() {
  if (currentCarouselSlides.length <= 1) return;
  currentCarouselIndex = (currentCarouselIndex + 1) % currentCarouselSlides.length;
  updateCarousel();
}

/**
 * 轮播图导航 - 跳转到指定位置
 * @param {number} index - 目标索引
 */
function goToSlide(index) {
  currentCarouselIndex = index;
  updateCarousel();
}

/**
 * 更新轮播图显示
 */
function updateCarousel() {
  const slides = document.getElementById('carousel-slides');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (slides) {
    slides.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;
  }
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentCarouselIndex);
  });
}

/**
 * 检查项目是否有多媒体资源
 * @param {Object} project - 项目数据
 * @returns {boolean}
 */
function hasMediaResources(project) {
  if (!project.media) return false;
  return (
    (project.media.screenshots && project.media.screenshots.length > 0) ||
    project.media.gif ||
    project.media.architectureDiagram
  );
}

/**
 * 获取项目资源配置
 * 需求 2.1, 3.1, 4.1, 5.1: 根据项目 ID 获取资源配置
 * @param {string} projectId - 项目 ID
 * @returns {Object|null} - 项目资源配置或 null
 */
function getProjectAssets(projectId) {
  return projectAssets[projectId] || null;
}

/**
 * 获取项目数据
 * @param {string} projectId - 项目 ID
 * @returns {Object|null} - 项目数据或 null
 */
function getProjectById(projectId) {
  return projects.find(p => p.id === projectId) || null;
}

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    personalInfo,
    skills,
    projects,
    projectAssets,
    projectTypeConfig,
    initApp,
    groupSkillsByCategory,
    renderSkills,
    renderProjects,
    createProjectCard,
    updateDynamicContent,
    hasMediaResources,
    openMediaModal,
    closeMediaModal,
    getProjectAssets,
    getProjectById
  };
}
