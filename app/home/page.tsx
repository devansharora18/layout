import Canvas from "@/components/canvas/Canvas";
import CodeOutput from "@/components/codeOutput/CodeOutput";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col">

      <div className="container mx-auto px-4 py-10 flex flex-col items-center gap-10 w-full">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Layout Builder
          </h1>
        </header>

        <section className="flex flex-col items-center w-full gap-10">
          <Canvas />
          <CodeOutput />
        </section>

        <footer className="mt-4 text-xs text-gray-300/70">
          Work in progress
        </footer>
      </div>
    </main>
  );
}