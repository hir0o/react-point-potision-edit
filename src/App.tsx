import { useEffect, useRef, useState } from "react";
import "./App.css";
import { dummyPoint } from "./dummyPoint";

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
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState<Point>({ x: 0, y: 0 });
  const [targetPointId, setTargetPointId] = useState("");
  const targetPointRef = useRef<HTMLDivElement>(null);
  const [pointList, setPointList] = useState<SelectablePoint[]>(dummyPoint);

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

  const getBoundingBox = () => {
    const { xMin, xMax, yMin, yMax } = pointList.reduce(
      (acc, point) => {
        if (point.selected) {
          return {
            xMin: Math.min(acc.xMin, point.x),
            xMax: Math.max(acc.xMax, point.x),
            yMin: Math.min(acc.yMin, point.y),
            yMax: Math.max(acc.yMax, point.y),
          };
        }
        return acc;
      },
      { xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity }
    );

    return {
      xMin,
      xMax,
      yMin,
      yMax,
    };
  };

  const getBoundingBoxStyle = () => {
    const { xMin, xMax, yMin, yMax } = getBoundingBox();
    return {
      left: xMin - 5,
      top: yMin - 5,
      width: xMax - xMin + 10,
      height: yMax - yMin + 10,
    };
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
          // ポイントを移動
        } else if (targetPointId !== "" && targetPointRef.current !== null) {
          setEndPoint({ x: 0, y: 0 });
          setStartPoint({ x: 0, y: 0 });
          // ポイントをドラッグした時のポイントとマウスのoffset距離
          const offsetX = e.clientX - Number(targetPointRef.current.dataset!.x);
          const offsetY = e.clientY - Number(targetPointRef.current.dataset!.y);

          // 算出したoffsetを元にポイントを移動
          setPointList(
            pointList.map((point) => {
              if (!point.selected) return point;
              return {
                ...point,
                x: point.x + offsetX,
                y: point.y + offsetY,
              };
            })
          );
        }
      }}
    >
      <div className="selector" style={getSelectorStyle()} />
      {/* <div className="manager" style={getManagerStyle()} /> */}
      <div className="bounding-box" style={getBoundingBoxStyle()} />
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
