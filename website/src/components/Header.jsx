import React from "react";
import { Box, Heading, Text, Link as RebassLink } from "rebass";
import { Link as GatsbyLink, useStaticQuery, graphql } from "gatsby";
import LastUpdatedBadge from "./LastUpdatedBadge";

const Header = () => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);
  const { title, description } = data.site.siteMetadata;

  return (
    <Box>
      <Heading marginBottom={2} fontSize={[5, 5, 6, 6]}>
        <GatsbyLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          {title}
        </GatsbyLink>
      </Heading>
      <Text my={1}>
        {description} Data from{" "}
        <RebassLink
          color="primary"
          target="_blank"
          rel="noreferrer noopener"
          href="https://www.mass.gov/lists/weekly-inmate-count-2020"
        >
          mass.gov
        </RebassLink>
        .
      </Text>
      <Box my={2}>
        <LastUpdatedBadge />
      </Box>
    </Box>
  );
};

export default Header;
