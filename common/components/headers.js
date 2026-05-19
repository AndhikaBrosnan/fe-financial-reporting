import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Container, Flex, IconButton, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { LogoTitle } from "./icons";

const ROUTE_TITLES = {
  "/": "Catat Uang",
  "/financial-records": "Jurnal Umum",
  "/profit-loss": "Laporan Keuangan",
  "/reports": "Catat Transaksi",
};

const HeaderLayout = ({ title }) => {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const computedTitle = title || ROUTE_TITLES[router.pathname] || "Catat Uang";

  return (
    <Box
      as="header"
      bgGradient="linear(135deg, brand.500 0%, brand.700 100%)"
      color="white"
      position="sticky"
      top={0}
      zIndex={20}
      boxShadow="0 4px 20px rgba(13, 61, 49, 0.18)"
    >
      <Container maxW="780px" px={{ base: 4, md: 6 }} py={3}>
        <Flex align="center" gap={3}>
          {!isHome ? (
            <IconButton
              aria-label="Kembali"
              variant="ghost"
              colorScheme="whiteAlpha"
              icon={<ArrowBackIcon boxSize={5} />}
              onClick={() => router.back()}
              borderRadius="full"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
            />
          ) : (
            <Flex
              align="center"
              justify="center"
              boxSize="40px"
              borderRadius="full"
              bg="whiteAlpha.200"
              cursor="pointer"
              onClick={() => router.push("/")}
            >
              <Box w="60%" h="60%">
                <LogoTitle style={{ width: "100%", height: "100%" }} />
              </Box>
            </Flex>
          )}

          <Box flex="1" minW={0}>
            <Text
              fontSize="xs"
              opacity={0.8}
              fontWeight={500}
              letterSpacing="0.06em"
              textTransform="uppercase"
              lineHeight={1}
            >
              {isHome ? "Aplikasi" : "Halaman"}
            </Text>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight={700}
              letterSpacing="-0.01em"
              lineHeight={1.2}
              noOfLines={1}
            >
              {computedTitle}
            </Text>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default HeaderLayout;
