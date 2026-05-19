import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import "moment/locale/id";
import theme from "../common/theme";

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
