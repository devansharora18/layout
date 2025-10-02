"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { type NodeModel, isLeaf } from "@/store/layoutSlice";
import { useState } from "react";

export default function CodeOutput() {
  const root = useSelector((s: RootState) => s.layout.root);
  const [activeTab, setActiveTab] = useState<"jsx" | "html">("jsx");

  // Generate JSX + Tailwind code
  const generateJSX = (node: NodeModel, depth = 0): string => {
    const indent = "  ".repeat(depth);

    if (isLeaf(node)) {
      return `${indent}<div className="flex-1">\n${indent}  {/* ${node.label} */}\n${indent}</div>`;
    }

    // Split node
    const split = node;
    const flexDir = split.orientation === "row" ? "flex-row" : "flex-col";
    const [size1, size2] = split.sizes;
    const [child1, child2] = split.children;

    const child1Code = generateJSX(child1, depth + 1);
    const child2Code = generateJSX(child2, depth + 1);

    return `${indent}<div className="flex ${flexDir} w-full h-full">\n${indent}  <div className="flex" style={{ flex: ${size1.toFixed(3)} }}>\n${child1Code}\n${indent}  </div>\n${indent}  <div className="flex" style={{ flex: ${size2.toFixed(3)} }}>\n${child2Code}\n${indent}  </div>\n${indent}</div>`;
  };

  // Generate HTML + CSS code
  const generateHTML = (node: NodeModel): { html: string; css: string } => {
    let cssCounter = 0;
    const cssRules: string[] = [];

    const generateHTMLRecursive = (n: NodeModel, depth = 0): string => {
      const indent = "  ".repeat(depth);

      if (isLeaf(n)) {
        const className = `leaf-${cssCounter++}`;
        cssRules.push(`.${className} {
  flex: 1;
}`);
        return `${indent}<div class="${className}"><!-- ${n.label} --></div>`;
      }

      // Split node
      const split = n;
      const containerClass = `container-${cssCounter++}`;
      const flexDir = split.orientation === "row" ? "row" : "column";
      
      cssRules.push(`.${containerClass} {
  display: flex;
  flex-direction: ${flexDir};
  width: 100%;
  height: 100%;
}`);

      const [size1, size2] = split.sizes;
      const [child1, child2] = split.children;

      const child1Class = `child-${cssCounter++}`;
      const child2Class = `child-${cssCounter++}`;

      cssRules.push(`.${child1Class} {
  display: flex;
  flex: ${size1.toFixed(3)};
}`);

      cssRules.push(`.${child2Class} {
  display: flex;
  flex: ${size2.toFixed(3)};
}`);

      const child1HTML = generateHTMLRecursive(child1, depth + 2);
      const child2HTML = generateHTMLRecursive(child2, depth + 2);

      return `${indent}<div class="${containerClass}">
${indent}  <div class="${child1Class}">
${child1HTML}
${indent}  </div>
${indent}  <div class="${child2Class}">
${child2HTML}
${indent}  </div>
${indent}</div>`;
    };

    const html = generateHTMLRecursive(node, 0);
    const css = cssRules.join("\n\n");

    return { html, css };
  };

  const jsxCode = generateJSX(root);
  const { html, css } = generateHTML(root);

  const htmlCode = `<!-- HTML -->\n${html}\n\n<!-- CSS -->\n<style>\n${css}\n</style>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log("Copied to clipboard!");
    });
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-3 mt-4">
      <div className="flex gap-2 border-b border-white/20">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "jsx"
              ? "border-b-2 border-indigo-400 text-indigo-300"
              : "text-gray-300 hover:text-white"
          }`}
          onClick={() => setActiveTab("jsx")}
        >
          JSX + Tailwind
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "html"
              ? "border-b-2 border-indigo-400 text-indigo-300"
              : "text-gray-300 hover:text-white"
          }`}
          onClick={() => setActiveTab("html")}
        >
          HTML + CSS
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => copyToClipboard(activeTab === "jsx" ? jsxCode : htmlCode)}
          className="absolute top-2 right-2 px-3 py-1 text-xs bg-white/15 backdrop-blur-md border border-white/25 text-white rounded hover:bg-white/25 z-10"
        >
          Copy
        </button>
        <pre className="custom-scrollbar bg-black/60 backdrop-blur-xl text-indigo-100 p-4 rounded-xl overflow-x-auto max-h-96 overflow-y-auto border border-white/15 shadow-inner text-xs leading-relaxed">
          <code>{activeTab === "jsx" ? jsxCode : htmlCode}</code>
        </pre>
      </div>
    </div>
  );
}
