import LiquidEther from "@/components/liquidEther/LiquidEther";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* LiquidEther Background */}
      <div className="absolute inset-0 -z-10 pointer-events-auto">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.25}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={1000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
            Responsive Layout Builder
          </h1>
          <p className="text-lg text-gray-100/90 mb-8 max-w-3xl">
            A web tool that lets developers quickly create and test page
            layouts. Split the screen into sections, adjust them, and instantly
            see generated code in JSX + Tailwind or HTML + CSS.
          </p>
          <div className="flex gap-4">
            <Link
              href="/home"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/devansharora18/layout"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 mb-16">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              Interactive Canvas
            </h3>
            <p className="text-gray-200/90">
              Split panes horizontally or vertically, add new panes, resize by
              dragging, reset with double-click, and rearrange panes by dragging
              onto another.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              Real-Time Code
            </h3>
            <p className="text-gray-200/90">
              Instantly generate JSX + Tailwind or HTML + CSS with proportional
              flex values. Copy the output with one click.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              Developer-Friendly
            </h3>
            <p className="text-gray-200/90">
              Uses a binary state tree for layout management. Actions include
              split, resize, rearrange, delete, and reset. Simple, fast, and
              easy to extend.
            </p>
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Features to be Impemented</h2>
          <ul className="text-gray-200/90 list-disc list-inside space-y-2 text-left">
            <li>Undo / Redo history (last 50 actions)</li>
            <li>Breakpoint model (layouts per screen size)</li>
            <li>LocalStorage save & auto-restore</li>
          </ul>
        </div>

        
      </div>
    </main>
  );
}
