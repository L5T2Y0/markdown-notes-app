/**
 * 主题切换组件
 */
export class ThemeToggle {
  private isDark: boolean = false;
  private button: HTMLElement;

  constructor(button: HTMLElement) {
    this.button = button;
    this.loadTheme();
    this.setupEventListener();
  }

  /**
   * 加载保存的主题
   */
  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDark = savedTheme === 'dark';
    this.applyTheme();
  }

  /**
   * 应用主题
   */
  private applyTheme(): void {
    if (this.isDark) {
      document.body.classList.add('dark-theme');
      this.button.textContent = '☀️';
    } else {
      document.body.classList.remove('dark-theme');
      this.button.textContent = '🌙';
    }
  }

  /**
   * 切换主题
   */
  toggle(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  /**
   * 设置事件监听器
   */
  private setupEventListener(): void {
    this.button.addEventListener('click', () => this.toggle());
  }
}
