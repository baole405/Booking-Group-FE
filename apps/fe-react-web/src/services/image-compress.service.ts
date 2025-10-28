import { encode } from "@jsquash/webp";

const loadImage = async (file: File) => {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);

  await new Promise((resolve) => {
    img.onload = resolve;
    img.onerror = resolve;
  });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  context?.drawImage(img, 0, 0);

  return context?.getImageData(0, 0, img.width, img.height);
};

export const compressImageToWebp = async (file: File): Promise<File> => {
  const imageData = await loadImage(file);

  if (!imageData) {
    throw new Error("Unable to read image for compression");
  }

  const webpBuffer = await encode(imageData);
  const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

  return new File([webpBuffer], `${nameWithoutExtension}.webp`, {
    type: "image/webp",
  });
};
