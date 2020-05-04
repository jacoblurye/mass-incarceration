import React from "react";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import sum from "lodash/sum";
import { Flex, Box, Heading } from "rebass";
import { Line } from "@nivo/line";
import plotTheme from "./plotTheme";
import { theme } from "../Theme";
import withResponsiveContainer from "./withResponsiveContainer";

const commonPlotProps = {
  animate: false,
  theme: plotTheme,
  useMesh: true,
  height: 500,
  lineWidth: 1,
  colors: ["#f47560", "#61cdbb"],
  enableArea: true,
  enableGridX: false,
  margin: { top: 30, right: 30, bottom: 50, left: 35 },
  xScale: { type: "time", format: "%Y-%m-%d", precision: "day" },
  xFormat: "time:%Y-%m-%d",
  yScale: { type: "linear", stacked: false },
  axisLeft: {
    legend: "Incarcerated People",
    legendOffset: -50,
    legendPosition: "middle",
  },
  legends: [
    {
      anchor: "top-left",
      direction: "row",
      justify: false,
      translateX: 0,
      translateY: -30,
      itemsSpacing: 10,
      itemDirection: "left-to-right",
      itemWidth: 120,
      itemHeight: 20,
      itemTextColor: "#fff",
      symbolShape: "circle",
      symbolBorderColor: "rgba(0, 0, 0, .5)",
      itemOpacity: 0.8,
      areaOpacity: 1,
    },
  ],
  tooltip: ({ point }) => {
    return (
      <Flex
        flexDirection="column"
        bg="background"
        my={1}
        p={1}
        fontSize={1}
        sx={{ borderRadius: 5 }}
        top={100}
      >
        <Box fontWeight="bold">{point.serieId}</Box>
        <Box>Prisoners: {point.data.yFormatted}</Box>
        <Box>Report Date: {point.data.xFormatted}</Box>
      </Flex>
    );
  },
};

const getTotals = (csvData) => {
  return map(groupBy(csvData, "report_date"), (data, date) => {
    const y = sum(map(data, "total_occupancy"));
    return { x: date, y };
  });
};

const getTotalsAtCapacity = (csvData) => {
  const overCapacity = csvData.filter((d) => d.percent_occupied >= 100);
  return map(groupBy(overCapacity, "report_date"), (data, date) => {
    const y = sum(map(data, "total_occupancy"));
    return { x: date, y };
  });
};

const makeEventMarker = (eventText, eventDate) => {
  const date = new Date(eventDate);
  const yTransform = commonPlotProps.height / (2 - eventText.length / 80);
  const transform = `rotate(-90deg) translate(-${yTransform}px, -12px)`;

  return {
    axis: "x",
    value: date,
    lineStyle: {
      stroke: plotTheme.axis.ticks.line.stroke,
      strokeWidth: 1,
      strokeDasharray: "2 2",
      color: theme.colors.text,
    },
    textStyle: {
      fill: theme.colors.text,
      fontSize: ".8em",
      transform,
    },
    legend: eventText,
  };
};

const markers = [
  makeEventMarker("MA's first official COVID-19 case", "2020-02-01"),
  makeEventMarker("MA declares state of emergency", "2020-03-11"),
  makeEventMarker("MA issues shelter in place", "2020-03-24"),
  makeEventMarker("MA Supreme Court rules on SJC-12926", "2020-04-03"),
];

const OverallTimelinePlot = ({ title, csvData, width }) => {
  const stateTotals = getTotals(csvData);
  const capacityTotals = getTotalsAtCapacity(csvData);
  const data = [
    {
      id: "Overcrowded County Facilities",
      data: capacityTotals,
      lineWidth: 0,
    },
    { id: "All County Facilities", data: stateTotals, lineWidth: 0 },
  ];
  return (
    <>
      <Heading textAlign="center" m={3}>
        {title}
      </Heading>
      <Line
        {...commonPlotProps}
        data={data}
        width={width}
        height={500}
        axisBottom={{
          format: "%b %d",
          tickValues: width < 1200 ? "every 2 weeks" : "every week",
          tickRotation: width < 800 ? -90 : 0,
        }}
        markers={markers}
      ></Line>
    </>
  );
};

export default withResponsiveContainer(OverallTimelinePlot);
