import { NoteManager } from './services/NoteManager';
import { LocalStorageManager } from './services/LocalStorageManager';
import { SimpleMarkdownParser } from './services/SimpleMarkdownParser';
import { SimpleSearchEngine } from './services/SimpleSearchEngine';
import { EditorComponent } from './components/EditorComponent';
import { PreviewComponent } from './components/PreviewComponent';
import { NoteListComponent } from './components/NoteListComponent';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast } from './components/Toast';
import { ThemeToggle } from './components/ThemeToggle';
import { StatsComponent } from './components/StatsComponent';
import { exportNoteAsMarkdown, exportAllNotes } from './utils/export';
import { Note } from './models/Note';

/**
 * 主应用类
 */
export class App {
  private noteManager: NoteManager;
  private editorComponent: EditorComponent;
  private previewComponent: PreviewComponent;
  private noteListComponent: NoteListComponent;
  private confirmDialog: ConfirmDialog;
  private toast: Toast;
  private themeToggle: ThemeToggle;
  private statsComponent: StatsComponent;
  private currentFilter: 'all' | 'favorites' | 'tag' = 'all';
  private currentTag: string | null = null;
  private currentSort: 'updated' | 'created' | 'title' = 'updated';

  constructor() {
    // 初始化服务
    const storage = new LocalStorageManager();
    this.toast = new Toast();
    
    // 设置存储错误回调
    storage.setOnError((message) => {
      this.toast.showError(message);
    });
    
    this.noteManager = new NoteManager(storage);
    const parser = new SimpleMarkdownParser();
    const searchEngine = new SimpleSearchEngine();

    // 初始化组件
    const editorEl = document.getElementById('editor') as HTMLTextAreaElement;
    const previewEl = document.getElementById('preview') as HTMLElement;
    const noteListEl = document.getElementById('note-list') as HTMLElement;
    const themeToggleBtn = document.getElementById('theme-toggle') as HTMLElement;
    const statsEl = document.getElementById('stats') as HTMLElement;

    this.editorComponent = new EditorComponent(this.noteManager, editorEl);
    this.previewComponent = new PreviewComponent(parser, previewEl);
    this.noteListComponent = new NoteListComponent(
      this.noteManager,
      searchEngine,
      noteListEl
    );
    this.confirmDialog = new ConfirmDialog();
    this.themeToggle = new ThemeToggle(themeToggleBtn);
    this.statsComponent = new StatsComponent(statsEl);

    this.setupEventHandlers();
    this.setupKeyboardShortcuts();
    this.loadNotes();
    this.renderTags();
  }

