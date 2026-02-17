import { Note } from '../models/Note';
import { StorageManager } from './StorageManager';

/**
 * 基于 LocalStorage 的存储管理器实现
 */
export class LocalStorageManager implements StorageManager {
  private readonly STORAGE_KEY = 'markdown_notes';
  private onError?: (message: string) => void;

  /**
   * 设置错误回调
   */
  setOnError(callback: (message: string) => void): void {
    this.onError = callback;
  }

  /**
   * 保存笔记到 LocalStorage
   */
  saveNote(note: Note): void {
    try {
      const notes = this.loadAllNotes();
      const existingIndex = notes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        notes[existingIndex] = note;
      } else {
        notes.push(note);
      }
      
      this.saveAll(notes);
    } catch (error) {
      const errorMessage = error instanceof Error && error.name === 'QuotaExceededError'
        ? '存储空间已满，无法保存笔记'
        : '保存笔记失败';
      
      if (this.onError) {
        this.onError(errorMessage);
      }
      throw new Error(errorMessage);
    }
  }

  /**
   * 从 LocalStorage 删除笔记
   */
  deleteNote(id: string): void {
    const notes = this.loadAllNotes();
    const filtered = notes.filter(n => n.id !== id);
    this.saveAll(filtered);
  }

  /**
   * 从 LocalStorage 加载所有笔记
   */
  loadAllNotes(): Note[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return [];
      }
      
      return this.deserialize(data);
    } catch (error) {
      console.error('加载笔记失败:', error);
      if (this.onError) {
        this.onError('部分笔记数据可能已损坏');
      }
      return [];
    }
  }

  /**
   * 清空所有笔记
   */
  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 序列化笔记数组为 JSON 字符串
   */
  private serialize(notes: Note[]): string {
    return JSON.stringify(notes);
  }

  /**
   * 反序列化 JSON 字符串为笔记数组
   */
  private deserialize(data: string): Note[] {
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        console.error('数据格式错误：不是数组');
        return [];
      }
      return parsed;
    } catch (error) {
      console.error('JSON 解析失败:', error);
      return [];
    }
  }

  /**
   * 保存所有笔记到 LocalStorage
   */
  private saveAll(notes: Note[]): void {
    const serialized = this.serialize(notes);
    localStorage.setItem(this.STORAGE_KEY, serialized);
  }
}
