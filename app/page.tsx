import Canvas from "@/components/canvas/Canvas";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-bold">Layout</h1>
      <Canvas />
    </main>
  );
}