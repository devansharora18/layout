"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { type NodeModel, isLeaf } from "@/store/layoutSlice";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import Card, { CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function CodeOutput() {
  const root = useSelector((s: RootState) => s.layout.root);
  const [activeTab, setActiveTab] = useState<"jsx" | "html">("jsx");

  // Generate JSX + Tailwind code
  const generateJSX = (node: NodeModel, depth = 0): string => {
    const indent = "  ".repeat(depth);

    if (isLeaf(node)) {
      return `${indent}{/* ${node.label} */}`;
    }

    // Split node
    const split = node;
    const flexDir = split.orientation === "row" ? "flex-row" : "flex-col";
    const [size1, size2] = split.sizes;
    const [child1, child2] = split.children;

    const child1Code = generateJSX(child1, depth + 1);
    const child2Code = generateJSX(child2, depth + 1);

    // Generate flex classes, omit when value is 1
    const flexClass1 = size1 === 1 ? "flex" : `flex flex-[${size1.toFixed(3)}]`;
    const flexClass2 = size2 === 1 ? "flex" : `flex flex-[${size2.toFixed(3)}]`;

    return `${indent}<div className="flex ${flexDir} w-full h-full">\n${indent}  <div className="${flexClass1}">\n${child1Code}\n${indent}  </div>\n${indent}  <div className="${flexClass2}">\n${child2Code}\n${indent}  </div>\n${indent}</div>`;
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
  background-color: #f3f4f6;
  padding: 1rem;
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
  gap: 0.25rem;
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

  const { push } = useToast();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      push({ 
        title: "Code copied!", 
        description: `${activeTab === "jsx" ? "JSX + Tailwind" : "HTML + CSS"} snippet copied to clipboard`, 
        variant: "success", 
        duration: 2000 
      });
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-5xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Generated Code
              </CardTitle>
              <Badge variant="success" size="sm">Real-time</Badge>
            </div>
            
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "jsx"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
                onClick={() => setActiveTab("jsx")}
              >
                JSX + Tailwind
              </button>
              <button
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "html"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
                onClick={() => setActiveTab("html")}
              >
                HTML + CSS
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="relative">
            <div className="absolute top-3 right-3 z-10">
              <Button
                variant={copied ? "secondary" : "outline"}
                size="sm"
                onClick={() => copyToClipboard(activeTab === "jsx" ? jsxCode : htmlCode)}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="ml-2 text-gray-400 text-xs font-mono">
                  {activeTab === "jsx" ? "component.jsx" : "layout.html"}
                </span>
              </div>
              
              <pre className="custom-scrollbar text-gray-100 p-4 overflow-x-auto max-h-96 overflow-y-auto text-sm leading-relaxed font-mono">
                <code className="language-jsx">
                  {activeTab === "jsx" ? jsxCode : htmlCode}
                </code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}