import { MarkdownParser } from '../services/MarkdownParser';

/**
 * 预览组件
 */
export class PreviewComponent {
  private parser: MarkdownParser;
  private element: HTMLElement;

  constructor(parser: MarkdownParser, element: HTMLElement) {
    this.parser = parser;
    this.element = element;
  }

  /**
   * 渲染 Markdown 为 HTML
   */
  render(markdown: string): void {
    const html = this.parser.parse(markdown);
    this.element.innerHTML = html;
  }

  /**
   * 更新预览内容
   */
  update(markdown: string): void {
    this.render(markdown);
  }
}
