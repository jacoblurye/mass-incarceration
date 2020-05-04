import React from "react";
import maxBy from "lodash/maxBy";
import { Line } from "@nivo/line";
import { Heading, Flex, Box, Text } from "rebass";
import plotTheme from "./plotTheme";
import { theme } from "../Theme";

const commonPlotProps = {
  animate: false,
  theme: plotTheme,
  useMesh: true,
  width: 340,
  height: 300,
  lineWidth: 1,
  pointSize: 5,
  enableArea: true,
  areaOpacity: 0.5,
  enableGridX: false,
  margin: { top: 10, right: 30, bottom: 50, left: 60 },
  xScale: { type: "time", format: "%Y-%m-%d", precision: "day" },
  xFormat: "time:%Y-%m-%d",
  axisLeft: {
    legend: "Incarcerated People",
    legendOffset: -50,
    legendPosition: "middle",
  },
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
        <Box>% Occupied: {point.data.yFormatted}%</Box>
        <Box>Prisoners: {point.data.datum.total_occupancy}</Box>
        <Box>Report Date: {point.data.xFormatted}</Box>
      </Flex>
    );
  },
};

const colors = ["#f47560", "#e8c1a0", "#61cdbb"];
const crowdingLevel = (d) =>
  d.percent_occupied >= 100 ? 0 : d.percent_occupied >= 90 ? 1 : 2;

const makePoint = (d) => ({
  y: d.percent_occupied,
  x: d.report_date,
  datum: d,
});

const FacilityTimelinePlot = ({ facility, csvData }) => {
  const facilityData = csvData.filter((d) => d.facility === facility);
  const series = facilityData.reduce((acc, d) => {
    const crowded = crowdingLevel(d);
    const serie =
      acc.length > 0 ? acc[acc.length - 1] : { id: crowded, data: [] };
    if (serie.id === crowded) {
      const data = [...serie.data, makePoint(d)];
      return [...acc.slice(0, acc.length - 1), { id: crowded, data }];
    } else {
      return [...acc, { id: crowded, data: [makePoint(d)] }];
    }
  }, []);
  const joinedSeries = series.reduce((acc, serie, i) => {
    if (series.length === i + 1) {
      return [...acc, serie];
    }
    const nextSerie = series[i + 1];
    const joinedSerie = {
      id: serie.id,
      data: [...serie.data, nextSerie.data[0]],
    };
    return [...acc, joinedSerie];
  }, []);

  const yMax = maxBy(facilityData, "percent_occupied").percent_occupied;
  const capacity = facilityData[0].operational_capacity;

  return (
    <>
      <Heading textAlign="center" fontSize={2} marginTop={2}>
        {facility}
      </Heading>
      <Text fontSize={1} textAlign="center">
        capacity: {capacity}
      </Text>
      <Line
        {...commonPlotProps}
        data={joinedSeries}
        colors={(d) => colors[d.id]}
        axisBottom={{
          format: "%b %d",
          tickValues: "every 4 weeks",
          tickRotation: -90,
        }}
        axisLeft={{
          tickValues: 3,
          format: (y) => `${y}%`,
          legend: "% Occupied",
          legendOffset: -50,
          legendPosition: "middle",
        }}
        gridYValues={3}
        yScale={{
          type: "linear",
          stacked: false,
          max: yMax <= 125 ? 125 : undefined,
          min: 0,
        }}
        markers={[
          {
            axis: "y",
            value: 100,
            lineStyle: {
              stroke: plotTheme.axis.ticks.line.stroke,
              strokeWidth: 3,
              strokeDasharray: "3 2",
              color: theme.colors.text,
            },
          },
        ]}
      ></Line>
    </>
  );
};

export default FacilityTimelinePlot;
