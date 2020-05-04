import React from "react";
import { map, maxBy, minBy, sum, groupBy } from "lodash";
import { Heading } from "rebass";
import { Line } from "@nivo/line";
import plotTheme from "./plotTheme";
import { theme } from "../Theme";
import withResponsiveContainer from "./withResponsiveContainer";
import Tooltip from "./Tooltip";
import events from "../data/events";

const config = { height: 500, colors: ["#f47560", "#61cdbb"] };

const sliceTooltip = ({ slice }) => {
  const overallDatum = maxBy(slice.points, (p) => p.data.yFormatted);
  const crowdedDatum = minBy(slice.points, (p) => p.data.yFormatted);
  return (
    <Tooltip
      entries={[
        {
          label: "Prisoners (All)",
          value: overallDatum.data.yFormatted,
          color: config.colors[1],
        },
        {
          label: "Prisoners (Crowded)",
          value: crowdedDatum.data.yFormatted,
          color: config.colors[0],
        },
        {
          label: "Report Date",
          value: overallDatum.data.xFormatted,
        },
      ]}
    />
  );
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

const OverallTimelinePlot = ({ title, csvData, width, height: height_ }) => {
  const height = height_ || config.height;
  const stateTotals = getTotals(csvData);
  const capacityTotals = getTotalsAtCapacity(csvData);
  const data = [
    {
      id: "Crowded Prisons",
      data: capacityTotals,
      lineWidth: 0,
    },
    { id: "All Prisons", data: stateTotals, lineWidth: 0 },
  ];

  const eventMarker = events.map((e) => {
    const date = new Date(e.date);
    const yTransform = height / (2 - e.text.length / 80);
    const transform = `rotate(-90deg) translate(-${yTransform}px, -9px)`;

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
        fontSize: ".7em",
        transform,
      },
      legend: e.text,
    };
  });

  return (
    <>
      <Heading textAlign="center" m={2}>
        {title}
      </Heading>
      <Line
        theme={plotTheme}
        data={data}
        width={width}
        height={height}
        margin={{ top: 30, right: 20, bottom: 50, left: 45 }}
        colors={config.colors}
        lineWidth={1}
        animate={false}
        useMesh={true}
        enableArea={true}
        enableGridX={false}
        axisBottom={{
          format: "%b %d",
          tickValues: width < 1200 ? "every 2 weeks" : "every week",
          tickRotation: width < 800 ? -90 : 0,
        }}
        yScale={{ type: "linear", stacked: false }}
        xFormat="time:%Y-%m-%d"
        xScale={{ type: "time", format: "%Y-%m-%d", precision: "day" }}
        legends={[
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
        ]}
        enableSlices="x"
        sliceTooltip={sliceTooltip}
        markers={eventMarker}
      />
    </>
  );
};

export default withResponsiveContainer(OverallTimelinePlot);
