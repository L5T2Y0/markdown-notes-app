import { Note } from '../models/Note';
import { NoteManager } from '../services/NoteManager';
import { SearchEngine } from '../services/SearchEngine';

/**
 * 笔记列表组件
 */
export class NoteListComponent {
  private noteManager: NoteManager;
  private searchEngine: SearchEngine;
  private element: HTMLElement;
  private onNoteClickCallback?: (noteId: string) => void;
  private onDeleteCallback?: (noteId: string) => void;

  constructor(
    noteManager: NoteManager,
    searchEngine: SearchEngine,
    element: HTMLElement
  ) {
    this.noteManager = noteManager;
    this.searchEngine = searchEngine;
    this.element = element;
  }

  /**
   * 设置笔记点击回调
   */
  setOnNoteClickCallback(callback: (noteId: string) => void): void {
    this.onNoteClickCallback = callback;
  }

  /**
   * 设置删除回调
   */
  setOnDeleteCallback(callback: (noteId: string) => void): void {
    this.onDeleteCallback = callback;
  }

  /**
   * 渲染笔记列表
   */
  render(notes: Note[]): void {
    const sortedNotes = this.sortNotes(notes);
    
    if (sortedNotes.length === 0) {
      this.element.innerHTML = '<div class="empty-state">暂无笔记</div>';
      return;
    }
    
    const listHtml = sortedNotes.map(note => {
      const title = this.noteManager.getNoteTitle(note);
      const date = new Date(note.updatedAt).toLocaleString('zh-CN');
      const favoriteIcon = note.isFavorite ? '⭐' : '';
      const tagsHtml = note.tags && note.tags.length > 0
        ? `<div class="note-tags">${note.tags.map(tag => `<span class="note-tag">${tag}</span>`).join('')}</div>`
        : '';
      
      return `
        <div class="note-item" data-note-id="${note.id}">
          <div class="note-title">${this.escapeHtml(title)}</div>
          <div class="note-date">${date}</div>
          ${tagsHtml}
          ${favoriteIcon ? `<span class="note-favorite">${favoriteIcon}</span>` : ''}
          <button class="delete-btn" data-note-id="${note.id}">删除</button>
        </div>
      `;
    }).join('');
    
    this.element.innerHTML = listHtml;
    this.attachEventListeners();
  }

  /**
   * 处理搜索
   */
  onSearch(keyword: string): void {
    const allNotes = this.noteManager.getAllNotes();
    const filteredNotes = this.searchEngine.search(allNotes, keyword);
    this.render(filteredNotes);
  }

  /**
   * 排序笔记（按更新时间降序）
   */
  sortNotes(notes: Note[]): Note[] {
    return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * 刷新列表
   */
  refresh(): void {
    const notes = this.noteManager.getAllNotes();
    this.render(notes);
  }

  /**
   * 转义 HTML 特殊字符
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 附加事件监听器
   */
  private attachEventListeners(): void {
    // 笔记项点击事件
    const noteItems = this.element.querySelectorAll('.note-item');
    noteItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        // 如果点击的是删除按钮，不触发笔记点击
        if (target.classList.contains('delete-btn')) {
          return;
        }
        
        const noteId = (item as HTMLElement).dataset.noteId;
        if (noteId && this.onNoteClickCallback) {
          this.onNoteClickCallback(noteId);
        }
      });
    });
    
    // 删除按钮点击事件
    const deleteButtons = this.element.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const noteId = (btn as HTMLElement).dataset.noteId;
        if (noteId && this.onDeleteCallback) {
          this.onDeleteCallback(noteId);
        }
      });
    });
  }
}
