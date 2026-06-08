import { useState } from "react";
import { generatePalette, toCSSVars, toTailwindConfig, type Palette } from "./utils/colorUtils";

export default function App() {
  const [hex, setHex] = useState("#6366f1");
  const [name, setName] = useState("primary");
  const [palette, setPalette] = useState<Palette | null>(null);
  const [exportFmt, setExportFmt] = useState<"css" | "tailwind" | "json">("css");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = () => {
    try {
      const p = generatePalette(hex, name);
      setPalette(p);
      setError("");
    } catch {
      setError("Invalid hex color");
    }
  };

  const exportCode = () => {
    if (!palette) return "";
    if (exportFmt === "css")      return toCSSVars(palette);
    if (exportFmt === "tailwind") return toTailwindConfig(palette);
    return JSON.stringify(Object.fromEntries(palette.shades.map(s => [s.step, s.hex])), null, 2);
  };

  const copy = () => {
    navigator.clipboard.writeText(exportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">ColorSystem</h1>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)}
          className="w-12 h-10 rounded cursor-pointer border-0" />
        <input value={hex} onChange={e => setHex(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm w-32" placeholder="#6366f1" />
        <input value={name} onChange={e => setName(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm w-32" placeholder="primary" />
        <button onClick={generate} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-sm">
          Generate
        </button>
        {error && <span className="text-red-400 text-sm self-center">{error}</span>}
      </div>

      {palette && (
        <>
          <div className="flex gap-1 mb-6 flex-wrap">
            {palette.shades.map(s => (
              <div key={s.step} className="flex flex-col items-center gap-1 cursor-pointer"
                onClick={() => { setHex(s.hex); navigator.clipboard.writeText(s.hex); }}>
                <div className="w-12 h-12 rounded" style={{ backgroundColor: s.hex }} title={s.hex} />
                <span className="text-xs text-gray-500">{s.step}</span>
                <span className="text-xs text-gray-600">{s.hex}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            {(["css", "tailwind", "json"] as const).map(fmt => (
              <button key={fmt} onClick={() => setExportFmt(fmt)}
                className={`px-3 py-1 text-xs rounded border ${exportFmt === fmt ? "bg-gray-700 border-gray-500" : "border-gray-700 hover:bg-gray-800"}`}>
                {fmt.toUpperCase()}
              </button>
            ))}
            <button onClick={copy} className="ml-auto text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <pre className="bg-gray-900 rounded p-4 text-xs overflow-auto max-h-64 text-gray-300">
            {exportCode()}
          </pre>
        </>
      )}
    </div>
  );
}
