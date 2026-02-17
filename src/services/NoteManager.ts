import { Note } from '../models/Note';
import { StorageManager } from './StorageManager';
import { generateUUID } from '../utils/uuid';

/**
 * 笔记管理器 - 负责笔记的 CRUD 操作
 */
export class NoteManager {
  private notes: Map<string, Note>;
  private storage: StorageManager;

  constructor(storage: StorageManager) {
    this.storage = storage;
    this.notes = new Map();
    this.loadNotes();
  }

  /**
   * 创建新笔记
   */
  createNote(): Note {
    const now = Date.now();
    let id = generateUUID();
    
    // 检测 ID 冲突（极低概率）
    let retries = 0;
    while (this.notes.has(id) && retries < 3) {
      id = generateUUID();
      retries++;
    }
    
    if (this.notes.has(id)) {
      throw new Error('无法生成唯一的笔记 ID');
    }
    
    const note: Note = {
      id,
      content: '',
      createdAt: now,
      updatedAt: now,
      tags: [],
      isFavorite: false
    };
    
    this.notes.set(id, note);
    this.storage.saveNote(note);
    
    return note;
  }

  /**
   * 更新笔记内容
   */
  updateNote(id: string, content: string): void {
    const note = this.notes.get(id);
    if (!note) {
      throw new Error(`笔记不存在: ${id}`);
    }
    
    note.content = content;
    note.updatedAt = Date.now();
    
    this.notes.set(id, note);
    this.storage.saveNote(note);
  }

  /**
   * 删除笔记
   */
  deleteNote(id: string): boolean {
    if (!this.notes.has(id)) {
      return false;
    }
    
    this.notes.delete(id);
    this.storage.deleteNote(id);
    
    return true;
  }

  /**
   * 获取单个笔记
   */
  getNote(id: string): Note | null {
    return this.notes.get(id) || null;
  }

  /**
   * 获取所有笔记（按更新时间降序排列）
   */
  getAllNotes(): Note[] {
    const notes = Array.from(this.notes.values());
    return notes.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * 获取笔记标题（第一行或前 50 个字符）
   */
  getNoteTitle(note: Note): string {
    if (!note.content) {
      return '无标题';
    }
    
    const firstLineEnd = note.content.indexOf('\n');
    if (firstLineEnd > 0) {
      return note.content.substring(0, firstLineEnd).trim();
    }
    
    if (note.content.length <= 50) {
      return note.content.trim();
    }
    
    return note.content.substring(0, 50).trim() + '...';
  }

  /**
   * 从存储加载所有笔记
   */
  loadNotes(): void {
    const notes = this.storage.loadAllNotes();
    this.notes.clear();
    notes.forEach(note => {
      this.notes.set(note.id, note);
    });
  }

  /**
   * 切换笔记收藏状态
   */
  toggleFavorite(id: string): void {
    const note = this.notes.get(id);
    if (!note) {
      throw new Error(`笔记不存在: ${id}`);
    }
    
    note.isFavorite = !note.isFavorite;
    note.updatedAt = Date.now();
    
    this.notes.set(id, note);
    this.storage.saveNote(note);
  }

  /**
   * 添加标签到笔记
   */
  addTag(id: string, tag: string): void {
    const note = this.notes.get(id);
    if (!note) {
      throw new Error(`笔记不存在: ${id}`);
    }
    
    if (!note.tags) {
      note.tags = [];
    }
    
    if (!note.tags.includes(tag)) {
      note.tags.push(tag);
      note.updatedAt = Date.now();
      this.notes.set(id, note);
      this.storage.saveNote(note);
    }
  }

  /**
   * 从笔记移除标签
   */
  removeTag(id: string, tag: string): void {
    const note = this.notes.get(id);
    if (!note) {
      throw new Error(`笔记不存在: ${id}`);
    }
    
    if (note.tags) {
      note.tags = note.tags.filter(t => t !== tag);
      note.updatedAt = Date.now();
      this.notes.set(id, note);
      this.storage.saveNote(note);
    }
  }

  /**
   * 获取所有标签
   */
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }

  /**
   * 按标签筛选笔记
   */
  getNotesByTag(tag: string): Note[] {
    return Array.from(this.notes.values())
      .filter(note => note.tags && note.tags.includes(tag))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * 获取收藏的笔记
   */
  getFavoriteNotes(): Note[] {
    return Array.from(this.notes.values())
      .filter(note => note.isFavorite)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }
}
