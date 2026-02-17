/**
 * Markdown 解析器接口
 */
export interface MarkdownParser {
  /** 解析 Markdown 为 HTML */
  parse(markdown: string): string;
  
  /** 检查是否为有效的 Markdown */
  isValid(markdown: string): boolean;
}
