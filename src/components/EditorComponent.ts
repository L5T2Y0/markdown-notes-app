import { NoteManager } from '../services/NoteManager';

/**
 * 编辑器组件
 */
export class EditorComponent {
  private noteManager: NoteManager;
  private currentNoteId: string | null = null;
  private autoSaveTimer: number | null = null;
  private element: HTMLTextAreaElement;
  private onChangeCallback?: (content: string) => void;

  constructor(noteManager: NoteManager, element: HTMLTextAreaElement) {
    this.noteManager = noteManager;
    this.element = element;
    this.setupEventListeners();
  }

  /**
   * 设置内容变化回调
   */
  setOnChangeCallback(callback: (content: string) => void): void {
    this.onChangeCallback = callback;
  }

  /**
   * 加载笔记到编辑器
   */
  loadNote(noteId: string): void {
    const note = this.noteManager.getNote(noteId);
    if (!note) {
      return;
    }
    
    this.currentNoteId = noteId;
    this.element.value = note.content;
    this.element.focus();
  }

  /**
   * 处理内容变化
   */
  private onContentChange(content: string): void {
    if (!this.currentNoteId) {
      return;
    }
    
    // 清除之前的定时器
    if (this.autoSaveTimer !== null) {
      window.clearTimeout(this.autoSaveTimer);
    }
    
    // 设置新的自动保存定时器（500ms 防抖）
    this.autoSaveTimer = window.setTimeout(() => {
      this.autoSave();
    }, 500);
    
    // 触发回调（用于实时预览）
    if (this.onChangeCallback) {
      this.onChangeCallback(content);
    }
  }

  /**
   * 自动保存
   */
  private autoSave(): void {
    if (!this.currentNoteId) {
      return;
    }
    
    try {
      this.noteManager.updateNote(this.currentNoteId, this.element.value);
    } catch (error) {
      console.error('自动保存失败:', error);
    }
  }

  /**
   * 清空编辑器
   */
  clear(): void {
    this.currentNoteId = null;
    this.element.value = '';
    
    if (this.autoSaveTimer !== null) {
      window.clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * 获取当前笔记 ID
   */
  getCurrentNoteId(): string | null {
    return this.currentNoteId;
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    this.element.addEventListener('input', () => {
      this.onContentChange(this.element.value);
    });
  }
}
