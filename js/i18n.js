/**
 * 国际化模块 (i18n)
 * 支持中英双语切换
 */

const i18n = {
  currentLocale: 'zh',
  translations: {},
  STORAGE_KEY: 'portfolio-locale',

  /**
   * 初始化国际化模块
   */
  async init() {
    // 优先从本地存储加载，否则检测浏览器语言
    const savedLocale = this.loadLocale();
    const locale = savedLocale || this.detectLocale();
    
    await this.setLocale(locale);
  },

  /**
   * 检测浏览器语言偏好
   * 需求 7.1: 根据浏览器语言偏好自动选择中文或英文
   * @returns {'zh' | 'en'}
   */
  detectLocale() {
    // 检查浏览器环境
    if (typeof navigator === 'undefined') {
      return 'zh';
    }
    
    const browserLang = navigator.language || navigator.userLanguage || '';
    // 如果浏览器语言包含 'zh'，返回 'zh'，否则返回 'en'
    return browserLang.toLowerCase().includes('zh') ? 'zh' : 'en';
  },

  /**
   * 设置当前语言
   * 需求 7.2: 在中文和英文之间切换所有文本内容
   * @param {'zh' | 'en'} locale
   */
  async setLocale(locale) {
    // 确保 locale 只能是 'zh' 或 'en'
    const validLocale = locale === 'zh' || locale === 'en' ? locale : 'zh';
    
    try {
      // 加载语言文件
      await this.loadTranslations(validLocale);
      this.currentLocale = validLocale;
      this.saveLocale(validLocale);
      this.updatePageTexts();
    } catch (error) {
      console.error('Failed to load translations:', error);
      // 回退到默认语言
      if (validLocale !== 'zh') {
        await this.setLocale('zh');
      }
    }
  },


  /**
   * 加载语言文件
   * @param {'zh' | 'en'} locale
   */
  async loadTranslations(locale) {
    // 浏览器环境：通过 fetch 加载
    if (typeof fetch !== 'undefined' && typeof window !== 'undefined') {
      // 使用相对路径，让浏览器自动处理
      const url = `./locales/${locale}.json`;
      console.log('Loading translations from:', url, 'Current locale:', this.currentLocale, 'New locale:', locale);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${locale}.json`);
      }
      this.translations = await response.json();
      console.log('Translations loaded successfully:', Object.keys(this.translations));
    } else {
      // Node.js 环境：直接 require（用于测试）
      try {
        this.translations = require(`../locales/${locale}.json`);
      } catch (e) {
        this.translations = {};
      }
    }
  },

  /**
   * 获取翻译文本
   * @param {string} key - 翻译键，如 'hero.name'
   * @returns {string}
   */
  t(key) {
    const keys = key.split('.');
    let value = this.translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 找不到翻译时返回 key
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  },

  /**
   * 保存语言偏好到本地存储
   * 需求 7.3: 将语言偏好保存到本地存储
   * @param {'zh' | 'en'} locale
   */
  saveLocale(locale) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, locale);
      }
    } catch (error) {
      // localStorage 不可用时静默失败（如隐私模式）
      console.warn('localStorage not available:', error);
    }
  },

  /**
   * 从本地存储加载语言偏好
   * 需求 7.4: 恢复上次选择的语言设置
   * @returns {'zh' | 'en' | null}
   */
  loadLocale() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved === 'zh' || saved === 'en') {
          return saved;
        }
      }
    } catch (error) {
      // localStorage 不可用时静默失败
      console.warn('localStorage not available:', error);
    }
    return null;
  },

  /**
   * 切换语言（在 zh 和 en 之间切换）
   * 需求 7.2: 点击语言切换按钮时切换语言
   */
  async toggleLocale() {
    const newLocale = this.currentLocale === 'zh' ? 'en' : 'zh';
    await this.setLocale(newLocale);
  },

  /**
   * 更新页面所有文本
   * 需求 7.5: 保持页面布局和样式不变，仅更新文本内容
   */
  updatePageTexts() {
    // 检查是否在浏览器环境
    if (typeof document === 'undefined') {
      return;
    }
    
    // 查找所有带有 data-i18n 属性的元素并更新文本
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });
    
    // 更新带有 data-i18n-placeholder 属性的元素的 placeholder
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.placeholder = this.t(key);
      }
    });
    
    // 更新带有 data-i18n-aria 属性的元素的 aria-label
    const ariaElements = document.querySelectorAll('[data-i18n-aria]');
    ariaElements.forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) {
        el.setAttribute('aria-label', this.t(key));
      }
    });
    
    // 更新带有 data-i18n-title 属性的元素的 title
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.setAttribute('title', this.t(key));
      }
    });
    
    // 更新 html lang 属性
    document.documentElement.lang = this.currentLocale;
  }
};

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = i18n;
}
