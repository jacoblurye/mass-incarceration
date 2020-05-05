import React from "react";
import { Flex, Box, Text } from "rebass";
import { Label, Radio } from "@rebass/forms";
import { navigate } from "gatsby";

const LinkedRadio = ({ name, path, label }) => {
  const currentPath =
    typeof window === "undefined" ? undefined : window.location.pathname;

  const forceUpdate = React.useState()[1];
  React.useEffect(() => forceUpdate(), [currentPath, forceUpdate]);

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
