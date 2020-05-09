import React from "react";
import { Flex, Box, Text } from "rebass";
import { Label, Radio } from "@rebass/forms";

const DataRadios = ({ values, checked, onChange }) => {
  return (
    <Flex alignItems="center" maxWidth={550} flexWrap="wrap">
      <Box p={1}>
        <Text>Show data for</Text>
      </Box>
      <Flex justifyContent="space-between">
        {values.map((v) => (
          <Box key={v} p={1}>
            <Label>
              <Radio
                id={v}
                value={v}
                checked={checked === v}
                onClick={() => onChange(v)}
              />
              {v}
            </Label>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

export default DataRadios;
