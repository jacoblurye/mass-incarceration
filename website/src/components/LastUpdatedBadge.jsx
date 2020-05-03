import React from "react";
import maxBy from "lodash/maxBy";
import { Box, Text } from "rebass";
import { graphql, useStaticQuery } from "gatsby";

const LastUpdatedBadge = () => {
  const { allFile } = useStaticQuery(graphql`
    query {
      allFile {
        nodes {
          modifiedTime
        }
      }
    }
  `);

  const lastUpdatedDate = new Date(
    maxBy(allFile.nodes, "modifiedTime").modifiedTime
  );

  return (
    <Box
      sx={{
        display: "inline-block",
        bg: "muted",
        my: 1,
        p: 1,
        borderRadius: 5,
      }}
    >
      <Text>Last Updated: {lastUpdatedDate.toLocaleString()}</Text>
    </Box>
  );
};

export default LastUpdatedBadge;
