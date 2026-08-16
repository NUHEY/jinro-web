"use client";

// アップロードされた画像ファイルを、プロフィール写真として使うのに十分な
// 小さな正方形サムネイル(data URL)にリサイズ・圧縮するユーティリティ。
// ソケット経由で全員にブロードキャストされるため、できるだけ軽量に保つ。

const AVATAR_SIZE = 160; // px (正方形に切り抜き)
const JPEG_QUALITY = 0.82;
export const MAX_AVATAR_SOURCE_BYTES = 8 * 1024 * 1024; // 元ファイルの上限(8MB)

export class AvatarTooLargeError extends Error {}
export class AvatarUnsupportedError extends Error {}

export async function fileToAvatarDataUrl(file: File): Promise<string> {
  if (file.size > MAX_AVATAR_SOURCE_BYTES) {
    throw new AvatarTooLargeError("file too large");
  }
  if (!file.type.startsWith("image/")) {
    throw new AvatarUnsupportedError("not an image");
  }

  const bitmap = await loadBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_SIZE;
    canvas.height = AVATAR_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d context unavailable");

    // 中央を正方形にクロップしてから等倍リサイズする
    const srcSize = Math.min(bitmap.width, bitmap.height);
    const srcX = (bitmap.width - srcSize) / 2;
    const srcY = (bitmap.height - srcSize) / 2;
    ctx.drawImage(bitmap, srcX, srcY, srcSize, srcSize, 0, 0, AVATAR_SIZE, AVATAR_SIZE);

    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } finally {
    bitmap.close?.();
  }
}

async function loadBitmap(file: File): Promise<ImageBitmap & { close?: () => void }> {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }
  // createImageBitmap非対応環境向けのフォールバック
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("image decode failed"));
    el.src = dataUrl;
  });
  return img as unknown as ImageBitmap & { close?: () => void };
}
