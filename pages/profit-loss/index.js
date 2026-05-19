import {
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageShell from "../../common/components/PageShell";
import SectionTitle from "../../common/components/SectionTitle";
import StatCard from "../../common/components/StatCard";
import { supabase } from "../../common/helpers/supabaseClient";

const FILTER_OPTIONS = [
  { id: "all", label: "Semua" },
  { id: "this_month", label: "Bulan ini" },
  { id: "month_before", label: "Bulan lalu" },
];

const FilterPills = ({ value, onChange }) => (
  <HStack
    spacing={2}
    overflowX="auto"
    className="no-scrollbar"
    py={1}
    pr={1}
    flexShrink={0}
  >
    {FILTER_OPTIONS.map((opt) => {
      const active = value === opt.id;
      return (
        <Button
          key={opt.id}
          size="sm"
          flexShrink={0}
          onClick={() => onChange(opt.id)}
          variant={active ? "solid" : "ghostOnSurface"}
          borderRadius="pill"
          px={4}
        >
          {opt.label}
        </Button>
      );
    })}
  </HStack>
);

const formatRp = (n) =>
  `Rp ${new Intl.NumberFormat("id-ID").format(Math.abs(n || 0))}`;

const ProfitLoss = () => {
  const router = useRouter();

  const [transaksi, setTransaksi] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalOutcome, setTotalOutcome] = useState(0);
  const [monthFilter, setMonthFilter] = useState("all");
  const [totalProfit, setTotalProfit] = useState(0);

  const fetchDatabase = async () => {
    let { data } = await supabase
      .from("records")
      .select(`type, name, jenisTransaksi, transactionDate, nominal`);

    localStorage.setItem("transactions", JSON.stringify(data));
    if (isEmpty(data)) return;

    const currentDate = new Date();

    switch (monthFilter) {
      case "all":
        setTransaksi(data);
        break;
      case "this_month":
        const this_month = data.filter((trx) => {
          const trxDate = new Date(trx.transactionDate);
          return (
            trxDate.getMonth() === currentDate.getMonth() &&
            trxDate.getFullYear() === currentDate.getFullYear()
          );
        });

        setTransaksi(this_month);
        break;
      case "month_before":
        const prevMonth =
          currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;

        const month_before = data.filter((trx) => {
          const transactionDate = new Date(trx.transactionDate);
          return (
            (transactionDate.getMonth() === prevMonth &&
              transactionDate.getFullYear() === currentDate.getFullYear()) ||
            (prevMonth === 11 &&
              transactionDate.getMonth() === 0 &&
              transactionDate.getFullYear() === currentDate.getFullYear() - 1)
          );
        });

        setTransaksi(month_before);
        break;
      default:
        setTransaksi(data);
        break;
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, [monthFilter]);

  useEffect(() => {
    const sumIncome = transaksi.reduce(function (sum, value) {
      if (value.type === "income") {
        return sum + parseInt(value.nominal);
      }
      return sum;
    }, 0);
    setTotalIncome(sumIncome);

    const sumOutcome = transaksi.reduce(function (sum, value) {
      if (value.type === "outcome") {
        return sum + parseInt(value.nominal);
      }
      return sum;
    }, 0);
    setTotalOutcome(sumOutcome);
  }, [transaksi]);

  useEffect(() => {
    setTotalProfit(totalIncome - totalOutcome);
  }, [totalIncome, totalOutcome]);

  const onClickFilterWaktu = (value) => {
    setMonthFilter(value);
  };

  const profitTone = totalProfit >= 0 ? "profit" : "expense";
  const profitPrefix = totalProfit < 0 ? "- " : "";

  // When rendered as a child on the home page, omit the page shell/header.
  const isEmbedded = router.pathname === "/";

  const summary = (
    <>
      <Flex
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={3}
        mb={4}
      >
        <Box>
          <Text textStyle="label" mb={1}>
            Periode
          </Text>
          <Text textStyle="sectionTitle" lineHeight={1.2}>
            Saldo bersih
          </Text>
        </Box>
        <FilterPills value={monthFilter} onChange={onClickFilterWaktu} />
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 3, md: 4 }}>
        <StatCard
          tone="income"
          label="Pemasukan"
          amount={formatRp(totalIncome)}
          hint={`${transaksi.filter((t) => t.type === "income").length} transaksi`}
        />
        <StatCard
          tone="expense"
          label="Pengeluaran"
          amount={formatRp(totalOutcome)}
          hint={`${transaksi.filter((t) => t.type === "outcome").length} transaksi`}
        />
        <StatCard
          tone={profitTone}
          label="Keuntungan"
          amount={`${profitPrefix}${formatRp(totalProfit)}`}
          hint={
            totalProfit >= 0 ? "Laba bersih periode ini" : "Rugi periode ini"
          }
        />
      </SimpleGrid>
    </>
  );

  if (isEmbedded) {
    return summary;
  }

  return (
    <PageShell>
      <SectionTitle
        eyebrow="Laporan Keuangan"
        title="Performa periode terpilih"
        mt={2}
        mb={4}
      />

      <Box layerStyle="cardElevated" p={{ base: 4, md: 6 }}>
        {summary}
      </Box>

      <ProfitLossInsight transaksi={transaksi} />
    </PageShell>
  );
};

const ProfitLossInsight = ({ transaksi }) => {
  const formatter = new Intl.NumberFormat("id-ID");
  const [outcomes, setOutcomes] = useState();
  const [biggestOutcome, setBiggestOutcome] = useState();

  useEffect(() => {
    if (isEmpty(transaksi)) return;
    const filteredOutcome = transaksi.filter((item) => item.type === "outcome");
    setOutcomes(filteredOutcome);
  }, [transaksi]);

  useEffect(() => {
    if (isEmpty(outcomes)) return;
    const max = outcomes.reduce(function (prev, current) {
      return prev.nominal > current.nominal ? prev : current;
    });

    setBiggestOutcome(max);
  }, [outcomes]);

  if (isEmpty(biggestOutcome)) return null;

  return (
    <>
      <SectionTitle eyebrow="Insight" title="Saran Keuangan" />
      <Box
        layerStyle="cardElevated"
        p={{ base: 4, md: 6 }}
        bgGradient="linear(135deg, brand.50 0%, white 100%)"
        borderColor="brand.100"
      >
        <Flex align="flex-start" gap={4}>
          <Flex
            align="center"
            justify="center"
            boxSize="44px"
            borderRadius="full"
            bg="brand.500"
            color="white"
            fontSize="xl"
            fontWeight={700}
            flexShrink={0}
          >
            !
          </Flex>
          <Box>
            <Text fontWeight={600} color="ink.900" mb={1}>
              Pengeluaran terbesar
            </Text>
            <Text color="ink.700" lineHeight={1.6}>
              <Text as="span" fontWeight={600} color="ink.900">
                {biggestOutcome.name}
              </Text>{" "}
              merupakan beban pengeluaran terbesar sebesar{" "}
              <Text as="span" fontWeight={600} color="expense.500">
                Rp {formatter.format(biggestOutcome.nominal)}
              </Text>
              . Pertimbangkan untuk meninjau ulang pos pengeluaran ini.
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ProfitLoss;
