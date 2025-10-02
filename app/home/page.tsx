import Canvas from "@/components/canvas/Canvas";
import CodeOutput from "@/components/codeOutput/CodeOutput";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen gap-6 py-8">
      <h1 className="text-3xl font-bold">Layout (this project is not yet finished)</h1>
      <Canvas />
      <CodeOutput />
    </main>
  );
}