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
      zh: 'README_EN.md',
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
  'project-management': {
    assetsPath: 'Projects/Project Management',
    readme: {
      zh: 'README_EN.md',
      en: 'README_EN.md'
    },
    videos: [
      'Video/1.Quickly View.mp4',
      'Video/2.Project View.mp4',
      'Video/3.Task View.mp4',
      'Video/4.Report View.mp4'
    ],
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
      zh: 'Readme.md',
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
      tag.textContent = skill.name;
      if (skill.level) {
        tag.setAttribute('data-level', skill.level);
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
  if (heroTitle) {
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
