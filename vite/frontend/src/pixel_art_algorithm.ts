const fileInput = document.querySelector<HTMLInputElement>("#upload")!;
const pixelatedImage = document.querySelector<HTMLImageElement>("#pixelatedImage")!;
const originalImage = pixelatedImage.cloneNode(true) as HTMLImageElement;
const pixelationElement = document.querySelector<HTMLInputElement>("#pixelationRange")!;

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (file) {
    pixelatedImage.src = await fileToDataUri(file);
    originalImage.src = await fileToDataUri(file);
    pixelationElement.value = "0";
  }
});

pixelationElement.addEventListener("input", (e) => {
  const target = e.target as HTMLInputElement;
  const pixelationFactor = parseInt(target.value, 10);
  pixelateImage(originalImage, pixelationFactor);
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

  const colors = extractColors(imageData);
  const sortedColors = mergeSort(colors, (a, b) => brightness(a) - brightness(b));
  console.log("Sorted Colors by Brightness:", sortedColors);
}

// Реализация MergeSort
function mergeSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compare);
  const right = mergeSort(arr.slice(mid), compare);

  return merge(left, right, compare);
}

function merge<T>(left: T[], right: T[], compare: (a: T, b: T) => number): T[] {
  const result: T[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) <= 0) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

function extractColors(imageData: Uint8ClampedArray): { r: number; g: number; b: number }[] {
  const colors: { r: number; g: number; b: number }[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const key = `${r},${g},${b}`;
    if (!seen.has(key)) {
      colors.push({ r, g, b });
      seen.add(key);
    }
  }

  return colors;
}

function brightness(color: { r: number; g: number; b: number }): number {
  return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b; // Формула яркости (Luminance)
}
