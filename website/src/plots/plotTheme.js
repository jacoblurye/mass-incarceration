import { theme } from "../Theme";

const plotTheme = {
  axis: {
    ticks: {
      line: {
        stroke: theme.colors.text,
        opacity: 0.5,
      },
      text: {
        fill: theme.colors.text,
      },
    },
    legend: {
      text: {
        fill: theme.colors.text,
      },
    },
  },
  tooltip: {
    container: {
      color: "inherit",
      backgroundColor: theme.colors.background,
    },
  },
  crosshair: {
    line: {
      stroke: theme.colors.text,
      opacity: 0.5,
    },
  },
  grid: {
    line: {
      stroke: theme.colors.text,
      opacity: 0.2,
    },
  },
};

export default plotTheme;
