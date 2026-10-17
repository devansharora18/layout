"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { type NodeModel, isLeaf } from "@/store/layoutSlice";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import Card, { CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { toJsonSpec, toPrompt } from "@/lib/layoutSpec";
import { CropMarks } from "@/components/ui/sheet";

/* Monochrome syntax theme: the palette carries one accent, so it is spent on the
   strings — which in a layout export are the flex ratios, i.e. the values you are
   actually reading the file to find. */
const highlight = {
  tag: (text: string) => `<span style="color: var(--lp-ink)">${text}</span>`,
  attr: (text: string) => `<span style="color: var(--lp-mute)">${text}</span>`,
  string: (text: string) => `<span style="color: var(--lp-signal)">${text}</span>`,
  comment: (text: string) => `<span style="color: var(--lp-faint); font-style: italic">${text}</span>`,
};

const TABS = [
  { id: "jsx", label: "JSX + Tailwind", file: "component.jsx" },
  { id: "html", label: "HTML + CSS", file: "layout.html" },
  { id: "json", label: "JSON spec", file: "layout.json" },
  { id: "prompt", label: "LLM prompt", file: "layout-prompt.txt" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Tabs that render verbatim text — no syntax markup, and copy must not strip them. */
const PLAIN_TABS: TabId[] = ["json", "prompt"];

export default function CodeOutput() {
  const root = useSelector((s: RootState) => s.layout.root);
  const [activeTab, setActiveTab] = useState<TabId>("jsx");

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

  /* The same serialisers the landing page uses, so the prompt and the spec the
     tool hands out can never drift from the tree it is showing. */
  const output =
    activeTab === "jsx"
      ? jsxCode
      : activeTab === "html"
        ? htmlCode
        : activeTab === "json"
          ? toJsonSpec(root)
          : toPrompt(root);
  const isPlain = PLAIN_TABS.includes(activeTab);
  const activeTabMeta = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  const { push } = useToast();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const copyToClipboard = () => {
    // The highlighted tabs carry HTML markup that has to be stripped. The plain
    // tabs are verbatim and must be copied as-is — a prompt contains "<ratio>",
    // which the tag-stripping regex would happily delete.
    const text = isPlain
      ? output
      : output.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      push({ 
        title: "Copied to clipboard", 
        description: `${activeTabMeta.label} copied`, 
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
        <CropMarks />
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="h-3.5 w-3.5 text-signal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Generated code
              </CardTitle>
              <Badge variant="success" size="sm">Real-time</Badge>
            </div>

            <div role="tablist" aria-label="Export format" className="flex flex-wrap items-center gap-4">
              {TABS.map((tab) => {
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    className={`relative border-b-2 pb-0.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-150 ${
                      selected
                        ? "border-signal text-ink"
                        : "border-transparent text-faint hover:text-mute"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border border-rule bg-well">
            <div className="flex items-center gap-3 border-b border-rule px-3 py-2">
              <span aria-hidden="true" className="flex gap-1">
                <span className="h-1.5 w-1.5 bg-rule-2" />
                <span className="h-1.5 w-1.5 bg-rule-2" />
              </span>
              <span className="font-mono text-[11px] tracking-[0.08em] text-faint">
                {activeTabMeta.file}
              </span>
              <Button
                className="ml-auto"
                variant={copied ? "secondary" : "outline"}
                size="sm"
                onClick={copyToClipboard}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </Button>
            </div>

            <pre className="custom-scrollbar max-h-96 overflow-x-auto overflow-y-auto p-4 font-mono text-[12px] leading-[1.7] text-mute">
              {isPlain ? (
                <code>{output}</code>
              ) : (
                <code className="language-jsx" dangerouslySetInnerHTML={{ __html: output }} />
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}