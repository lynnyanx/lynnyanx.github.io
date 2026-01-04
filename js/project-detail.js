/**
 * 项目详情页模块
 * 需求: 1.1, 1.2, 1.4, 2.1, 2.2, 2.3, 2.4
 */

/**
 * 配置 marked.js Markdown 渲染选项
 * 需求 2.1: 配置 Markdown 渲染选项
 */
function configureMarked() {
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      // 启用 GitHub 风格的 Markdown
      gfm: true,
      // 启用换行符转换为 <br>
      breaks: false,
      // 启用表格支持
      tables: true,
      // 启用智能引号
      smartypants: false
    });
  }
}

const projectDetail = {
  currentProject: null,
  currentAssets: null,
  
  /**
   * 从 URL 获取项目 ID
   * 需求 1.1: 从 URL 参数获取项目标识
   * 支持多种 URL 格式:
   * - project.html#id=xxx (hash 格式，推荐)
   * - project.html?id=xxx (查询参数格式)
   * - project/xxx (路径格式)
   * @returns {string|null} 项目 ID
   */
  getProjectId() {
    // 调试信息
    console.log('URL Debug:', {
      href: window.location.href,
      search: window.location.search,
      pathname: window.location.pathname,
      hash: window.location.hash
    });
    
    // 优先从 hash 中获取 ID (支持 #id=xxx 格式)
    // 这种方式不会被服务器重写影响
    const hash = window.location.hash;
    if (hash) {
      // 移除开头的 #
      const hashContent = hash.substring(1);
      // 尝试解析为 URLSearchParams
      if (hashContent.includes('=')) {
        const hashParams = new URLSearchParams(hashContent);
        const idFromHash = hashParams.get('id');
        if (idFromHash) {
          console.log('Project ID from hash:', idFromHash);
          return idFromHash;
        }
      } else if (hashContent && !hashContent.includes('/')) {
        // 直接使用 hash 值作为 ID (支持 #project-id 格式)
        console.log('Project ID from hash (direct):', hashContent);
        return hashContent;
      }
    }
    
    // 其次尝试从查询参数获取
    const urlParams = new URLSearchParams(window.location.search);
    const idFromParams = urlParams.get('id');
    if (idFromParams) {
      console.log('Project ID from params:', idFromParams);
      return idFromParams;
    }
    
    // 最后尝试从 URL 路径获取
    // 支持格式: /project/xxx 或 /project.html/xxx
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(part => part && part !== 'project' && part !== 'project.html');
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      // 移除可能的 .html 后缀
      const idFromPath = lastPart.replace(/\.html$/, '');
      if (idFromPath && idFromPath !== 'project') {
        console.log('Project ID from path:', idFromPath);
        return idFromPath;
      }
    }
    
    console.log('No project ID found');
    return null;
  },

  /**
   * 获取项目资源配置
   * @param {string} projectId - 项目 ID
   * @returns {Object|null} 项目资源配置
   */
  getProjectAssets(projectId) {
    if (typeof projectAssets !== 'undefined') {
      return projectAssets[projectId] || null;
    }
    return null;
  },

  /**
   * 异步加载 README 文件
   * 需求 2.1, 6.2: 根据当前语言加载对应的 README 文件
   * @param {string} assetsPath - 项目资源目录路径
   * @param {Object} readmeConfig - README 配置 { zh: 'xxx.md', en: 'xxx.md' }
   * @param {string} locale - 当前语言 ('zh' 或 'en')
   * @returns {Promise<string|null>} README 内容或 null
   */
  async loadReadme(assetsPath, readmeConfig, locale) {
    if (!assetsPath || !readmeConfig) {
      return null;
    }

    // 根据当前语言选择对应的 README 文件
    const readmeFile = readmeConfig[locale] || readmeConfig.en || readmeConfig.zh;
    if (!readmeFile) {
      return null;
    }

    const readmePath = `${assetsPath}/${readmeFile}`;
    
    try {
      const response = await fetch(readmePath);
      if (!response.ok) {
        console.warn(`Failed to load README: ${readmePath}, status: ${response.status}`);
        return null;
      }
      const content = await response.text();
      return content;
    } catch (error) {
      console.error(`Error loading README from ${readmePath}:`, error);
      return null;
    }
  },

  /**
   * 渲染 Markdown 为 HTML
   * 需求 2.1, 2.2: 将 Markdown 内容渲染为格式化的 HTML
   * @param {string} markdown - Markdown 文本
   * @returns {string} 渲染后的 HTML
   */
  renderMarkdown(markdown) {
    if (!markdown) {
      return '';
    }
    
    if (typeof marked !== 'undefined') {
      try {
        return marked.parse(markdown);
      } catch (error) {
        console.error('Error rendering Markdown:', error);
        return `<pre>${markdown}</pre>`;
      }
    }
    
    // 如果 marked 不可用，返回预格式化文本
    return `<pre>${markdown}</pre>`;
  },

  /**
   * 渲染 README 区域
   * 需求 2.1, 2.2, 2.4: 加载并渲染 README，无 README 时显示项目描述
   */
  async renderReadmeSection() {
    const readmeContent = document.getElementById('readme-content');
    if (!readmeContent) return;

    const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
    const project = this.currentProject;
    const assets = this.currentAssets;

    // 显示加载状态
    const loadingText = typeof i18n !== 'undefined'
      ? i18n.t('projectDetail.loadingReadme')
      : (locale === 'zh' ? '正在加载文档...' : 'Loading documentation...');
    readmeContent.innerHTML = `<div class="readme-loading">${loadingText}</div>`;

    // 尝试加载 README
    let readmeText = null;
    if (assets && assets.readme && assets.assetsPath) {
      readmeText = await this.loadReadme(assets.assetsPath, assets.readme, locale);
    }

    if (readmeText) {
      // 渲染 Markdown
      const html = this.renderMarkdown(readmeText);
      readmeContent.innerHTML = html;
    } else {
      // 需求 2.4: 无 README 时显示项目基本描述
      this.renderFallbackDescription(readmeContent, project, locale);
    }
  },

  /**
   * 渲染回退描述（无 README 时）
   * 需求 2.4: 无 README 文件时显示项目的基本描述信息
   * @param {HTMLElement} container - 容器元素
   * @param {Object} project - 项目数据
   * @param {string} locale - 当前语言
   */
  renderFallbackDescription(container, project, locale) {
    if (!container || !project) return;

    const noReadmeText = typeof i18n !== 'undefined' 
      ? i18n.t('projectDetail.noReadme')
      : (locale === 'zh' ? '暂无详细文档' : 'No detailed documentation available');
    
    const description = project.description[locale] || project.description.zh || '';
    const highlights = project.highlights && project.highlights[locale] 
      ? project.highlights[locale] 
      : [];

    const overviewTitle = typeof i18n !== 'undefined'
      ? i18n.t('projectDetail.projectOverview')
      : (locale === 'zh' ? '项目简介' : 'Project Overview');
    
    const highlightsTitle = typeof i18n !== 'undefined'
      ? i18n.t('projectDetail.highlights')
      : (locale === 'zh' ? '项目亮点' : 'Highlights');
    
    const techStackTitle = typeof i18n !== 'undefined'
      ? i18n.t('projectDetail.techStack')
      : (locale === 'zh' ? '技术栈' : 'Tech Stack');

    let html = `<div class="readme-fallback">`;
    html += `<p class="readme-fallback-notice">${noReadmeText}</p>`;
    
    if (description) {
      html += `<div class="readme-fallback-description">
        <h3>${overviewTitle}</h3>
        <p>${description}</p>
      </div>`;
    }

    if (highlights.length > 0) {
      html += `<div class="readme-fallback-highlights">
        <h3>${highlightsTitle}</h3>
        <ul>
          ${highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      </div>`;
    }

    if (project.techStack && project.techStack.length > 0) {
      html += `<div class="readme-fallback-tech">
        <h3>${techStackTitle}</h3>
        <div class="tech-tags">
          ${project.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  /**
   * 根据 ID 获取项目数据
   * 需求 1.1: 获取项目完整信息
   * @param {string} id - 项目 ID
   * @returns {Object|null} 项目数据
   */
  getProjectData(id) {
    if (!id) return null;
    
    // 从 main.js 中的 projects 数组查找
    if (typeof projects !== 'undefined') {
      return projects.find(p => p.id === id) || null;
    }
    return null;
  },

  /**
   * 显示加载状态
   * 需求 11.1: 显示加载动画
   */
  showLoading() {
    const loadingEl = document.getElementById('loading-state');
    const errorEl = document.getElementById('error-state');
    const contentEl = document.getElementById('project-content');
    
    if (loadingEl) loadingEl.style.display = 'flex';
    if (errorEl) errorEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'none';
  },

  /**
   * 显示错误状态
   * 需求 11.2: 无效项目 ID 显示错误提示
   * @param {string} message - 错误消息
   * @param {string} title - 错误标题（可选）
   */
  showError(message, title) {
    const loadingEl = document.getElementById('loading-state');
    const errorEl = document.getElementById('error-state');
    const contentEl = document.getElementById('project-content');
    const messageEl = document.getElementById('error-message');
    const titleEl = document.querySelector('.error-title');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'flex';
    if (contentEl) contentEl.style.display = 'none';
    
    if (messageEl && message) {
      messageEl.textContent = message;
    }
    
    if (titleEl && title) {
      titleEl.textContent = title;
    }
    
    // 更新页面标题以反映错误状态
    const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
    document.title = locale === 'zh' ? '项目不存在 - 作品集' : 'Project Not Found - Portfolio';
  },

  /**
   * 显示项目内容
   */
  showContent() {
    const loadingEl = document.getElementById('loading-state');
    const errorEl = document.getElementById('error-state');
    const contentEl = document.getElementById('project-content');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';
  },

  /**
   * 渲染面包屑导航
   * 需求 1.2: 显示面包屑导航（首页 > 项目 > 项目名称）
   * 需求 1.3: 支持点击返回
   * @param {Object} project - 项目数据
   */
  renderBreadcrumb(project) {
    const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
    const breadcrumbName = document.getElementById('breadcrumb-project-name');
    
    if (breadcrumbName && project) {
      breadcrumbName.textContent = project.title[locale] || project.title.zh;
    }
    
    // Update breadcrumb links with i18n text
    const breadcrumbNav = document.querySelector('.breadcrumb .container');
    if (breadcrumbNav && typeof i18n !== 'undefined') {
      const homeLink = breadcrumbNav.querySelector('a[href="index.html"]');
      const projectsLink = breadcrumbNav.querySelector('a[href="index.html#projects"]');
      
      if (homeLink) {
        homeLink.textContent = i18n.t('nav.home');
      }
      if (projectsLink) {
        projectsLink.textContent = i18n.t('nav.projects');
      }
    }
  },

  /**
   * 渲染项目头部信息
   * 需求 1.4: 显示项目标题、类型标签、技术栈和项目链接
   * @param {Object} project - 项目数据
   */
  renderProjectHeader(project) {
    const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
    
    // 项目类型标签
    const typeTag = document.getElementById('project-type-tag');
    if (typeTag && project.type && typeof projectTypeConfig !== 'undefined') {
      const typeConfig = projectTypeConfig[project.type];
      if (typeConfig) {
        typeTag.textContent = typeConfig[locale] || typeConfig.zh;
        typeTag.className = `project-type-tag type-${typeConfig.color}`;
        typeTag.style.display = 'inline-flex';
      } else {
        typeTag.style.display = 'none';
      }
    } else if (typeTag) {
      typeTag.style.display = 'none';
    }
    
    // 项目标题
    const titleEl = document.getElementById('project-title');
    if (titleEl) {
      titleEl.textContent = project.title[locale] || project.title.zh;
    }
    
    // 项目描述
    const descEl = document.getElementById('project-description');
    if (descEl) {
      descEl.textContent = project.description[locale] || project.description.zh;
    }
    
    // 技术栈
    const techStackEl = document.getElementById('project-tech-stack');
    if (techStackEl && project.techStack && project.techStack.length > 0) {
      techStackEl.innerHTML = project.techStack
        .map(tech => `<span class="tech-tag">${tech}</span>`)
        .join('');
      techStackEl.style.display = 'flex';
    } else if (techStackEl) {
      techStackEl.style.display = 'none';
    }
    
    // 项目链接
    const linksEl = document.getElementById('project-links');
    if (linksEl) {
      let linksHTML = '';
      const hasLinks = project.links && (project.links.github || project.links.demo);
      
      if (project.links && project.links.github) {
        const codeText = typeof i18n !== 'undefined' 
          ? i18n.t('projects.viewCode') 
          : (locale === 'zh' ? '查看源码' : 'View Code');
        linksHTML += `<a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="btn-link btn-github">
          <span>📦</span> ${codeText}
        </a>`;
      }
      
      if (project.links && project.links.demo) {
        const demoText = typeof i18n !== 'undefined' 
          ? i18n.t('projects.viewDemo') 
          : (locale === 'zh' ? '在线演示' : 'Live Demo');
        linksHTML += `<a href="${project.links.demo}" target="_blank" rel="noopener noreferrer" class="btn-link btn-demo">
          <span>🚀</span> ${demoText}
        </a>`;
      }
      
      linksEl.innerHTML = linksHTML;
      linksEl.style.display = hasLinks ? 'flex' : 'none';
    }
  },

  /**
   * 页面初始化
   * 需求 1.1: 初始化详情页
   * 需求 11.2: 无效项目 ID 显示错误提示
   */
  async init() {
    this.showLoading();
    
    // 获取项目 ID
    const projectId = this.getProjectId();
    
    if (!projectId) {
      const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
      const title = locale === 'zh' ? '未指定项目' : 'No Project Specified';
      const message = locale === 'zh' 
        ? '请从首页选择一个项目查看详情' 
        : 'Please select a project from the homepage to view details';
      this.showError(message, title);
      return;
    }
    
    // 获取项目数据
    const project = this.getProjectData(projectId);
    
    if (!project) {
      const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
      const title = locale === 'zh' ? '项目不存在' : 'Project Not Found';
      const message = locale === 'zh'
        ? `找不到 ID 为 "${projectId}" 的项目，请检查链接是否正确`
        : `Could not find project with ID "${projectId}". Please check if the link is correct`;
      this.showError(message, title);
      return;
    }
    
    this.currentProject = project;
    this.currentAssets = this.getProjectAssets(projectId);
    
    // 渲染页面内容
    this.renderBreadcrumb(project);
    this.renderProjectHeader(project);
    
    // 更新页面标题
    const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
    document.title = `${project.title[locale] || project.title.zh} - ${locale === 'zh' ? '作品集' : 'Portfolio'}`;
    
    // 显示内容
    this.showContent();
    
    // 初始化视频播放器 - 需求 3.1, 3.2, 3.3, 3.4
    if (this.currentAssets && this.currentAssets.videos) {
      this.initVideoPlayer(this.currentAssets.videos);
    } else {
      // 隐藏视频区域
      const videoSection = document.getElementById('video-section');
      if (videoSection) videoSection.style.display = 'none';
    }
    
    // 初始化截图画廊 - 需求 4.1, 4.2, 4.3, 4.4
    if (this.currentAssets && this.currentAssets.screenshots) {
      this.initGallery(this.currentAssets.screenshots);
    } else {
      // 隐藏画廊区域
      const gallerySection = document.getElementById('gallery-section');
      if (gallerySection) gallerySection.style.display = 'none';
    }
    
    // 初始化架构图展示 - 需求 5.1, 5.2, 5.3
    if (this.currentAssets && this.currentAssets.architectureDiagram) {
      this.initArchitectureDiagram(this.currentAssets.architectureDiagram);
    } else {
      // 隐藏架构图区域
      const archSection = document.getElementById('architecture-section');
      if (archSection) archSection.style.display = 'none';
    }
    
    // 渲染 README 区域 - 需求 2.1, 2.2, 2.4
    await this.renderReadmeSection();
  },

  // 视频播放相关状态
  currentVideos: [],
  currentVideoIndex: 0,

  /**
   * 初始化视频播放器
   * 需求 3.1, 3.2: 使用 HTML5 video 元素，支持播放控制
   * @param {string[]} videos - 视频文件路径数组
   */
  initVideoPlayer(videos) {
    const videoSection = document.getElementById('video-section');
    const videoPlayer = document.getElementById('video-player');
    const videoSource = document.getElementById('video-source');
    const videoList = document.getElementById('video-list');
    const videoError = document.getElementById('video-error');
    
    // 如果没有视频，隐藏视频区域 - 需求 3.1 条件渲染
    if (!videos || videos.length === 0) {
      if (videoSection) videoSection.style.display = 'none';
      return;
    }
    
    // 显示视频区域
    if (videoSection) videoSection.style.display = 'block';
    
    const assetsPath = this.currentAssets?.assetsPath || '';
    const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
    
    // 存储当前视频列表和索引
    this.currentVideos = videos.map(v => `${assetsPath}/${v}`);
    this.currentVideoIndex = 0;
    
    // 加载第一个视频
    if (videoPlayer && videoSource && this.currentVideos.length > 0) {
      this.loadVideo(this.currentVideos[0]);
    }
    
    // 渲染视频列表 - 需求 3.3
    if (videoList) {
      this.renderVideoList(videoList, videos, locale);
    }
    
    // 绑定视频错误处理 - 需求 3.4
    if (videoPlayer) {
      this.bindVideoErrorHandler(videoPlayer, videoError);
    }
  },

  /**
   * 加载指定视频
   * @param {string} videoPath - 视频路径
   */
  loadVideo(videoPath) {
    const videoPlayer = document.getElementById('video-player');
    const videoSource = document.getElementById('video-source');
    const videoError = document.getElementById('video-error');
    
    if (!videoPlayer || !videoSource) return;
    
    // 隐藏错误提示
    if (videoError) videoError.style.display = 'none';
    
    // 设置视频源
    videoSource.src = videoPath;
    videoPlayer.load();
  },

  /**
   * 渲染视频列表
   * 需求 3.3: 以列表形式展示所有视频，支持切换播放
   * @param {HTMLElement} container - 列表容器
   * @param {string[]} videos - 视频文件名数组
   * @param {string} locale - 当前语言
   */
  renderVideoList(container, videos, locale) {
    if (!container || !videos || videos.length === 0) return;
    
    // 如果只有一个视频，不显示列表
    if (videos.length === 1) {
      container.style.display = 'none';
      return;
    }
    
    container.style.display = 'block';
    container.innerHTML = '';
    
    const listTitle = document.createElement('h4');
    listTitle.className = 'video-list-title';
    listTitle.textContent = typeof i18n !== 'undefined' 
      ? i18n.t('projectDetail.videoList')
      : (locale === 'zh' ? '视频列表' : 'Video List');
    container.appendChild(listTitle);
    
    const list = document.createElement('ul');
    list.className = 'video-list-items';
    
    videos.forEach((video, index) => {
      const item = document.createElement('li');
      item.className = `video-list-item ${index === 0 ? 'active' : ''}`;
      item.setAttribute('data-index', index);
      
      // 从文件名提取视频标题
      const videoName = this.extractVideoTitle(video);
      
      const icon = document.createElement('span');
      icon.className = 'video-item-icon';
      icon.textContent = '▶';
      
      const title = document.createElement('span');
      title.className = 'video-item-title';
      title.textContent = videoName;
      
      item.appendChild(icon);
      item.appendChild(title);
      
      // 点击切换视频
      item.addEventListener('click', () => {
        this.switchVideo(index);
      });
      
      list.appendChild(item);
    });
    
    container.appendChild(list);
  },

  /**
   * 从文件路径提取视频标题
   * @param {string} videoPath - 视频文件路径
   * @returns {string} 视频标题
   */
  extractVideoTitle(videoPath) {
    // 获取文件名（不含路径）
    const fileName = videoPath.split('/').pop();
    // 移除扩展名
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    // 替换下划线和连字符为空格
    return nameWithoutExt.replace(/[_-]/g, ' ');
  },

  /**
   * 切换视频
   * 需求 3.3: 支持切换播放
   * @param {number} index - 视频索引
   */
  switchVideo(index) {
    if (!this.currentVideos || index < 0 || index >= this.currentVideos.length) return;
    
    this.currentVideoIndex = index;
    this.loadVideo(this.currentVideos[index]);
    
    // 更新列表项激活状态
    const listItems = document.querySelectorAll('.video-list-item');
    listItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  },

  /**
   * 绑定视频错误处理
   * 需求 3.4: 视频加载失败时显示友好的错误提示
   * @param {HTMLVideoElement} videoPlayer - 视频播放器元素
   * @param {HTMLElement} errorContainer - 错误提示容器
   */
  bindVideoErrorHandler(videoPlayer, errorContainer) {
    if (!videoPlayer) return;
    
    // 视频加载错误处理
    videoPlayer.addEventListener('error', () => {
      console.error('Video load error:', videoPlayer.error);
      if (errorContainer) {
        errorContainer.style.display = 'flex';
        const errorMsg = errorContainer.querySelector('p');
        if (errorMsg) {
          errorMsg.textContent = typeof i18n !== 'undefined'
            ? i18n.t('projectDetail.videoLoadError')
            : '视频加载失败，请稍后重试';
        }
      }
    });
    
    // 视频加载成功时隐藏错误
    videoPlayer.addEventListener('loadeddata', () => {
      if (errorContainer) {
        errorContainer.style.display = 'none';
      }
    });
    
    // 绑定重试按钮
    const retryBtn = document.getElementById('video-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.retryVideoLoad();
      });
    }
  },

  /**
   * 重试加载当前视频
   * 需求 3.4: 支持重试加载失败的视频
   */
  retryVideoLoad() {
    if (this.currentVideos && this.currentVideos.length > 0) {
      const currentVideo = this.currentVideos[this.currentVideoIndex];
      this.loadVideo(currentVideo);
    }
  },

  /**
   * 语言切换时更新内容
   * 需求 6.1, 6.2: 更新页面所有可翻译文本，重新加载对应语言的 README
   */
  async updateContent() {
    if (this.currentProject) {
      this.renderBreadcrumb(this.currentProject);
      this.renderProjectHeader(this.currentProject);
      
      // 更新页面标题
      const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
      document.title = `${this.currentProject.title[locale] || this.currentProject.title.zh} - ${locale === 'zh' ? '作品集' : 'Portfolio'}`;
      
      // 重新加载 README（根据新语言）- 需求 6.2
      await this.renderReadmeSection();
      
      // 更新视频列表标题
      const videoListTitle = document.querySelector('.video-list-title');
      if (videoListTitle) {
        videoListTitle.textContent = typeof i18n !== 'undefined'
          ? i18n.t('projectDetail.videoList')
          : (locale === 'zh' ? '视频列表' : 'Video List');
      }
      
      // 更新架构图区域（如果存在）- 需求 5.1, 5.2, 5.3
      if (this.currentAssets && this.currentAssets.architectureDiagram) {
        this.initArchitectureDiagram(this.currentAssets.architectureDiagram);
      }
    }
  },

  // 截图画廊相关状态 - 需求 4.1, 4.2, 4.3, 4.4
  galleryImages: [],

  /**
   * 初始化截图画廊
   * 需求 4.1: 以网格形式展示所有截图缩略图
   * @param {string[]} screenshots - 截图文件路径数组
   */
  initGallery(screenshots) {
    const gallerySection = document.getElementById('gallery-section');
    const galleryGrid = document.getElementById('gallery-grid');
    
    // 如果没有截图，隐藏画廊区域 - 需求 4.1 条件渲染
    if (!screenshots || screenshots.length === 0) {
      if (gallerySection) gallerySection.style.display = 'none';
      return;
    }
    
    // 显示画廊区域
    if (gallerySection) gallerySection.style.display = 'block';
    
    const assetsPath = this.currentAssets?.assetsPath || '';
    
    // 构建完整的图片路径
    this.galleryImages = screenshots.map(s => `${assetsPath}/${s}`);
    
    // 渲染截图网格
    if (galleryGrid) {
      this.renderGalleryGrid(galleryGrid);
    }
  },

  /**
   * 渲染截图网格
   * 需求 4.1: 以网格形式展示缩略图
   * 需求 11.3: 截图使用懒加载提升性能
   * @param {HTMLElement} container - 网格容器
   */
  renderGalleryGrid(container) {
    if (!container || !this.galleryImages || this.galleryImages.length === 0) return;
    
    container.innerHTML = '';
    
    this.galleryImages.forEach((imagePath, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.setAttribute('data-index', index);
      
      const img = document.createElement('img');
      // 需求 11.3: 使用懒加载优化性能
      img.setAttribute('data-src', imagePath);
      img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect fill="#f1f5f9" width="200" height="150"/></svg>');
      img.alt = `Screenshot ${index + 1}`;
      img.className = 'lazy-image';
      
      // 图片加载错误处理
      img.onerror = () => {
        item.classList.add('gallery-item-error');
        img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect fill="#f1f5f9" width="200" height="150"/><text fill="#94a3b8" font-family="sans-serif" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">图片加载失败</text></svg>');
      };
      
      // 点击打开灯箱 - 需求 4.2
      item.addEventListener('click', () => {
        lightbox.open(this.galleryImages, index);
      });
      
      item.appendChild(img);
      container.appendChild(item);
    });
    
    // 初始化懒加载
    this.initLazyLoading();
  },

  /**
   * 初始化图片懒加载
   * 需求 11.3: 使用 Intersection Observer 实现懒加载
   */
  initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src) {
              // 创建临时图片预加载
              const tempImg = new Image();
              tempImg.onload = () => {
                img.src = src;
                img.classList.add('lazy-loaded');
                img.removeAttribute('data-src');
              };
              tempImg.onerror = () => {
                // 触发原始图片的 onerror
                img.src = src;
              };
              tempImg.src = src;
            }
            
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // 降级处理：直接加载所有图片
      lazyImages.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.classList.add('lazy-loaded');
          img.removeAttribute('data-src');
        }
      });
    }
  },

  /**
   * 初始化架构图展示
   * 需求 5.1: 在详情页显示架构图预览
   * 需求 5.2: PDF 格式提供下载链接或在新标签页打开
   * 需求 5.3: 图片格式支持点击放大查看
   * @param {Object} architectureDiagram - 架构图配置 { type: 'pdf'|'image', path: string }
   */
  initArchitectureDiagram(architectureDiagram) {
    const archSection = document.getElementById('architecture-section');
    const archContent = document.getElementById('architecture-content');
    
    // 如果没有架构图配置，隐藏区域
    if (!architectureDiagram || !architectureDiagram.path) {
      if (archSection) archSection.style.display = 'none';
      return;
    }
    
    // 显示架构图区域
    if (archSection) archSection.style.display = 'block';
    
    const assetsPath = this.currentAssets?.assetsPath || '';
    const fullPath = `${assetsPath}/${architectureDiagram.path}`;
    const locale = typeof i18n !== 'undefined' ? i18n.currentLocale : 'zh';
    
    // 根据类型渲染不同内容
    if (archContent) {
      if (architectureDiagram.type === 'pdf') {
        // 需求 5.2: PDF 类型显示下载链接
        this.renderPdfArchitecture(archContent, fullPath, locale);
      } else {
        // 需求 5.3: 图片类型显示预览，支持点击放大
        this.renderImageArchitecture(archContent, fullPath, locale);
      }
    }
  },

  /**
   * 渲染 PDF 架构图
   * 需求 5.2: PDF 格式提供下载链接或在新标签页打开
   * @param {HTMLElement} container - 容器元素
   * @param {string} pdfPath - PDF 文件路径
   * @param {string} locale - 当前语言
   */
  renderPdfArchitecture(container, pdfPath, locale) {
    const viewText = typeof i18n !== 'undefined'
      ? i18n.t('projectDetail.viewPdf')
      : (locale === 'zh' ? '在新标签页查看 PDF' : 'View PDF in New Tab');
    const downloadText = typeof i18n !== 'undefined'
      ? i18n.t('projectDetail.downloadArchitecture')
      : (locale === 'zh' ? '下载架构图' : 'Download Architecture');
    const descText = typeof i18n !== 'undefined'
      ? i18n.t('projectDetail.pdfDescription')
      : (locale === 'zh' 
        ? '点击下方按钮查看或下载项目架构图文档' 
        : 'Click the button below to view or download the architecture document');
    
    container.innerHTML = `
      <div class="architecture-pdf">
        <div class="architecture-pdf-icon">📄</div>
        <p class="architecture-pdf-desc">${descText}</p>
        <div class="architecture-pdf-actions">
          <a href="${pdfPath}" target="_blank" rel="noopener noreferrer" class="btn-link btn-demo">
            <span>🔗</span> ${viewText}
          </a>
          <a href="${pdfPath}" download class="btn-link btn-github">
            <span>⬇️</span> ${downloadText}
          </a>
        </div>
      </div>
    `;
  },

  /**
   * 渲染图片架构图
   * 需求 5.3: 图片格式支持点击放大查看
   * @param {HTMLElement} container - 容器元素
   * @param {string} imagePath - 图片文件路径
   * @param {string} locale - 当前语言
   */
  renderImageArchitecture(container, imagePath, locale) {
    const clickHint = typeof i18n !== 'undefined'
      ? i18n.t('projectDetail.clickToEnlarge')
      : (locale === 'zh' ? '点击图片放大查看' : 'Click image to enlarge');
    const errorText = typeof i18n !== 'undefined'
      ? i18n.t('projectDetail.architectureLoadError')
      : (locale === 'zh' ? '架构图加载失败' : 'Failed to load architecture diagram');
    
    container.innerHTML = `
      <div class="architecture-image">
        <div class="architecture-image-wrapper">
          <img src="${imagePath}" alt="Architecture Diagram" class="architecture-img" loading="lazy">
          <div class="architecture-image-overlay">
            <span>🔍 ${clickHint}</span>
          </div>
        </div>
      </div>
    `;
    
    // 绑定点击放大事件
    const imgWrapper = container.querySelector('.architecture-image-wrapper');
    if (imgWrapper) {
      imgWrapper.addEventListener('click', () => {
        // 使用灯箱组件显示大图
        lightbox.open([imagePath], 0);
      });
    }
    
    // 图片加载错误处理
    const img = container.querySelector('.architecture-img');
    if (img) {
      img.onerror = () => {
        container.innerHTML = `
          <div class="architecture-error">
            <span class="architecture-error-icon">⚠️</span>
            <p>${errorText}</p>
          </div>
        `;
      };
    }
  }
};

/**
 * 灯箱组件
 * 需求 4.2, 4.3, 4.4
 */
const lightbox = {
  isOpen: false,
  currentIndex: 0,
  images: [],
  
  /**
   * 打开灯箱
   * 需求 4.2: 点击缩略图打开灯箱模式显示大图
   * @param {string[]} images - 图片路径数组
   * @param {number} startIndex - 起始索引
   */
  open(images, startIndex = 0) {
    if (!images || images.length === 0) return;
    
    this.images = images;
    this.currentIndex = startIndex;
    this.isOpen = true;
    
    const lightboxEl = document.getElementById('lightbox');
    if (lightboxEl) {
      lightboxEl.style.display = 'flex';
      this.updateImage();
      this.bindEvents();
      
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    }
  },
  
  /**
   * 关闭灯箱
   * 需求 4.4: 支持点击外部区域或按 ESC 键关闭
   */
  close() {
    this.isOpen = false;
    
    const lightboxEl = document.getElementById('lightbox');
    if (lightboxEl) {
      lightboxEl.style.display = 'none';
    }
    
    // 恢复背景滚动
    document.body.style.overflow = '';
    
    this.unbindEvents();
  },
  
  /**
   * 切换到上一张
   * 需求 4.3: 支持左右切换查看其他截图（循环到末尾）
   */
  prev() {
    if (this.images.length === 0) return;
    
    this.currentIndex = this.currentIndex > 0 
      ? this.currentIndex - 1 
      : this.images.length - 1;
    this.updateImage();
  },
  
  /**
   * 切换到下一张
   * 需求 4.3: 支持左右切换查看其他截图（循环到开头）
   */
  next() {
    if (this.images.length === 0) return;
    
    this.currentIndex = this.currentIndex < this.images.length - 1 
      ? this.currentIndex + 1 
      : 0;
    this.updateImage();
  },
  
  /**
   * 更新当前显示的图片
   */
  updateImage() {
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    
    if (lightboxImage && this.images[this.currentIndex]) {
      lightboxImage.src = this.images[this.currentIndex];
      lightboxImage.alt = `Screenshot ${this.currentIndex + 1}`;
    }
    
    if (lightboxCurrent) {
      lightboxCurrent.textContent = this.currentIndex + 1;
    }
    
    if (lightboxTotal) {
      lightboxTotal.textContent = this.images.length;
    }
  },
  
  /**
   * 键盘事件处理
   * 需求 4.4: 支持按 ESC 键关闭
   * @param {KeyboardEvent} event - 键盘事件
   */
  handleKeydown(event) {
    if (!lightbox.isOpen) return;
    
    switch (event.key) {
      case 'Escape':
        lightbox.close();
        break;
      case 'ArrowLeft':
        lightbox.prev();
        break;
      case 'ArrowRight':
        lightbox.next();
        break;
    }
  },
  
  /**
   * 绑定事件
   */
  bindEvents() {
    // 键盘事件
    document.addEventListener('keydown', this.handleKeydown);
    
    // 关闭按钮
    const closeBtn = document.querySelector('.lightbox-close');
    if (closeBtn) {
      closeBtn.onclick = () => this.close();
    }
    
    // 上一张按钮
    const prevBtn = document.querySelector('.lightbox-prev');
    if (prevBtn) {
      prevBtn.onclick = () => this.prev();
    }
    
    // 下一张按钮
    const nextBtn = document.querySelector('.lightbox-next');
    if (nextBtn) {
      nextBtn.onclick = () => this.next();
    }
    
    // 点击背景关闭 - 需求 4.4
    const lightboxEl = document.getElementById('lightbox');
    if (lightboxEl) {
      lightboxEl.onclick = (e) => {
        if (e.target === lightboxEl) {
          this.close();
        }
      };
    }
  },
  
  /**
   * 解绑事件
   */
  unbindEvents() {
    document.removeEventListener('keydown', this.handleKeydown);
  }
};

/**
 * 绑定语言切换事件
 */
function bindDetailLangToggle() {
  const langToggle = document.getElementById('lang-toggle');
  if (!langToggle) return;
  
  langToggle.addEventListener('click', async () => {
    if (typeof i18n !== 'undefined') {
      await i18n.toggleLocale();
      await projectDetail.updateContent();
    }
  });
}

/**
 * 初始化详情页
 */
async function initProjectDetailPage() {
  try {
    // 配置 marked.js - 需求 2.1
    configureMarked();
    
    // 初始化 i18n 模块
    if (typeof i18n !== 'undefined') {
      await i18n.init();
    }
    
    // 绑定语言切换
    bindDetailLangToggle();
    
    // 初始化详情页
    await projectDetail.init();
    
  } catch (error) {
    console.error('Failed to initialize project detail page:', error);
    projectDetail.showError('页面加载失败');
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initProjectDetailPage);

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    projectDetail,
    lightbox,
    configureMarked,
    initProjectDetailPage
  };
}
