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
      <Heading fontSize={[5, 5, 6, 6]}>
        <GatsbyLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          {title}
        </GatsbyLink>
      </Heading>
      <Text>{description}</Text>
      <Text>
        Data from{" "}
        <RebassLink
          color="primary"
          target="_blank"
          href="https://www.mass.gov/lists/weekly-inmate-count-2020"
        >
          mass.gov
        </RebassLink>
        . <LastUpdatedBadge />
      </Text>
    </Box>
  );
};

export default Header;
