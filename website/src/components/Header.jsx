import React from "react";
import { Box, Heading, Text } from "rebass";
import { Link, useStaticQuery, graphql } from "gatsby";
import LastUpdatedBadge from "./LastUpdatedBadge";
import OutgoingLink from "./OutgoingLink";

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
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          {title}
        </Link>
      </Heading>
      <Text my={1}>
        {description} Data from{" "}
        <OutgoingLink
          text="mass.gov"
          href="https://www.mass.gov/lists/weekly-inmate-count-2020"
        />
        .
      </Text>
      <Box my={2}>
        <LastUpdatedBadge />
      </Box>
    </Box>
  );
};

export default Header;
