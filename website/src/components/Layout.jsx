import React from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "rebass";
import Header from "./Header";
import Footer from "./Footer";
import "./layout.css";

const Layout = ({ children }) => {
  return (
    <>
      <Flex alignSelf="center" flexDirection="column" m={3}>
        <Header />
        <Box>{children}</Box>
      </Flex>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
