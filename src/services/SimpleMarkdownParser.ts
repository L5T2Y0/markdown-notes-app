import { MarkdownParser } from './MarkdownParser';

/**
 * 简单的 Markdown 解析器实现
 */
export class SimpleMarkdownParser implements MarkdownParser {
  /**
   * 解析 Markdown 为 HTML
   */
  parse(markdown: string): string {
    if (!markdown) {
      return '';
    }

    try {
      let html = markdown;
      
      // 解析代码块（必须在其他解析之前）
      html = this.parseCodeBlocks(html);
      
      // 解析标题
      html = this.parseHeaders(html);
      
      // 解析列表
      html = this.parseLists(html);
      
      // 解析图片（必须在链接之前）
      html = this.parseImages(html);
      
      // 解析链接
      html = this.parseLinks(html);
      
      // 解析内联代码
      html = this.parseInlineCode(html);
      
      // 解析粗体
      html = this.parseBold(html);
      
      // 解析斜体
      html = this.parseItalic(html);
      
      // 解析段落
      html = html.split('\n\n').map(para => {
        if (para.trim() && 
            !para.startsWith('<h') && 
            !para.startsWith('<ul') && 
            !para.startsWith('<ol') &&
            !para.startsWith('<pre')) {
          return `<p>${para}</p>`;
        }
        return para;
      }).join('\n');
      
      return html;
    } catch (error) {
      // 如果解析失败，返回原始文本
      return markdown;
    }
  }

  /**
   * 检查是否为有效的 Markdown（总是返回 true）
   */
  isValid(markdown: string): boolean {
    return true;
  }

  /**
   * 解析标题（# H1, ## H2, 等）
   */
  private parseHeaders(text: string): string {
    return text.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, content) => {
      const level = hashes.length;
      return `<h${level}>${content}</h${level}>`;
    });
  }

  /**
   * 解析列表（有序和无序）
   */
  private parseLists(text: string): string {
    // 无序列表
    text = text.replace(/^(\s*[-*+]\s+.+\n?)+/gm, (match) => {
      const items = match.split('\n').filter(line => line.trim());
      const listItems = items.map(item => {
        const content = item.replace(/^\s*[-*+]\s+/, '');
        return `<li>${content}</li>`;
      }).join('\n');
      return `<ul>\n${listItems}\n</ul>`;
    });
    
    // 有序列表
    text = text.replace(/^(\s*\d+\.\s+.+\n?)+/gm, (match) => {
      const items = match.split('\n').filter(line => line.trim());
      const listItems = items.map(item => {
        const content = item.replace(/^\s*\d+\.\s+/, '');
        return `<li>${content}</li>`;
      }).join('\n');
      return `<ol>\n${listItems}\n</ol>`;
    });
    
    return text;
  }

  /**
   * 解析链接 [文本](URL)
   */
  private parseLinks(text: string): string {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }

  /**
   * 解析图片 ![alt](URL)
   */
  private parseImages(text: string): string {
    return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  }

  /**
   * 解析代码块 ```代码```
   */
  private parseCodeBlocks(text: string): string {
    return text.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
  }

  /**
   * 解析内联代码 `代码`
   */
  private parseInlineCode(text: string): string {
    return text.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  /**
   * 解析粗体 **文本**
   */
  private parseBold(text: string): string {
    return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  /**
   * 解析斜体 *文本*
   */
  private parseItalic(text: string): string {
    return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }
}
