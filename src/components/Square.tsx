import { createSignal, onSettled } from "solid-js";

// Square size as a fraction of the smaller viewport dimension.
const SIZE_RATIO = 0.25;

const clamp = (value: number, max: number) =>
  Math.min(Math.max(0, max), Math.max(0, value));

// Convert a pointer event to coordinates in the SVG's user space.
const toSvgPoint = (svg: SVGSVGElement, event: PointerEvent) => {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(svg.getScreenCTM()!.inverse());
};

export const Square = (props: {
  fill: string;
  initialPosition?: { x: number; y: number };
}) => {
  const [viewport, setViewport] = createSignal({ width: 0, height: 0 });
  const [pos, setPos] = createSignal({ x: 0, y: 0 });
  const [dragging, setDragging] = createSignal(false);

  let box: SVGRectElement | undefined;
  let initialized = false;

  // Offset between the pointer and the box origin, in SVG coordinates.
  let grabOffset: { x: number; y: number } | null = null;

  const size = () => Math.min(viewport().width, viewport().height) * SIZE_RATIO;

  const maxPos = () => ({
    x: Math.max(0, viewport().width - size()),
    y: Math.max(0, viewport().height - size()),
  });

  onSettled(() => {
    const svg = box?.ownerSVGElement;
    if (!svg) return;

    const update = () => {
      const { width, height } = svg.getBoundingClientRect();
      setViewport({ width, height });

      const side = Math.min(width, height) * SIZE_RATIO;
      const maxX = Math.max(0, width - side);
      const maxY = Math.max(0, height - side);

      if (!initialized && width > 0 && height > 0) {
        initialized = true;
        const initial = props.initialPosition;
        setPos(
          initial
            ? { x: clamp(initial.x, maxX), y: clamp(initial.y, maxY) }
            : { x: maxX / 2, y: maxY / 2 },
        );
      } else {
        // Keep the square inside the viewport when it resizes.
        setPos((current) => ({
          x: clamp(current.x, maxX),
          y: clamp(current.y, maxY),
        }));
      }
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(svg);
    return () => observer.disconnect();
  });

  const stopDragging = (event: PointerEvent, box: SVGRectElement) => {
    grabOffset = null;
    setDragging(false);
    if (box.hasPointerCapture(event.pointerId)) {
      box.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <rect
      ref={box}
      id="square"
      x={pos().x}
      y={pos().y}
      width={size()}
      height={size()}
      fill={props.fill}
      style={{
        cursor: dragging() ? "grabbing" : "grab",
        "touch-action": "none",
      }}
      onPointerDown={(event) => {
        const svg = event.currentTarget.ownerSVGElement!;
        const point = toSvgPoint(svg, event);
        grabOffset = {
          x: point.x - pos().x,
          y: point.y - pos().y,
        };
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!grabOffset) return;
        const svg = event.currentTarget.ownerSVGElement!;
        const point = toSvgPoint(svg, event);
        const { x, y } = maxPos();
        setPos({
          x: clamp(point.x - grabOffset.x, x),
          y: clamp(point.y - grabOffset.y, y),
        });
      }}
      onPointerUp={(event) => stopDragging(event, event.currentTarget)}
      onPointerCancel={(event) => stopDragging(event, event.currentTarget)}
    />
  );
};
