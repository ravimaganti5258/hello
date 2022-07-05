import * as shape from 'd3-shape';

export const getPath = (width, height, centerWidth) => {
  const circleWidth = centerWidth + 16;

  const line = shape
    .line()
    .x((d) => d.x)
    .y((d) => d.y)([
      { x: (width - circleWidth) / 2 + circleWidth + 20, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height },
      { x: 0, y: 0 },
      { x: (width - circleWidth) / 2 - 20, y: 0 },
    ]);

    const curved = shape
    .line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(shape.curveBasis)([

      { x: (width - circleWidth) / 2 - 20, y: 0 }, // border center left
      { x: (width - circleWidth) / 2 - 10, y: 2 },
      { x: (width - circleWidth) / 2 - 2, y: 10 },
      { x: (width - circleWidth) / 2, y: 13 },

      { x: width / 2 - circleWidth / 2 + 8, y: height / 2 + 1 },
      { x: width / 2 - 10, y: height / 2 + 10 },
      { x: width / 2, y: height / 2 + 10 },
      { x: width / 2 + 10, y: height / 2 + 10 },
      { x: width / 2 + circleWidth / 2 - 8, y: height / 2 + 1 },

      { x: (width - circleWidth) / 2 + circleWidth, y: 13 }, // border center right
      { x: (width - circleWidth) / 2 + circleWidth + 2, y: 10 },
      { x: (width - circleWidth) / 2 + circleWidth + 10, y: 2 },
      { x: (width - circleWidth) / 2 + circleWidth + 20, y: 0 },

    ], line);

  const path = `${curved} ${line}`;

  return path;
};
