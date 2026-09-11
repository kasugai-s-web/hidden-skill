// 画像書き出し用：カードで実際に使う文字を含む @font-face だけを data: URL 化して返す
// （DotGothic16 は 120 以上のサブセットに分割されているため、全部埋め込むと重い）

const dataUrlCache = new Map<string, string>();

function parseUnicodeRange(range: string): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (const part of range.split(',')) {
    const m = /U\+([0-9A-F?]+)(?:-([0-9A-F]+))?/i.exec(part.trim());
    if (!m) continue;
    if (m[1].includes('?')) {
      out.push([parseInt(m[1].replace(/\?/g, '0'), 16), parseInt(m[1].replace(/\?/g, 'F'), 16)]);
    } else {
      const lo = parseInt(m[1], 16);
      out.push([lo, m[2] ? parseInt(m[2], 16) : lo]);
    }
  }
  return out;
}

function collectCodePoints(text: string): number[] {
  const set = new Set<number>();
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp !== undefined) set.add(cp);
  }
  return [...set];
}

async function toDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`font fetch failed: ${url}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function collectFontFaceRules(): CSSFontFaceRule[] {
  const rules: CSSFontFaceRule[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let list: CSSRuleList;
    try {
      list = sheet.cssRules;
    } catch {
      continue; // クロスオリジンのシートは読めない
    }
    for (const rule of Array.from(list)) {
      if (rule instanceof CSSFontFaceRule) rules.push(rule);
    }
  }
  return rules;
}

/**
 * html-to-image の fontEmbedCSS に渡す CSS を組み立てる。
 * text に含まれる文字を unicode-range がカバーする @font-face だけを埋め込む。
 */
export async function buildFontEmbedCss(text: string): Promise<string> {
  const codePoints = collectCodePoints(text);
  const parts: string[] = [];

  for (const rule of collectFontFaceRules()) {
    const rangeText = rule.style.getPropertyValue('unicode-range');
    if (rangeText) {
      const ranges = parseUnicodeRange(rangeText);
      const needed = codePoints.some((cp) => ranges.some(([lo, hi]) => cp >= lo && cp <= hi));
      if (!needed) continue;
    }

    const cssText = rule.cssText;
    const m = /url\(["']?([^"')]+)["']?\)/.exec(cssText);
    if (!m) continue;
    const abs = new URL(m[1], rule.parentStyleSheet?.href ?? location.href).href;

    let dataUrl = dataUrlCache.get(abs);
    if (!dataUrl) {
      try {
        dataUrl = await toDataUrl(abs);
        dataUrlCache.set(abs, dataUrl);
      } catch {
        continue;
      }
    }
    parts.push(cssText.replace(m[0], `url("${dataUrl}")`));
  }

  return parts.join('\n');
}
