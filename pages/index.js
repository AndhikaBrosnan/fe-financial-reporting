import { Inter } from "next/font/google";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { isMiniMobileHandler } from "../common/helpers/responsive";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeaderLayout from "../common/components/headers";
import styles from "./styles.module.css";
import { IconPemasukan, IconPengeluaran } from "../common/components/icons";
import ProfitLoss from "./profit-loss";

export default function Home() {
  const isMobile = isMiniMobileHandler();
  const router = useRouter();

  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsRendered(true);
    }
  }, []);

  if (isRendered) {
    return (
      <Box>
        <HeaderLayout />
        <Box
          mt="2em"
          border="1px solid #ffffff"
          borderRadius="4px"
          background="white"
          p={isMobile ? "1" : "2em 35em"}
          h="100vh"
        >
          <Box className={styles["container-box-buttons"]}>
            <Flex justifyContent="space-around" alignItems="center">
              <Flex
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                cursor="pointer"
                onClick={() => router.push("/reports?section=income")}
              >
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  boxSize="120px"
                  borderRadius="full"
                  background="#14A281"
                >
                  <IconPemasukan />
                </Flex>
                <Text>Uang Masuk</Text>
              </Flex>
              <Flex
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                cursor="pointer"
                onClick={() => router.push("/reports?section=outcome")}
              >
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  boxSize="120px"
                  borderRadius="full"
                  background="#14A281"
                >
                  <IconPengeluaran />
                </Flex>
                <Text>Uang Keluar</Text>
              </Flex>
            </Flex>
          </Box>

          <Box
            mt="3em"
            background="teal"
            borderRadius="28px"
            cursor="pointer"
            onClick={() => router.push("/financial-records")}
          >
            <Flex justifyContent="flex-start" alignItems="center" p="2em">
              <Text flex="1" className={styles["laporan-keuangan"]}>
                Jurnal Umum
              </Text>
              <ChevronRightIcon
                color="white"
                size="28px"
                w={"28px"}
                h={"28px"}
              />
            </Flex>
          </Box>

          <Box mt="1em" className={styles["container-profit-loss"]}>
            <ProfitLoss />
            <Flex justifyContent="center" alignItems="center">
              <Button
                background="#018062"
                borderRadius="13px"
                color="white"
                cursor="pointer"
                onClick={() => router.push("/profit-loss")}
              >
                Lihat Detail
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    );
  }
  return <></>;
}
