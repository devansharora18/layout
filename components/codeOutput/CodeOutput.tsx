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

  // Syntax highlighting helper
  const highlight = {
    tag: (text: string) => `<span style="color: #89b4fa">${text}</span>`,
    attr: (text: string) => `<span style="color: #f9e2af">${text}</span>`,
    string: (text: string) => `<span style="color: #a6e3a1">${text}</span>`,
    comment: (text: string) => `<span style="color: #6c7086; font-style: italic">${text}</span>`,
  };

  // Generate JSX + Tailwind code with syntax highlighting
  const generateJSX = (node: NodeModel, depth = 0): string => {
    const indent = "  ".repeat(depth);

    if (isLeaf(node)) {
      return `${indent}${highlight.comment(`{/* ${node.label} */}`)}`;
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

    return `${indent}${highlight.tag("&lt;div")} ${highlight.attr("className")}=${highlight.string(`"flex ${flexDir} w-full h-full"`)}${highlight.tag("&gt;")}\n${indent}  ${highlight.tag("&lt;div")} ${highlight.attr("className")}=${highlight.string(`"${flexClass1}"`)}${highlight.tag("&gt;")}\n${child1Code}\n${indent}  ${highlight.tag("&lt;/div&gt;")}\n${indent}  ${highlight.tag("&lt;div")} ${highlight.attr("className")}=${highlight.string(`"${flexClass2}"`)}${highlight.tag("&gt;")}\n${child2Code}\n${indent}  ${highlight.tag("&lt;/div&gt;")}\n${indent}${highlight.tag("&lt;/div&gt;")}`;
  };

  // Generate HTML + CSS code with syntax highlighting
  const generateHTML = (node: NodeModel, depth = 0): string => {
    const indent = "  ".repeat(depth);

    if (isLeaf(node)) {
      return `${indent}${highlight.comment(`&lt;!-- ${node.label} --&gt;`)}`;
    }

    // Split node
    const split = node;
    const flexDir = split.orientation === "row" ? "row" : "column";
    const [size1, size2] = split.sizes;
    const [child1, child2] = split.children;

    const child1Code = generateHTML(child1, depth + 1);
    const child2Code = generateHTML(child2, depth + 1);

    // Generate flex styles, omit when value is 1
    const flexStyle1 = size1 === 1 ? "display: flex;" : `display: flex; flex: ${size1.toFixed(3)};`;
    const flexStyle2 = size2 === 1 ? "display: flex;" : `display: flex; flex: ${size2.toFixed(3)};`;

    return `${indent}${highlight.tag("&lt;div")} ${highlight.attr("style")}=${highlight.string(`"display: flex; flex-direction: ${flexDir}; width: 100%; height: 100%;"`)}${highlight.tag("&gt;")}
${indent}  ${highlight.tag("&lt;div")} ${highlight.attr("style")}=${highlight.string(`"${flexStyle1}"`)}${highlight.tag("&gt;")}
${child1Code}
${indent}  ${highlight.tag("&lt;/div&gt;")}
${indent}  ${highlight.tag("&lt;div")} ${highlight.attr("style")}=${highlight.string(`"${flexStyle2}"`)}${highlight.tag("&gt;")}
${child2Code}
${indent}  ${highlight.tag("&lt;/div&gt;")}
${indent}${highlight.tag("&lt;/div&gt;")}`;
  };

  const jsxCode = generateJSX(root);
  const htmlCode = generateHTML(root);

  const { push } = useToast();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const copyToClipboard = (text: string) => {
    // Strip HTML tags for clipboard
    const plainText = text.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    navigator.clipboard.writeText(plainText).then(() => {
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
            <div className="absolute top-0 right-0 z-10">
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
            
            <div className="bg-[#1e1e2e] backdrop-blur-sm rounded-lg border border-[#313244] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#181825] border-b border-[#313244]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-[#f38ba8] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#f9e2af] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#a6e3a1] rounded-full"></div>
                </div>
                <span className="ml-2 text-[#cdd6f4] text-xs font-mono">
                  {activeTab === "jsx" ? "component.jsx" : "layout.html"}
                </span>
              </div>
              
              <pre className="custom-scrollbar text-[#cdd6f4] p-4 overflow-x-auto max-h-96 overflow-y-auto text-sm leading-relaxed font-mono">
                <code 
                  className="language-jsx"
                  dangerouslySetInnerHTML={{ 
                    __html: activeTab === "jsx" ? jsxCode : htmlCode 
                  }}
                />
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}