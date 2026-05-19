import { Box, Button, Flex, Text } from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import IncomeComponent from "./components/income";
import OutcomeComponent from "./components/outcome";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PageShell from "../../common/components/PageShell";
import SectionTitle from "../../common/components/SectionTitle";
import { supabase } from "../../common/helpers/supabaseClient";

const SegmentToggle = ({ isIncome, onChange }) => (
  <Flex
    p={1}
    bg="surface.muted"
    borderRadius="pill"
    gap={1}
    border="1px solid"
    borderColor="surface.border"
  >
    {[
      { id: true, label: "Uang Masuk", color: "income.500" },
      { id: false, label: "Uang Keluar", color: "expense.500" },
    ].map((seg) => {
      const active = isIncome === seg.id;
      return (
        <Button
          key={String(seg.id)}
          flex="1"
          size="md"
          borderRadius="pill"
          fontWeight={600}
          variant="unstyled"
          onClick={() => onChange(seg.id)}
          bg={active ? "white" : "transparent"}
          color={active ? seg.color : "ink.500"}
          boxShadow={active ? "soft" : "none"}
          transition="all 0.15s ease"
          _hover={{ color: active ? seg.color : "ink.700" }}
        >
          {seg.label}
        </Button>
      );
    })}
  </Flex>
);

const FinancialReport = () => {
  const router = useRouter();
  const { section } = router.query;

  const [isIncome, setIsIncome] = useState(true);

  useEffect(() => {
    if (section === "outcome") {
      setIsIncome(false);
    } else if (section === "income") {
      setIsIncome(true);
    }
  }, [section]);

  const fetchDatabase = async () => {
    let { data } = await supabase
      .from("records")
      .select(`type, name, jenisTransaksi, transactionDate, nominal`);

    localStorage.setItem("transactions", JSON.stringify(data));
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  return (
    <PageShell>
      <SectionTitle
        eyebrow="Catat transaksi"
        title={isIncome ? "Pemasukan baru" : "Pengeluaran baru"}
        mt={2}
        mb={4}
      />

      <SegmentToggle isIncome={isIncome} onChange={setIsIncome} />

      <Box layerStyle="cardElevated" mt={4} p={{ base: 4, md: 6 }}>
        {isIncome ? <IncomeComponent /> : <OutcomeComponent />}
      </Box>
    </PageShell>
  );
};

export default FinancialReport;
