import { Square } from "@/components/Square";
import "@/index.css";

export default function App() {
  return (
    <main class="bg-black">
      <svg class="block" width={1200} height={1000} viewBox="0 0 1200 1000">
        <Square fill="green" />
        <Square fill="blue" initialPosition={{ x: 100, y: 50 }} />
      </svg>
    </main>
  );
}
