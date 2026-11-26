import { createSignal, onSettled } from "solid-js";

// Default box size in viewBox units.
const DEFAULT_SIZE = 100;

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
  width?: number;
  height?: number;
  initialPosition?: { x: number; y: number };
}) => {
  const [scene, setScene] = createSignal({ width: 0, height: 0 });
  const [pos, setPos] = createSignal({ x: 0, y: 0 });
  const [dragging, setDragging] = createSignal(false);

  let box: SVGRectElement | undefined;

  // Offset between the pointer and the box origin, in SVG coordinates.
  let grabOffset: { x: number; y: number } | null = null;

  // Geometry is expressed in viewBox units. The canvas has a fixed pixel size,
  // so user units map 1:1 to CSS pixels and resizing the window never changes
  // the square's position or size.
  const boxWidth = () => props.width ?? DEFAULT_SIZE;
  const boxHeight = () => props.height ?? DEFAULT_SIZE;

  const maxPos = () => ({
    x: Math.max(0, scene().width - boxWidth()),
    y: Math.max(0, scene().height - boxHeight()),
  });

  onSettled(() => {
    const svg = box?.ownerSVGElement;
    if (!svg) return;

    const { width, height } = svg.viewBox.baseVal;
    if (width <= 0 || height <= 0) return;

    setScene({ width, height });

    const maxX = Math.max(0, width - boxWidth());
    const maxY = Math.max(0, height - boxHeight());
    const initial = props.initialPosition;

    setPos(
      initial
        ? { x: clamp(initial.x, maxX), y: clamp(initial.y, maxY) }
        : { x: maxX / 2, y: maxY / 2 },
    );
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
      width={boxWidth()}
      height={boxHeight()}
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
