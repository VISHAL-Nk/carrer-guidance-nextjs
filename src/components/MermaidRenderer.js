"use client";
import mermaid from "mermaid";
import { useEffect, useId, useState } from "react";

export default function MermaidRenderer({ code, config }) {
  const [svg, setSvg] = useState("");
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    async function render() {
      try {
        mermaid.initialize({ startOnLoad: false, securityLevel: "loose", theme: "default", ...config });
        const { svg } = await mermaid.render(`mmd-${id}`, code);
        if (!cancelled) setSvg(svg);
      } catch (e) {
        console.error("Mermaid render error", e);
        if (!cancelled) setSvg("<pre class=\"text-red-600\">Failed to render diagram</pre>");
      }
    }
    render();
    return () => { cancelled = true; };
  }, [code, config, id]);

  if (!code) return null;
  return (
    <div className="overflow-auto" dangerouslySetInnerHTML={{ __html: svg || `<pre class='p-3 border rounded bg-gray-50 whitespace-pre-wrap overflow-auto text-sm'>${code.replace(/</g, "&lt;")}</pre>` }} />
  );
}
