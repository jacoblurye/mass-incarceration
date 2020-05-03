import React from "react";
import { maxBy, find, map, groupBy, sortBy } from "lodash";
import { Box, Heading } from "rebass";
import { Bar } from "@nivo/bar";
import plotTheme from "./plotTheme";
import withResponsiveContainer from "./withResponsiveContainer";

const ReleasesPlot = ({ title, csvData, width }) => {
  const data = map(groupBy(csvData, "facility"), (data, facility) => {
    const preLockdown = find(data, (d) => d.report_date === "2020-03-09");
    const mostRecent = maxBy(data, (d) => new Date(d.report_date));
    const change = mostRecent.total_occupancy - preLockdown.total_occupancy;
    return { facility, change };
  });
  const sortedData = sortBy(data, "change");

  const isMobile = width < 600;
  const orientation = isMobile ? "horizontal" : "vertical";

  return (
    <>
      <Heading textAlign="center" m={3}>
        {title}
      </Heading>
      <Box style={{ visibility: !!width ? "visible" : "hidden" }}>
        <Bar
          data={sortedData}
          theme={plotTheme}
          width={width}
          height={800}
          layout={orientation}
          enableGridY={!isMobile}
          enableGridX={isMobile}
          keys={["change"]}
          indexBy="facility"
          colors={({ data }) => (data.change < 0 ? "#61cdbb" : "#f47560")}
          margin={{ top: 5, right: 30, bottom: 300, left: 35 }}
          axisLeft={{
            legend: isMobile || "Change in Incarcerated Population",
            legendOffset: -50,
            legendPosition: "middle",
          }}
          axisBottom={{
            legend: isMobile && "Change in Incarcerated Population",
            legendOffset: 50,
            tickRotation: -90,
            tickPadding: 10,
          }}
        ></Bar>
      </Box>
    </>
  );
};

export default withResponsiveContainer(ReleasesPlot);
