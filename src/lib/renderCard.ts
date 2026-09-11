// DOM ノードを PNG（data URL）にする
// html-to-image の toPng は内部で requestAnimationFrame を待つため、
// タブが非表示（バックグラウンド）だと完了しないことがある。
// ここでは toSvg までを使い、ラスタライズは自前の <canvas> で行う。
import { toSvg } from 'html-to-image';
import { buildFontEmbedCss } from './fontEmbed';

interface Options {
  pixelRatio?: number;
  backgroundColor?: string;
  timeoutMs?: number;
}

function loadImage(src: string, timeoutMs: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => reject(new Error('image load timeout')), timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error('image load failed'));
    };
    img.src = src;
  });
}

export async function renderNodeToPng(node: HTMLElement, options: Options = {}): Promise<string> {
  const { pixelRatio = 2, backgroundColor = '#050614', timeoutMs = 15000 } = options;

  if ('fonts' in document) await document.fonts.ready;

  // カードで実際に使う文字ぶんのフォントだけ埋め込む（全サブセットを埋め込むと重い）
  const fontEmbedCSS = await buildFontEmbedCss(`${node.textContent ?? ''}★☆“`);
  const svgDataUrl = await toSvg(node, { fontEmbedCSS, backgroundColor });
  const img = await loadImage(svgDataUrl, timeoutMs);

  const width = node.offsetWidth;
  const height = node.offsetHeight;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas not supported');
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}
