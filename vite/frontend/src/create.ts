document.addEventListener('DOMContentLoaded', () => {
    const backToMainLink = document.getElementById('main-btn') as HTMLAnchorElement;


    if (backToMainLink) {
        backToMainLink.addEventListener('click', () => {
            window.location.href = 'main.html';
        });
    }


});

// Файл: create.ts
import { UndoRedoStack } from './UndoRedoStack'; // Импорт класса

const fileInput = document.querySelector<HTMLInputElement>("#upload")!;
const pixelatedImage = document.querySelector<HTMLImageElement>("#pixelatedImage")!;
const originalImage = pixelatedImage.cloneNode(true) as HTMLImageElement;
const pixelationElement = document.querySelector<HTMLInputElement>("#pixelationRange")!;

const undoBtn = document.getElementById('undoBtn') as HTMLButtonElement;
const redoBtn = document.getElementById('redoBtn') as HTMLButtonElement;

// Создаем экземпляр стека
const stack = new UndoRedoStack();

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (file) {
    pixelatedImage.src = await fileToDataUri(file);
    originalImage.src = await fileToDataUri(file);
    pixelationElement.value = "0";
    stack.addState(pixelatedImage.src);  // Сохраняем состояние изображения
  }
});

pixelationElement.addEventListener("input", (e) => {
  const target = e.target as HTMLInputElement;
  const pixelationFactor = parseInt(target.value, 10);
  pixelateImage(originalImage, pixelationFactor);
  stack.addState(pixelatedImage.src);  // Сохраняем состояние после изменения пикселизации
});

undoBtn.addEventListener("click", () => {
  const previousState = stack.undo();
  if (previousState !== null) {
    pixelatedImage.src = previousState;  // Восстанавливаем предыдущее состояние
  }
});

redoBtn.addEventListener("click", () => {
  const nextState = stack.redo();
  if (nextState !== null) {
    pixelatedImage.src = nextState;  // Восстанавливаем повторенное состояние
  }
});

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result as string);
    });
    reader.readAsDataURL(file);
  });
}

function pixelateImage(originalImage: HTMLImageElement, pixelationFactor: number): void {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;

  const originalWidth = originalImage.width;
  const originalHeight = originalImage.height;

  canvas.width = originalWidth;
  canvas.height = originalHeight;
  context.drawImage(originalImage, 0, 0, originalWidth, originalHeight);

  const imageData = context.getImageData(0, 0, originalWidth, originalHeight).data;

  if (pixelationFactor !== 0) {
    for (let y = 0; y < originalHeight; y += pixelationFactor) {
      for (let x = 0; x < originalWidth; x += pixelationFactor) {
        const pixelIndex = (x + y * originalWidth) * 4;

        context.fillStyle = `rgba(
          ${imageData[pixelIndex]},
          ${imageData[pixelIndex + 1]},
          ${imageData[pixelIndex + 2]},
          ${imageData[pixelIndex + 3] / 255}
        )`;
        context.fillRect(x, y, pixelationFactor, pixelationFactor);
      }
    }
  }

  pixelatedImage.src = canvas.toDataURL();
}
