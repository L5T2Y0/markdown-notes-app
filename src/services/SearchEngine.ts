import { Note } from '../models/Note';

/**
 * 搜索引擎接口
 */
export interface SearchEngine {
  /** 搜索包含关键词的笔记 */
  search(notes: Note[], keyword: string): Note[];
}
