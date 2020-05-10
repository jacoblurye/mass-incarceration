import React from "react";
import { Flex, Box, Text } from "rebass";
import { Label, Radio } from "@rebass/forms";

const DataRadios = ({ values, checked, onChange }) => {
  // A hack to deal with weird caching behavior on Firefox
  // that prevents the selected radio from updating appropriately
  // when the page is refreshed.
  const [show, setShow] = React.useState(false);
  React.useEffect(() => setShow(true), []);

  return (
    <Flex alignItems="center" maxWidth={550} flexWrap="wrap">
      <Box p={1}>
        <Text>Show data for</Text>
      </Box>
      {show && (
        <Flex justifyContent="space-between">
          {values.map((v) => {
            console.log(v, checked === v);
            return (
              <Box key={v} p={1}>
                <Label>
                  <Radio
                    id={v}
                    value={v}
                    checked={checked === v}
                    onClick={() => {
                      onChange(v);
                    }}
                  />
                  {v}
                </Label>
              </Box>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
};

export default DataRadios;
