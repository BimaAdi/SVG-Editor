import { createSignal } from "solid-js";
import { Button } from "@/components/Button";
import "@/index.css";

export default function App() {
  const [count, setCount] = createSignal(0);
  const [res, setRes] = createSignal("{}");

  const getRandomNumber = async () => {
    const response = await fetch("/api/random");

    if (response.ok) {
      const jsonResponse = await response.json();
      setRes(JSON.stringify(jsonResponse));
    }
  };

  return (
    <main class="w-screen h-screen grid place-items-center">
      <div class="flex flex-col items-center gap-2">
        <Button
          onClick={() => setCount((c) => c + 1)}
          label={`Clicked ${count()} times`}
        />
        <Button onClick={() => getRandomNumber()} label="call the api" />
        <pre>{res()}</pre>
      </div>
    </main>
  );
}
