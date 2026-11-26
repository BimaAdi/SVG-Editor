import { Square } from "@/components/Square";
import "@/index.css";

export default function App() {
  return (
    <main class="bg-black">
      <svg
        class="block border border-white"
        width={1200}
        height={1000}
        viewBox="0 0 1200 1000"
      >
        <Square fill="green" />
        <Square
          fill="blue"
          initialPosition={{ x: 100, y: 100 }}
          width={200}
          height={200}
        />
      </svg>
    </main>
  );
}
