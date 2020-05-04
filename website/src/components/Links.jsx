import React from "react";
import { Flex, Box, Text } from "rebass";
import { Label, Radio } from "@rebass/forms";
import { navigate } from "gatsby";
import { useLocation } from "./Layout";

const LinkedRadio = ({ name, path, label }) => {
  const currentPath = typeof window === "undefined" || window.location.pathname;
  return (
    <Box p={1}>
      <Label>
        <Radio
          name={name}
          id={label}
          value={path}
          checked={path === currentPath}
          onClick={() => navigate(path)}
        />
        {label}
      </Label>
    </Box>
  );
};

const Links = () => {
  return (
    <Flex alignItems="center" maxWidth={550} flexWrap="wrap">
      <Box p={1}>
        <Text>Show data for</Text>
      </Box>
      <Flex justifyContent="space-between">
        <LinkedRadio name="color" label="All" path="/" />
        <LinkedRadio name="color" label="DOC" path="/doc/" />
        <LinkedRadio name="color" label="County" path="/county/" />
      </Flex>
    </Flex>
  );
};

export default Links;
