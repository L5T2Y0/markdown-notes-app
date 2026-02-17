import { App } from './App';

// 初始化应用
// 使用 DOMContentLoaded 或立即执行（如果 DOM 已加载）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new App();
  });
} else {
  new App();
}
