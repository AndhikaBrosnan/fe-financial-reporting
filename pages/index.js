import { Box, Button, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageShell from "../common/components/PageShell";
import SectionTitle from "../common/components/SectionTitle";
import { IconPemasukan, IconPengeluaran } from "../common/components/icons";
import ProfitLoss from "./profit-loss";

const ActionTile = ({ icon, label, hint, gradient, onClick }) => (
  <Flex
    role="button"
    onClick={onClick}
    cursor="pointer"
    direction="column"
    justify="space-between"
    h="100%"
    minH="140px"
    p={{ base: 4, md: 5 }}
    borderRadius="xl"
    bgGradient={gradient}
    color="white"
    boxShadow="card"
    transition="transform 0.2s ease, box-shadow 0.2s ease"
    _hover={{ transform: "translateY(-3px)", boxShadow: "glow" }}
    _active={{ transform: "translateY(0)" }}
  >
    <Flex
      align="center"
      justify="center"
      boxSize="48px"
      borderRadius="full"
      bg="whiteAlpha.250"
    >
      {icon}
    </Flex>
    <Box>
      <Text fontSize="lg" fontWeight={700} letterSpacing="-0.01em">
        {label}
      </Text>
      <Text fontSize="sm" opacity={0.85} mt={0.5}>
        {hint}
      </Text>
    </Box>
  </Flex>
);

export default function Home() {
  const router = useRouter();
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsRendered(true);
    }
  }, []);

  if (!isRendered) return <></>;

  return (
    <PageShell>
      <SectionTitle
        eyebrow="Halo"
        title="Ringkasan keuanganmu"
        mt={2}
        mb={4}
      />

      <Box layerStyle="cardElevated" p={{ base: 4, md: 6 }}>
        <ProfitLoss />
        <Flex justify="center" mt={4}>
          <Button
            rightIcon={<ChevronRightIcon />}
            onClick={() => router.push("/profit-loss")}
            size="md"
          >
            Lihat detail laporan
          </Button>
        </Flex>
      </Box>

      <SectionTitle eyebrow="Aksi cepat" title="Catat transaksi hari ini" />

      <SimpleGrid columns={2} spacing={{ base: 3, md: 4 }}>
        <ActionTile
          icon={<IconPemasukan width={42} height={28} />}
          label="Uang Masuk"
          hint="Catat pemasukan baru"
          gradient="linear(135deg, #13A981 0%, #018062 100%)"
          onClick={() => router.push("/reports?section=income")}
        />
        <ActionTile
          icon={<IconPengeluaran width={42} height={28} />}
          label="Uang Keluar"
          hint="Catat pengeluaran baru"
          gradient="linear(135deg, #FF7A7A 0%, #D14848 100%)"
          onClick={() => router.push("/reports?section=outcome")}
        />
      </SimpleGrid>

      <SectionTitle eyebrow="Riwayat" title="Jurnal Umum" />

      <Flex
        layerStyle="card"
        p={{ base: 4, md: 5 }}
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={() => router.push("/financial-records")}
        transition="transform 0.15s ease, box-shadow 0.15s ease"
        _hover={{ transform: "translateY(-1px)", boxShadow: "card" }}
      >
        <Box>
          <Text fontWeight={600} color="ink.900">
            Lihat semua transaksi
          </Text>
          <Text fontSize="sm" color="ink.500">
            Pemasukan & pengeluaran terurut berdasarkan tanggal
          </Text>
        </Box>
        <Flex
          align="center"
          justify="center"
          boxSize="36px"
          borderRadius="full"
          bg="brand.50"
          color="brand.500"
        >
          <ChevronRightIcon boxSize={5} />
        </Flex>
      </Flex>
    </PageShell>
  );
}
