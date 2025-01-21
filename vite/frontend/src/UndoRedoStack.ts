// Файл: UndoRedoStack.ts
export class UndoRedoStack {
  private historyStack: string[] = [];
  private redoStack: string[] = [];

  // Добавление состояния в историю
  addState(state: string): void {
    this.historyStack.push(state);
    this.redoStack = []; // Очистка redoStack при добавлении нового состояния
  }

  // Отмена действия
  undo(): string | null {
    if (this.historyStack.length > 1) {
      const currentState = this.historyStack.pop()!;
      this.redoStack.push(currentState);
      return this.historyStack[this.historyStack.length - 1];
    }
    return null;
  }

  // Повтор действия
  redo(): string | null {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop()!;
      this.historyStack.push(state);
      return state;
    }
    return null;
  }

  // Получение текущего состояния
  getCurrentState(): string {
    return this.historyStack[this.historyStack.length - 1];
  }

  // Проверка, можно ли отменить действие
  canUndo(): boolean {
    return this.historyStack.length > 1;
  }

  // Проверка, можно ли повторить действие
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  // Сброс истории
  reset(): void {
    this.historyStack = [];
    this.redoStack = [];
  }

  // Получение всех состояний в истории
  getHistory(): string[] {
    return [...this.historyStack]; // Возвращаем копию истории
  }

  // Получение всех состояний в redoStack
  getRedoHistory(): string[] {
    return [...this.redoStack]; // Возвращаем копию redoStack
  }
}
