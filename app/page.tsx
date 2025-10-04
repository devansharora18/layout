import LiquidEther from "@/components/liquidEther/LiquidEther";
import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function Home() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      title: "Interactive Canvas",
      description: "Split panes horizontally or vertically, add new panes, resize by dragging, reset with double-click, and rearrange panes by dragging onto another.",
      badge: "Drag & Drop"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Real-Time Code",
      description: "Instantly generate JSX + Tailwind or HTML + CSS with proportional flex values. Copy the output with one click.",
      badge: "Live Updates"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Developer-Friendly",
      description: "Uses a binary state tree for layout management. Actions include split, resize, rearrange, delete, and reset. Simple, fast, and easy to extend.",
      badge: "Performance"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
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

      <Navigation />

      <main className="relative pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="flex flex-col items-center justify-center text-center space-y-8">
            <div className="space-y-6">
              <Badge variant="info" size="sm">
                🚀 New: Real-time code generation
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                Build Layouts
                <br />
                <span className="text-white">Visually</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed">
                A powerful web tool that lets developers quickly create and test responsive layouts. 
                Split screens, adjust proportions, and instantly generate clean code in JSX + Tailwind or HTML + CSS.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/home">
                <Button variant="primary" size="lg">
                  Get Started Free
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              
              <Button variant="secondary" size="lg" href="https://github.com/devansharora18/layout">
                <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                View Source
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-gray-300/70 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Open source</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Free forever</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to build layouts
            </h2>
            <p className="text-lg text-gray-300/80 max-w-2xl mx-auto">
              Powerful features designed to accelerate your development workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <Badge variant="success" size="sm">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200/90 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Demo Preview Section */}
        <section className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              See it in action
            </h2>
            <p className="text-lg text-gray-300/80 max-w-2xl mx-auto mb-8">
              Watch how easy it is to create complex layouts and generate production-ready code
            </p>
            <Link href="/home">
              <Button variant="primary" size="lg">
                Try Interactive Demo
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a4 4 0 118 0v2M7 16h10" />
                </svg>
              </Button>
            </Link>
          </div>

          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-gray-400 text-sm">Layout Builder</span>
              </div>
              <div className="bg-gray-800/80 rounded-lg p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                <div className="text-purple-400">&#47;&#47; Generated JSX + Tailwind</div>
                <div className="mt-2">
                  <span className="text-blue-400">&lt;div</span>
                  <span className="text-green-400"> className=</span>
                  <span className="text-yellow-400">&quot;flex h-screen&quot;</span>
                  <span className="text-blue-400">&gt;</span>
                </div>
                <div className="ml-4">
                  <span className="text-blue-400">&lt;div</span>
                  <span className="text-green-400"> className=</span>
                  <span className="text-yellow-400">&quot;flex-1 bg-blue-500&quot;</span>
                  <span className="text-blue-400">&gt;</span>
                  <span className="text-gray-400">Sidebar</span>
                  <span className="text-blue-400">&lt;/div&gt;</span>
                </div>
                <div className="ml-4">
                  <span className="text-blue-400">&lt;div</span>
                  <span className="text-green-400"> className=</span>
                  <span className="text-yellow-400">&quot;flex-[3] bg-gray-100&quot;</span>
                  <span className="text-blue-400">&gt;</span>
                  <span className="text-gray-400">Main Content</span>
                  <span className="text-blue-400">&lt;/div&gt;</span>
                </div>
                <div>
                  <span className="text-blue-400">&lt;/div&gt;</span>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Roadmap Section */}
        {/* Roadmap Section */}
        <section className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What&apos;s coming next
            </h2>
            <p className="text-lg text-gray-300/80 max-w-2xl mx-auto">
              We&apos;re constantly improving and adding new features to enhance your workflow
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Upcoming Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                  <span className="text-gray-200/90">Undo / Redo history (last 50 actions)</span>
                  <Badge variant="warning" size="sm">Soon</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                  <span className="text-gray-200/90">Breakpoint model (layouts per screen size)</span>
                  <Badge variant="warning" size="sm">Soon</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                  <span className="text-gray-200/90">Export to multiple frameworks</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                  <span className="text-gray-200/90">Grid layout support</span>
                </div>
              
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 max-w-7xl">
          <Card className="text-center">
            <CardHeader>
              <div className="max-w-3xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to build amazing layouts?
                </h2>
                <p className="text-lg text-gray-200/90">
                  Join developers who are already using Layout Builder to accelerate their workflow.
                  Start creating beautiful, responsive layouts in minutes.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/home">
                  <Button variant="primary" size="lg">
                    Start Building Now
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Button variant="outline" size="lg" href="https://github.com/devansharora18/layout">
                  Star on GitHub
                  <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.956a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.375 2.451a1 1 0 00-.364 1.118l1.286 3.956c.3.921-.755 1.688-1.538 1.118L10 13.347l-3.375 2.451c-.783.57-1.838-.197-1.538-1.118l1.286-3.956a1 1 0 00-.364-1.118L2.634 9.383c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Built with ❤️ by</span>
                <a
                  href="https://github.com/devansharora18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  @devansharora18
                </a>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a
                  href="https://github.com/devansharora18/layout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://github.com/devansharora18/layout/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Issues
                </a>
                <a
                  href="https://github.com/devansharora18/layout/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  License
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
