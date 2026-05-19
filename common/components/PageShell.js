import { Box, Container } from "@chakra-ui/react";
import HeaderLayout from "./headers";

const PageShell = ({ children, maxW = "780px", noHeader = false, ...rest }) => {
  return (
    <Box minH="100vh" bg="surface.base" pb={{ base: "5em", md: "4em" }}>
      {!noHeader && <HeaderLayout />}
      <Container
        maxW={maxW}
        px={{ base: 4, md: 6 }}
        pt={{ base: 4, md: 6 }}
        {...rest}
      >
        {children}
      </Container>
    </Box>
  );
};

export default PageShell;
