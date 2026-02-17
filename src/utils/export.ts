import { Note } from '../models/Note';

/**
 * 导出笔记为 Markdown 文件
 */
export function exportNoteAsMarkdown(note: Note, title: string): void {
  const blob = new Blob([note.content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(title)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 导出所有笔记为 ZIP（简化版：导出为单个 Markdown 文件）
 */
export function exportAllNotes(notes: Note[]): void {
  const content = notes.map((note, index) => {
    const title = note.content.split('\n')[0] || `笔记 ${index + 1}`;
    return `# ${title}\n\n${note.content}\n\n---\n\n`;
  }).join('');
  
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `所有笔记_${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 清理文件名中的非法字符
 */
function sanitizeFilename(filename: string): string {
  return filename.replace(/[<>:"/\\|?*]/g, '_').substring(0, 100);
}

/**
 * 计算字数
 */
export function countWords(text: string): number {
  // 中文字符
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
  // 英文单词
  const englishWords = text.match(/[a-zA-Z]+/g) || [];
  
  return chineseChars.length + englishWords.length;
}

/**
 * 计算字符数
 */
export function countCharacters(text: string): number {
  return text.length;
}
