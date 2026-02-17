/**
 * Toast 通知组件
 */
export class Toast {
  private container: HTMLElement;

  constructor() {
    this.container = this.createContainer();
    document.body.appendChild(this.container);
  }

  /**
   * 显示错误消息
   */
  showError(message: string, duration: number = 3000): void {
    this.show(message, 'error', duration);
  }

  /**
   * 显示成功消息
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }

  /**
   * 显示信息消息
   */
  showInfo(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }

  /**
   * 显示通知
   */
  private show(message: string, type: 'error' | 'success' | 'info', duration: number): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    this.container.appendChild(toast);

    // 触发动画
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // 自动移除
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        this.container.removeChild(toast);
      }, 300);
    }, duration);
  }

  /**
   * 创建容器元素
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'toast-container';
    return container;
  }
}
