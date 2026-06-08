import { parse, formatHex, oklch, interpolate, samples } from "culori";

export interface Shade {
  step: number;
  hex: string;
  oklch: string;
  onWhiteContrast: number;
  onBlackContrast: number;
}

export interface Palette {
  name: string;
  shades: Shade[];
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function relLuminance(hex: string): number {
  const c = parse(hex) as any;
  if (!c) return 0;
  const toLinear = (v: number) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(c.r ?? 0) + 0.7152 * toLinear(c.g ?? 0) + 0.0722 * toLinear(c.b ?? 0);
}

export function generatePalette(baseHex: string, name = "primary"): Palette {
  const base = oklch(parse(baseHex)!);
  if (!base) throw new Error("Invalid color");

  const { h = 0 } = base;
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  // Interpolate from near-white to near-black in OKLCH, keeping hue
  const lightnesses = [0.98, 0.95, 0.90, 0.82, 0.70, 0.56, 0.45, 0.36, 0.27, 0.18, 0.12];
  const chromas     = [0.01, 0.03, 0.06, 0.09, 0.13, 0.18, 0.16, 0.13, 0.10, 0.07, 0.05];

  const shades: Shade[] = steps.map((step, i) => {
    const color = { mode: "oklch" as const, l: lightnesses[i], c: chromas[i], h };
    const hex = formatHex(color) ?? "#000000";
    const lum = relLuminance(hex);
    return {
      step,
      hex,
      oklch: `oklch(${(lightnesses[i] * 100).toFixed(0)}% ${chromas[i].toFixed(3)} ${h.toFixed(1)})`,
      onWhiteContrast: parseFloat(contrastRatio(1, lum).toFixed(2)),
      onBlackContrast: parseFloat(contrastRatio(lum, 0).toFixed(2)),
    };
  });

  return { name, shades };
}

export function toCSSVars(palette: Palette): string {
  return [
    ":root {",
    ...palette.shades.map(s => `  --color-${palette.name}-${s.step}: ${s.hex};`),
    "}",
  ].join("\n");
}

export function toTailwindConfig(palette: Palette): string {
  const entries = palette.shades.map(s => `    ${s.step}: "${s.hex}",`).join("\n");
  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        ${palette.name}: {\n${entries}\n        },\n      },\n    },\n  },\n};\n`;
}
