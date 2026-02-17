import { Note } from '../models/Note';
import { countWords, countCharacters } from '../utils/export';

/**
 * 统计信息组件
 */
export class StatsComponent {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  /**
   * 更新统计信息
   */
  update(note: Note | null, allNotes: Note[]): void {
    if (!note) {
      this.element.innerHTML = `
        <div class="stats">
          <span>总笔记数: ${allNotes.length}</span>
        </div>
      `;
      return;
    }

    const words = countWords(note.content);
    const chars = countCharacters(note.content);
    const lines = note.content.split('\n').length;

    this.element.innerHTML = `
      <div class="stats">
        <span>字数: ${words}</span>
        <span>字符: ${chars}</span>
        <span>行数: ${lines}</span>
        <span>总笔记: ${allNotes.length}</span>
      </div>
    `;
  }
}
