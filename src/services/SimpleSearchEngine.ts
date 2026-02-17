import { Note } from '../models/Note';
import { SearchEngine } from './SearchEngine';

/**
 * 简单的搜索引擎实现
 */
export class SimpleSearchEngine implements SearchEngine {
  /**
   * 搜索包含关键词的笔记（不区分大小写）
   */
  search(notes: Note[], keyword: string): Note[] {
    // 如果关键词为空，返回所有笔记
    if (!keyword.trim()) {
      return notes;
    }
    
    const lowerKeyword = keyword.toLowerCase();
    
    return notes.filter(note => 
      note.content.toLowerCase().includes(lowerKeyword)
    );
  }
}
