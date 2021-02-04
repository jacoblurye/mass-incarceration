import React from "react";
import maxBy from "lodash/maxBy";
import { Line } from "@nivo/line";
import { Heading, Text } from "rebass";
import plotTheme from "./plotTheme";
import { theme } from "../Theme";
import Tooltip from "./Tooltip";

const config = {
  height: 300,
  width: 340,
  numTicks: 3,
  colors: ["#f47560", "#e8c1a0", "#61cdbb"],
};

const sliceTooltip = ({ slice }) => {
  const [point] = slice.points;
  return (
    <Tooltip
      entries={[
        {
          label: "% Occupied",
          value: `${point.data.yFormatted}%`,
          color: config.colors[point.serieId],
        },
        {
          label: "Prisoners",
          value: point.data.datum.total_occupancy,
          color: config.colors[point.serieId],
        },
        {
          label: "Report Date",
          value: point.data.xFormatted,
        },
      ]}
    />
  );
};

const crowdingLevel = (d) => {
  if (d.percent_occupied >= 100) return 0;
  if (d.percent_occupied >= 90) return 1;
  return 2;
};

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

  const maxOccupancy = maxBy(facilityData, "percent_occupied").percent_occupied;
  const capacity = facilityData[0].operational_capacity;

  return (
    <>
      <Heading textAlign="center" fontSize={1} marginTop={2} maxWidth={340}>
        {facility}
      </Heading>
      <Text fontSize={0} textAlign="center">
        capacity: <strong>{capacity}</strong>
      </Text>
      <Line
        theme={plotTheme}
        data={joinedSeries}
        width={config.width}
        height={config.height}
        margin={{ top: 3, right: 15, bottom: 25, left: 40 }}
        colors={(d) => config.colors[d.id]}
        lineWidth={1}
        pointSize={4}
        animate={false}
        useMesh={true}
        enableArea={true}
        areaOpacity={0.5}
        enableGridX={false}
        axisBottom={{
          format: "%b %y",
          tickValues: "every 12 weeks",
        }}
        axisLeft={{
          tickValues: config.numTicks,
          format: (y) => `${y}%`,
        }}
        gridYValues={config.numTicks}
        yScale={{
          type: "linear",
          stacked: false,
          max: maxOccupancy <= 125 ? 125 : undefined,
          min: 0,
        }}
        xFormat="time:%Y-%m-%d"
        xScale={{ type: "time", format: "%Y-%m-%d", precision: "day" }}
        enableSlices="x"
        sliceTooltip={sliceTooltip}
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
      />
    </>
  );
};

export default FacilityTimelinePlot;
