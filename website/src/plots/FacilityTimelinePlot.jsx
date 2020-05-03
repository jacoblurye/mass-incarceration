import React from "react";
import maxBy from "lodash/maxBy";
import { Line } from "@nivo/line";
import { Heading, Flex, Box } from "rebass";
import plotTheme from "./plotTheme";
import { theme } from "../Theme";

const commonPlotProps = {
  animate: false,
  theme: plotTheme,
  useMesh: true,
  width: 340,
  height: 300,
  // curve: "basis",
  colors: ["#f47560", "#61cdbb"],
  enableGridX: false,
  margin: { top: 10, right: 30, bottom: 50, left: 35 },
  xScale: { type: "time", format: "%Y-%m-%d", precision: "day" },
  xFormat: "time:%Y-%m-%d",
  axisLeft: {
    legend: "Incarcerated People",
    legendOffset: -50,
    legendPosition: "middle",
  },
  tooltip: ({ point }) => {
    console.log(point);
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
        <Box>Prisoners: {point.data.yFormatted}</Box>
        <Box>% Capacity: {point.data.datum.percent_occupied}%</Box>
        <Box>Report Date: {point.data.xFormatted}</Box>
      </Flex>
    );
  },
};

const FacilityTimelinePlot = ({ facility, csvData }) => {
  const facilityData = csvData.filter((d) => d.facility === facility);
  const occupancyMax = maxBy(csvData, "total_occupancy").total_occupancy;
  const capacityMax = maxBy(csvData, "operational_capacity")
    .operational_capacity;
  const data = facilityData.map((d) => ({
    x: d.report_date,
    y: d.total_occupancy,
    datum: d,
  }));
  const capacity = facilityData[0].operational_capacity;

  return (
    <>
      <Heading textAlign="center" fontSize={2} marginTop={2}>
        {facility}
      </Heading>
      <Line
        {...commonPlotProps}
        data={[{ data }]}
        axisBottom={{
          format: "%b %d",
          tickValues: "every 4 weeks",
          tickRotation: -90,
        }}
        axisLeft={{
          tickValues: 4,
        }}
        gridYValues={4}
        yScale={{
          type: "linear",
          stacked: false,
          max: Math.max(capacityMax, occupancyMax) + 250,
        }}
        markers={[
          {
            axis: "y",
            value: capacity,
            lineStyle: {
              stroke: plotTheme.axis.ticks.line.stroke,
              strokeWidth: 1,
              strokeDasharray: "2 2",
              color: theme.colors.text,
            },
            textStyle: {
              fill: theme.colors.text,
              fontSize: ".8em",
            },
            legend: "Prison Capacity",
          },
        ]}
      ></Line>
    </>
  );
};

export default FacilityTimelinePlot;
