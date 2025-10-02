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
          isViscous={true}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
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
            Layout Builder
          </h1>
          <p className="text-lg text-gray-100/90 mb-8 max-w-2xl">
            Create, visualize, and export flexible layouts with an interactive
            canvas. Split, resize, and rearrange divs to build your perfect
            layout structure.
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
              Click to select, drag borders to resize, and rearrange divs with
              intuitive drag-and-drop.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              Flexible Layouts
            </h3>
            <p className="text-gray-200/90">
              Create complex layouts with horizontal and vertical splits. Adjust
              sizes with precision.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              Export Code
            </h3>
            <p className="text-gray-200/90">
              Generate clean JSX + Tailwind or HTML + CSS code for your layouts
              instantly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
