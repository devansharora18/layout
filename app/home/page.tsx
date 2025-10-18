import Canvas from "@/components/canvas/Canvas";
import CodeOutput from "@/components/codeOutput/CodeOutput";
import Navigation from "@/components/ui/Navigation";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navigation />

      <main className="relative pt-16 min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-8 w-full flex-1">
          {/* <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Layout Builder
            </h1>
            <p className="text-gray-300/80 text-lg max-w-2xl mx-auto">
              Create responsive layouts visually. Split, resize, and rearrange panes to build your perfect layout.
            </p>
          </header> */}

          <section className="flex flex-col items-center w-full gap-8 flex-1">
            <Canvas />
            <CodeOutput />
          </section>
          <footer>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>A</span>
                <a
                  href="https://devansharora.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Devansh Arora
                </a>
                <span>Production</span>
              </div>
          </footer>
        </div>
      </main>
    </div>
  );
}