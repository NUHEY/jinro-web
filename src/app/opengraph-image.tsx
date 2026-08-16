import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// 招待リンクを他のアプリ(LINEやX、メッセージアプリなど)で共有した時に表示される
// プレビュー画像。アプリのダーク×ゴールドのビジュアルテーマに合わせて生成する。
// フォントは next/og(satori)がデフォルトでは日本語グリフを持たないため、
// Noto Sans JP の TTF(japanese/latin/latin-ext サブセット)を同梱して埋め込む。
export const alt = "人狼DX オンライン";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(file: string) {
  return readFile(join(process.cwd(), "src/assets/fonts", file));
}

export default async function Image() {
  const [japanese, latin, latinExt] = await Promise.all([
    loadFont("NotoSansJP-700-japanese.ttf"),
    loadFont("NotoSansJP-700-latin.ttf"),
    loadFont("NotoSansJP-700-latin-ext.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0e1a 0%, #121729 55%, #1b2338 100%)",
          fontFamily: "NotoSansJP",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 128,
            height: 128,
            borderRadius: 9999,
            background: "rgba(251, 191, 36, 0.12)",
            marginBottom: 36,
          }}
        >
          {/* 三日月アイコン(2つの円をずらして重ねてくり抜く古典的な手法) */}
          <div style={{ position: "relative", width: 68, height: 68, display: "flex" }}>
            <div
              style={{
                position: "absolute",
                width: 68,
                height: 68,
                borderRadius: 9999,
                background: "#fbbf24",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -6,
                left: 20,
                width: 68,
                height: 68,
                borderRadius: 9999,
                background: "#121729",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            color: "#fbbf24",
            letterSpacing: "-0.02em",
          }}
        >
          人狼DX オンライン
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 32,
            fontWeight: 700,
            color: "#e8eaf2",
            opacity: 0.85,
          }}
        >
          会話と推理で仲間に隠れた人狼を見つけ出そう
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 44 }}>
          {["#f87171", "#60a5fa", "#a78bfa", "#34d399", "#fbbf24"].map((color) => (
            <div
              key={color}
              style={{
                width: 20,
                height: 20,
                borderRadius: 9999,
                background: color,
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "NotoSansJP", data: japanese, weight: 700, style: "normal" },
        { name: "NotoSansJP", data: latin, weight: 700, style: "normal" },
        { name: "NotoSansJP", data: latinExt, weight: 700, style: "normal" },
      ],
    }
  );
}
