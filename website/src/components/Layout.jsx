import React from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "rebass";
import Header from "./Header";
import "./layout.css";
import Links from "./Links";

const Layout = ({ children }) => {
  return (
    <Flex alignSelf="center" flexDirection="column" m={3}>
      <Header />
      <Links />
      <Box>{children}</Box>
    </Flex>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
