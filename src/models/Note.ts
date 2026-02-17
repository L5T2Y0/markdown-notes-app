/**
 * 笔记数据模型
 */
export interface Note {
  /** 唯一标识符（UUID v4） */
  id: string;
  
  /** Markdown 内容 */
  content: string;
  
  /** 创建时间戳（Unix 毫秒） */
  createdAt: number;
  
  /** 最后更新时间戳（Unix 毫秒） */
  updatedAt: number;
  
  /** 标签列表 */
  tags?: string[];
  
  /** 是否收藏 */
  isFavorite?: boolean;
}

/**
 * 验证笔记对象是否有效
 */
export function isValidNote(note: any): note is Note {
  if (!note || typeof note !== 'object') return false;
  
  // 验证 ID（简单的 UUID v4 格式检查）
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (typeof note.id !== 'string' || !uuidRegex.test(note.id)) return false;
  
  // 验证内容
  if (typeof note.content !== 'string') return false;
  
  // 验证时间戳
  if (typeof note.createdAt !== 'number' || note.createdAt <= 0) return false;
  if (typeof note.updatedAt !== 'number' || note.updatedAt <= 0) return false;
  if (note.updatedAt < note.createdAt) return false;
  
  // 验证时间戳在合理范围内（1970年至当前时间之后100年）
  const minTimestamp = 0;
  const maxTimestamp = Date.now() + (100 * 365 * 24 * 60 * 60 * 1000);
  if (note.createdAt < minTimestamp || note.createdAt > maxTimestamp) return false;
  if (note.updatedAt < minTimestamp || note.updatedAt > maxTimestamp) return false;
  
  return true;
}
