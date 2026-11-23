import { Square } from "@/components/Square";
import "@/index.css";

export default function App() {
  return (
    <svg class="block h-dvh w-full bg-black">
      <Square fill="green" />
      <Square fill="blue" initialPosition={{ x: 100, y: 50 }} />
    </svg>
  );
}
