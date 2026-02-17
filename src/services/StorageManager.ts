import { Note } from '../models/Note';

/**
 * 存储管理器接口
 */
export interface StorageManager {
  /** 保存笔记 */
  saveNote(note: Note): void;
  
  /** 删除笔记 */
  deleteNote(id: string): void;
  
  /** 加载所有笔记 */
  loadAllNotes(): Note[];
  
  /** 清空所有笔记 */
  clear(): void;
}
