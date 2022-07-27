import { useEffect, useRef, useState } from "react";
import "./App.css";
import { dummyPoint } from "./dummyPoint";
import { RotateIcon } from "./RotateIcon";

type Point = {
  x: number;
  y: number;
  px?: number;
  py?: number;
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
  const [isRotate, setIsRotate] = useState(false);
  const [rotate, setRotate] = useState(0);
  const boundingBoxRef = useRef<HTMLDivElement>(null);
  const prevAngle = useRef(0);
  const prevStyle = useRef<CSSStyleDeclaration>({});

  const getSelectorStyle = () => {
    if (isRotate) return {};
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

  const getBoundingCenter = () => {
    if (boundingBoxRef.current === null) return { x: 0, y: 0 };
    const xmin = boundingBoxRef.current.offsetLeft;
    const xmax =
      boundingBoxRef.current.offsetLeft + boundingBoxRef.current.offsetWidth;
    const ymin = boundingBoxRef.current.offsetTop;
    const ymax =
      boundingBoxRef.current.offsetTop + boundingBoxRef.current.offsetHeight;

    return {
      x: (xmin + xmax) / 2,
      y: (ymin + ymax) / 2,
    };
  };

  const getBoundingBoxStyle = () => {
    const { xMin, xMax, yMin, yMax } = getBoundingBox();
    if (
      xMin === Infinity ||
      xMax === -Infinity ||
      yMin === Infinity ||
      yMax === -Infinity
    ) {
      return {};
    }

    if (isRotate) {
      return prevStyle.current;
    }

    prevStyle.current = {
      left: xMin - 5 - 1,
      top: yMin - 5 - 1,
      width: xMax - xMin + 10,
      height: yMax - yMin + 10,
    };

    return prevStyle.current;
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

    if (isRotate) return;
    setPointList(
      pointList.map((point) => {
        return {
          ...point,
          selected: isPointEnter(point),
        };
      })
    );
  }, [startPoint, endPoint, isRotate]);

  return (
    <div
      className="main"
      id="base"
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).className === "point") {
          setTargetPointId((e.target as HTMLElement).id);
          return;
        }
        // if ((e.target as HTMLElement).id === "base") {
        setIsDrag(true);
        setStartPoint({ x: e.clientX, y: e.clientY });
        setEndPoint({ x: e.clientX, y: e.clientY });
        setPointList((prev) =>
          prev.map((point) => ({ ...point, px: point.x, py: point.y }))
        );
        // }
      }}
      onMouseUp={() => {
        setIsDrag(false);
        setIsRotate(false);
        setTargetPointId("");
        setStartPoint({ x: 0, y: 0 });
        setEndPoint({ x: 0, y: 0 });
      }}
      onMouseMove={(e) => {
        if (isDrag && targetPointId === "") {
          // 図面をドラッグ
          setEndPoint({ x: e.clientX, y: e.clientY });

          if (isRotate) {
            if (boundingBoxRef.current === null) return;
            const { x, y } = getBoundingCenter();
            const angle = Math.atan2(e.clientY - y, e.clientX - x);
            const startAngle = Math.atan2(startPoint.y - y, startPoint.x - x);
            const angleDiff = angle - startAngle;

            // dom elementを回転させる
            const boundingBox = boundingBoxRef.current;
            boundingBox.style.transform = `rotate(${
              (angleDiff * 180) / Math.PI
            }deg)`;

            setPointList(
              pointList.map((point) => {
                if (!point.selected) return point;
                // bbを中心としたx,y座標
                const xbb = point.px! - x;
                const ybb = point.py! - y;

                // bbを中心としたx,y座標を回転させる
                const xnew =
                  xbb * Math.cos(angleDiff) - ybb * Math.sin(angleDiff);
                const ynew =
                  xbb * Math.sin(angleDiff) + ybb * Math.cos(angleDiff);

                console.log(x, y, xbb, ybb, xnew, ynew);

                // 回転後のx,y座標を元の位置に戻す
                const xnew2 = xnew + x;
                const ynew2 = ynew + y;

                return {
                  ...point,
                  x: xnew2,
                  y: ynew2,
                };
              })
            );
          }
          // ポイントを移動
        } else if (targetPointId !== "" && targetPointRef.current !== null) {
          setEndPoint({ x: 0, y: 0 });
          setStartPoint({ x: 0, y: 0 });
          // ポイントをドラッグした時のポイントとマウスの距離
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
      <div
        className="bounding-box"
        ref={boundingBoxRef}
        style={getBoundingBoxStyle()}
      >
        <div className="bounding-box-inner">
          <div
            className="rotate"
            onMouseDown={(e) => {
              setIsRotate(true);
            }}
          >
            <RotateIcon />
          </div>
        </div>
      </div>
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

      <div
        className="point"
        style={{
          left: getBoundingCenter().x,
          top: getBoundingCenter().y,
          backgroundColor: "red",
        }}
      ></div>
    </div>
  );
}

export default App;
