import React from "react";
import { Box, Heading, Text } from "rebass";
import OutgoingLink from "./OutgoingLink";

const Footer = () => {
  return (
    <Box width="100%" p={3} backgroundColor="muted">
      <Box>
        <Text>
          Download the data, view the code for this site, or file an issue on{" "}
          <OutgoingLink
            href="https://github.com/jacoblurye/mass-incarceration"
            text="GitHub."
          />
        </Text>
      </Box>
      <Box my={4}>
        <Box>
          <Heading>Related Resources</Heading>
        </Box>
        <Box marginTop={2}>
          {"ACLU of Massachusetts' "}
          <OutgoingLink
            href="https://data.aclum.org/sjc-12926-tracker/"
            text="online tracker"
          />
          {
            " for daily release and COVID-19 testing data across the MA prison system."
          }
        </Box>
        <Box marginTop={2}>
          {"An "}
          <OutgoingLink
            href="https://docs.google.com/document/d/e/2PACX-1vSgJLDEGEPaQ4fHNSCKMwp5aC3omfFRDu463FE96F2JBynN84ZJva3JTjpsM69CqwtAp0Dhmhetvatc/pub"
            text="open letter"
          />
          {
            " from Massachusetts doctors to the governor's office calling for decarceration."
          }
        </Box>
        <Box marginTop={2}>
          {"Families for Justice as Healing's "}
          <OutgoingLink
            href="https://tinyurl.com/maweekofaction"
            text="Week of Action"
          />
          {", with steps MA residents can take to push for decarceration."}
        </Box>
        <Box marginTop={2}>
          {"Prisoners' Legal Services of Massachusetts' "}
          <OutgoingLink
            href="https://www.plsma.org/covid-19-in-ma-prisons-and-jails/"
            text="COVID-19 news and
            information page."
          />
        </Box>
        <Box marginTop={2}>
          {"Vera Institute of Justice's "}
          <OutgoingLink
            href="https://www.vera.org/blog/covid-19-1"
            text="articles"
          />
          {" on the criminal justice system's COVID-19 response across the US."}
        </Box>
      </Box>
      <Box>
        <Text>© 2020 Jacob Lurye</Text>
      </Box>
    </Box>
  );
};

export default Footer;
