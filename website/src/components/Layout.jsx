import React from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "rebass";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <Flex alignSelf="center" flexDirection="column" m={3}>
      <Header />
      <Box>{children}</Box>
    </Flex>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
