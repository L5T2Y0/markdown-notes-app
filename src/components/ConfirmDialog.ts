/**
 * 确认对话框组件
 */
export class ConfirmDialog {
  private element: HTMLElement;

  constructor() {
    this.element = this.createDialogElement();
    document.body.appendChild(this.element);
  }

  /**
   * 显示确认对话框
   */
  show(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const messageEl = this.element.querySelector('.dialog-message');
      if (messageEl) {
        messageEl.textContent = message;
      }
      
      this.element.style.display = 'flex';
      
      const confirmBtn = this.element.querySelector('.confirm-btn');
      const cancelBtn = this.element.querySelector('.cancel-btn');
      
      const handleConfirm = () => {
        this.hide();
        cleanup();
        resolve(true);
      };
      
      const handleCancel = () => {
        this.hide();
        cleanup();
        resolve(false);
      };
      
      const cleanup = () => {
        confirmBtn?.removeEventListener('click', handleConfirm);
        cancelBtn?.removeEventListener('click', handleCancel);
      };
      
      confirmBtn?.addEventListener('click', handleConfirm);
      cancelBtn?.addEventListener('click', handleCancel);
    });
  }

  /**
   * 隐藏对话框
   */
  private hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * 创建对话框元素
   */
  private createDialogElement(): HTMLElement {
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.style.display = 'none';
    
    dialog.innerHTML = `
      <div class="dialog-overlay"></div>
      <div class="dialog-content">
        <div class="dialog-message"></div>
        <div class="dialog-buttons">
          <button class="confirm-btn">确认</button>
          <button class="cancel-btn">取消</button>
        </div>
      </div>
    `;
    
    return dialog;
  }
}