  /**
   * 设置事件处理器
   */
  private setupEventHandlers(): void {
    // 创建笔记按钮
    const createBtn = document.getElementById('create-note-btn');
    createBtn?.addEventListener('click', () => this.createNote());

    // 搜索输入框
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', () => {
      this.noteListComponent.onSearch(searchInput.value);
    });

    // 编辑器内容变化 -> 实时预览和统计
    this.editorComponent.setOnChangeCallback((content) => {
      this.previewComponent.update(content);
      this.updateStats();
    });

    // 笔记列表项点击
    this.noteListComponent.setOnNoteClickCallback((noteId) => {
      this.loadNoteToEditor(noteId);
    });

    // 删除按钮点击
    this.noteListComponent.setOnDeleteCallback((noteId) => {
      this.deleteNote(noteId);
    });

    // 收藏按钮
    const favoriteBtn = document.getElementById('favorite-btn');
    favoriteBtn?.addEventListener('click', () => this.toggleFavorite());

    // 导出当前笔记
    const exportBtn = document.getElementById('export-btn');
    exportBtn?.addEventListener('click', () => this.exportCurrentNote());

    // 导出所有笔记
    const exportAllBtn = document.getElementById('export-all-btn');
    exportAllBtn?.addEventListener('click', () => this.exportAll());

    // 标签输入
    const tagInput = document.getElementById('tag-input') as HTMLInputElement;
    tagInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && tagInput.value.trim()) {
        this.addTag(tagInput.value.trim());
        tagInput.value = '';
      }
    });

    // 筛选按钮
    document.getElementById('filter-all')?.addEventListener('click', () => {
      this.setFilter('all');
    });
    document.getElementById('filter-favorites')?.addEventListener('click', () => {
      this.setFilter('favorites');
    });

    // 排序选择
    const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
    sortSelect?.addEventListener('change', () => {
      this.currentSort = sortSelect.value as 'updated' | 'created' | 'title';
      this.refreshNoteList();
    });
  }

  /**
   * 加载所有笔记
   */
  private loadNotes(): void {
    this.refreshNoteList();
  }

  /**
   * 刷新笔记列表
   */
  private refreshNoteList(): void {
    let notes: Note[] = [];

    if (this.currentFilter === 'all') {
      notes = this.noteManager.getAllNotes();
    } else if (this.currentFilter === 'favorites') {
      notes = this.noteManager.getFavoriteNotes();
    } else if (this.currentFilter === 'tag' && this.currentTag) {
      notes = this.noteManager.getNotesByTag(this.currentTag);
    }

    // 排序
    notes = this.sortNotes(notes);

    this.noteListComponent.render(notes);
  }

  /**
   * 排序笔记
   */
  private sortNotes(notes: Note[]): Note[] {
    return notes.sort((a, b) => {
      if (this.currentSort === 'updated') {
        return b.updatedAt - a.updatedAt;
      } else if (this.currentSort === 'created') {
        return b.createdAt - a.createdAt;
      } else {
        const titleA = this.noteManager.getNoteTitle(a).toLowerCase();
        const titleB = this.noteManager.getNoteTitle(b).toLowerCase();
        return titleA.localeCompare(titleB);
      }
    });
  }

  /**
   * 创建新笔记
   */
  private createNote(): void {
    try {
      const note = this.noteManager.createNote();
      this.refreshNoteList();
      this.editorComponent.loadNote(note.id);
      this.previewComponent.update('');
      this.updateCurrentTags();
      this.updateFavoriteButton();
      this.updateStats();
      this.toast.showSuccess('笔记创建成功');
    } catch (error) {
      this.toast.showError('创建笔记失败: ' + (error as Error).message);
    }
  }

  /**
   * 加载笔记到编辑器
   */
  private loadNoteToEditor(noteId: string): void {
    this.editorComponent.loadNote(noteId);
    const note = this.noteManager.getNote(noteId);
    if (note) {
      this.previewComponent.update(note.content);
      this.updateCurrentTags();
      this.updateFavoriteButton();
      this.updateStats();
    }
  }

  /**
   * 删除笔记
   */
  private async deleteNote(noteId: string): Promise<void> {
    const confirmed = await this.confirmDialog.show('确定要删除这篇笔记吗？');
    
    if (!confirmed) {
      return;
    }

    const success = this.noteManager.deleteNote(noteId);
    
    if (success) {
      // 如果删除的是正在编辑的笔记，清空编辑器
      if (this.editorComponent.getCurrentNoteId() === noteId) {
        this.editorComponent.clear();
        this.previewComponent.update('');
        this.updateCurrentTags();
        this.updateFavoriteButton();
        this.updateStats();
      }
      
      this.refreshNoteList();
      this.renderTags();
      this.toast.showSuccess('笔记已删除');
    }
  }

  /**
   * 切换收藏状态
   */
  private toggleFavorite(): void {
    const noteId = this.editorComponent.getCurrentNoteId();
    if (!noteId) {
      this.toast.showInfo('请先选择一篇笔记');
      return;
    }

    try {
      this.noteManager.toggleFavorite(noteId);
      this.updateFavoriteButton();
      this.refreshNoteList();
      this.toast.showSuccess('收藏状态已更新');
    } catch (error) {
      this.toast.showError('操作失败: ' + (error as Error).message);
    }
  }

  /**
   * 更新收藏按钮状态
   */
  private updateFavoriteButton(): void {
    const noteId = this.editorComponent.getCurrentNoteId();
    const favoriteBtn = document.getElementById('favorite-btn');
    
    if (!favoriteBtn || !noteId) {
      return;
    }

    const note = this.noteManager.getNote(noteId);
    if (note?.isFavorite) {
      favoriteBtn.classList.add('active');
    } else {
      favoriteBtn.classList.remove('active');
    }
  }

  /**
   * 添加标签
   */
  private addTag(tag: string): void {
    const noteId = this.editorComponent.getCurrentNoteId();
    if (!noteId) {
      this.toast.showInfo('请先选择一篇笔记');
      return;
    }

    try {
      this.noteManager.addTag(noteId, tag);
      this.updateCurrentTags();
      this.renderTags();
      this.refreshNoteList();
      this.toast.showSuccess(`标签 "${tag}" 已添加`);
    } catch (error) {
      this.toast.showError('添加标签失败: ' + (error as Error).message);
    }
  }

  /**
   * 移除标签
   */
  private removeTag(tag: string): void {
    const noteId = this.editorComponent.getCurrentNoteId();
    if (!noteId) {
      return;
    }

    try {
      this.noteManager.removeTag(noteId, tag);
      this.updateCurrentTags();
      this.renderTags();
      this.refreshNoteList();
      this.toast.showSuccess(`标签 "${tag}" 已移除`);
    } catch (error) {
      this.toast.showError('移除标签失败: ' + (error as Error).message);
    }
  }

  /**
   * 更新当前笔记的标签显示
   */
  private updateCurrentTags(): void {
    const noteId = this.editorComponent.getCurrentNoteId();
    const container = document.getElementById('current-tags');
    
    if (!container) {
      return;
    }

    if (!noteId) {
      container.innerHTML = '';
      return;
    }

    const note = this.noteManager.getNote(noteId);
    if (!note || !note.tags || note.tags.length === 0) {
      container.innerHTML = '<span style="color: #999; font-size: 12px; padding: 8px;">暂无标签</span>';
      return;
    }

    container.innerHTML = note.tags.map(tag => `
      <span class="current-tag">
        ${tag}
        <span class="remove-tag" data-tag="${tag}">×</span>
      </span>
    `).join('');

    // 添加移除标签的事件监听
    container.querySelectorAll('.remove-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = (btn as HTMLElement).dataset.tag;
        if (tag) {
          this.removeTag(tag);
        }
      });
    });
  }

  /**
   * 渲染所有标签
   */
  private renderTags(): void {
    const container = document.getElementById('tags-container');
    if (!container) {
      return;
    }

    const tags = this.noteManager.getAllTags();
    if (tags.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = tags.map(tag => `
      <span class="tag-chip" data-tag="${tag}">${tag}</span>
    `).join('');

    // 添加标签点击事件
    container.querySelectorAll('.tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = (chip as HTMLElement).dataset.tag;
        if (tag) {
          this.filterByTag(tag);
        }
      });
    });
  }

  /**
   * 按标签筛选
   */
  private filterByTag(tag: string): void {
    this.currentFilter = 'tag';
    this.currentTag = tag;
    this.refreshNoteList();
    
    // 更新筛选按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // 高亮选中的标签
    document.querySelectorAll('.tag-chip').forEach(chip => {
      if ((chip as HTMLElement).dataset.tag === tag) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  /**
   * 设置筛选器
   */
  private setFilter(filter: 'all' | 'favorites'): void {
    this.currentFilter = filter;
    this.currentTag = null;
    this.refreshNoteList();
    
    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    if (filter === 'all') {
      document.getElementById('filter-all')?.classList.add('active');
    } else if (filter === 'favorites') {
      document.getElementById('filter-favorites')?.classList.add('active');
    }
    
    // 清除标签高亮
    document.querySelectorAll('.tag-chip').forEach(chip => {
      chip.classList.remove('active');
    });
  }

  /**
   * 导出当前笔记
   */
  private exportCurrentNote(): void {
    const noteId = this.editorComponent.getCurrentNoteId();
    if (!noteId) {
      this.toast.showInfo('请先选择一篇笔记');
      return;
    }

    const note = this.noteManager.getNote(noteId);
    if (!note) {
      return;
    }

    const title = this.noteManager.getNoteTitle(note);
    exportNoteAsMarkdown(note, title);
    this.toast.showSuccess('笔记已导出');
  }

  /**
   * 导出所有笔记
   */
  private exportAll(): void {
    const notes = this.noteManager.getAllNotes();
    if (notes.length === 0) {
      this.toast.showInfo('暂无笔记可导出');
      return;
    }

    exportAllNotes(notes);
    this.toast.showSuccess(`已导出 ${notes.length} 篇笔记`);
  }

  /**
   * 更新统计信息
   */
  private updateStats(): void {
    const noteId = this.editorComponent.getCurrentNoteId();
    const note = noteId ? this.noteManager.getNote(noteId) : null;
    const allNotes = this.noteManager.getAllNotes();
    this.statsComponent.update(note, allNotes);
  }

  /**
   * 设置键盘快捷键
   */
  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Ctrl+S: 手动保存（实际上已经自动保存了，这里只是提示）
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.toast.showInfo('笔记已自动保存');
      }
      
      // Ctrl+N: 新建笔记
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        this.createNote();
      }
      
      // Ctrl+F: 聚焦搜索框
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        searchInput?.focus();
      }
      
      // Ctrl+E: 导出当前笔记
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        this.exportCurrentNote();
      }
    });
  }
}
