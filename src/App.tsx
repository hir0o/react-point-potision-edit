import { PureComponent, useEffect, useRef, useState } from "react";
import "./App.css";

type Point = {
  x: number;
  y: number;
};

type SelectablePoint = Point & {
  id: string;
  selected: boolean;
  target: boolean;
};

function App() {
  const [isDrag, setIsDrag] = useState(false);
  const [isPointDrag, setIsPointDrag] = useState(false);
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState<Point>({ x: 0, y: 0 });
  const [startPointDrag, setStartPointDrag] = useState<Point>({ x: 0, y: 0 });
  const [endPointDrag, setEndPointDrag] = useState<Point>({ x: 0, y: 0 });
  const [targetPointId, setTargetPointId] = useState("");
  const targetPointRef = useRef<HTMLDivElement>(null);
  const [pointList, setPointList] = useState<SelectablePoint[]>([
    {
      id: "point1",
      x: 400,
      y: 400,
      selected: false,
      target: false,
    },
    {
      id: "point2",
      x: 500,
      y: 500,
      selected: false,
      target: false,
    },
    {
      id: "point3",
      x: 600,
      y: 600,
      selected: false,
      target: false,
    },
    {
      id: "point4",
      x: 700,
      y: 700,
      selected: false,
      target: false,
    },
    {
      id: "point5",
      x: 800,
      y: 800,
      selected: false,
      target: false,
    },
    {
      id: "point6",
      selected: false,
      target: false,
      x: 514,
      y: 399,
    },
    {
      id: "point7",
      selected: false,
      target: false,
      x: 932,
      y: 78,
    },
    {
      id: "point8",
      selected: false,
      target: false,
      x: 430,
      y: 218,
    },
    {
      id: "point9",
      selected: false,
      target: false,
      x: 200,
      y: 395,
    },
    {
      id: "point10",
      selected: false,
      target: false,
      x: 383,
      y: 624,
    },
    {
      id: "point11",
      selected: false,
      target: false,
      x: 581,
      y: 411,
    },
    {
      id: "point12",
      selected: false,
      target: false,
      x: 427,
      y: 411,
    },
    {
      id: "point13",
      selected: false,
      target: false,
      x: 384,
      y: 551,
    },
    {
      id: "point14",
      selected: false,
      target: false,
      x: 284,
      y: 557,
    },
    {
      id: "point15",
      selected: false,
      target: false,
      x: 353,
      y: 445,
    },
    {
      id: "point16",
      selected: false,
      target: false,
      x: 353,
      y: 364,
    },
    {
      id: "point17",
      selected: false,
      target: false,
      x: 378,
      y: 339,
    },
    {
      id: "point18",
      selected: false,
      target: false,
      x: 508,
      y: 328,
    },
    {
      id: "point19",
      selected: false,
      target: false,
      x: 572,
      y: 323,
    },
    {
      id: "point20",
      selected: false,
      target: false,
      x: 640,
      y: 281,
    },
    {
      id: "point21",
      selected: false,
      target: false,
      x: 615,
      y: 266,
    },
    {
      id: "point22",
      selected: false,
      target: false,
      x: 523,
      y: 320,
    },
    {
      id: "point23",
      selected: false,
      target: false,
      x: 441,
      y: 320,
    },
    {
      id: "point24",
      selected: false,
      target: false,
      x: 307,
      y: 320,
    },
    {
      id: "point25",
      selected: false,
      target: false,
      x: 486,
      y: 554,
    },
    {
      id: "point26",
      selected: false,
      target: false,
      x: 848,
      y: 395,
    },
    {
      id: "point27",
      selected: true,
      target: false,
      x: 848,
      y: 597,
    },
  ]);

  const getSelectorStyle = () => {
    if (startPoint.x === endPoint.x && startPoint.y === endPoint.y) {
      return {};
    }
    if (startPoint.x <= endPoint.x && startPoint.y <= endPoint.y) {
      return {
        left: startPoint.x,
        top: startPoint.y,
        width: endPoint.x - startPoint.x,
        height: endPoint.y - startPoint.y,
      };
    } else if (startPoint.x > endPoint.x && startPoint.y <= endPoint.y) {
      return {
        left: endPoint.x,
        top: startPoint.y,
        width: startPoint.x - endPoint.x,
        height: endPoint.y - startPoint.y,
      };
    } else if (startPoint.x <= endPoint.x && startPoint.y > endPoint.y) {
      return {
        left: startPoint.x,
        top: endPoint.y,
        width: endPoint.x - startPoint.x,
        height: startPoint.y - endPoint.y,
      };
    } else {
      return {
        left: endPoint.x,
        top: endPoint.y,
        width: startPoint.x - endPoint.x,
        height: startPoint.y - endPoint.y,
      };
    }
  };

  const isPointEnter = (point: Point) => {
    if (startPoint.x === endPoint.x && startPoint.y === endPoint.y) {
      return false;
    }
    if (startPoint.x <= endPoint.x && startPoint.y <= endPoint.y) {
      return (
        point.x >= startPoint.x &&
        point.x <= endPoint.x &&
        point.y >= startPoint.y &&
        point.y <= endPoint.y
      );
    } else if (startPoint.x > endPoint.x && startPoint.y <= endPoint.y) {
      return (
        point.x >= endPoint.x &&
        point.x <= startPoint.x &&
        point.y >= startPoint.y &&
        point.y <= endPoint.y
      );
    }
    if (startPoint.x <= endPoint.x && startPoint.y > endPoint.y) {
      return (
        point.x >= startPoint.x &&
        point.x <= endPoint.x &&
        point.y >= endPoint.y &&
        point.y <= startPoint.y
      );
    }
    if (startPoint.x > endPoint.x && startPoint.y > endPoint.y) {
      return (
        point.x >= endPoint.x &&
        point.x <= startPoint.x &&
        point.y >= endPoint.y &&
        point.y <= startPoint.y
      );
    }
    return false;
  };

  useEffect(() => {
    if (
      startPoint.x === 0 &&
      startPoint.y === 0 &&
      endPoint.x === 0 &&
      endPoint.y === 0
    ) {
      return;
    }
    setPointList(
      pointList.map((point) => {
        return {
          ...point,
          selected: isPointEnter(point),
        };
      })
    );
  }, [startPoint, endPoint]);

  return (
    <div
      className="main"
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).className === "point") {
          setTargetPointId((e.target as HTMLElement).id);
          return;
        }
        setIsDrag(true);
        setStartPoint({ x: e.clientX, y: e.clientY });
        setEndPoint({ x: e.clientX, y: e.clientY });
      }}
      onMouseUp={() => {
        setIsDrag(false);
        setTargetPointId("");
        setStartPoint({ x: 0, y: 0 });
        setEndPoint({ x: 0, y: 0 });
      }}
      onMouseMove={(e) => {
        if (isDrag && targetPointId === "") {
          // 図面をドラッグ
          setEndPoint({ x: e.clientX, y: e.clientY });
        } else if (targetPointId !== "" && targetPointRef.current !== null) {
          setEndPoint({ x: 0, y: 0 });
          setStartPoint({ x: 0, y: 0 });
          // ポイントをドラッグした時のポイントとマウスのoffset距離
          const offsetX = e.clientX - Number(targetPointRef.current.dataset!.x);
          const offsetY = e.clientY - Number(targetPointRef.current.dataset!.y);

          // 算出したoffsetを元にポイントを移動
          setPointList(
            pointList.map((point) => {
              if (point.selected) {
                return {
                  ...point,
                  x: point.x + offsetX,
                  y: point.y + offsetY,
                };
              }
              return point;
            })
          );
        }
      }}
    >
      <div className="selector" style={getSelectorStyle()}></div>
      {pointList.map((point) => (
        <div
          key={point.id}
          className="point"
          ref={point.id === targetPointId ? targetPointRef : null}
          // data-enter={isPointEnter(point)}
          data-selected={point.selected}
          id={point.id}
          data-x={point.x}
          data-y={point.y}
          style={{
            left: point.x,
            top: point.y,
          }}
        />
      ))}
    </div>
  );
}

export default App;
