import { Box, Divider, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { isEmpty } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import PageShell from "../../common/components/PageShell";
import SectionTitle from "../../common/components/SectionTitle";
import { supabase } from "../../common/helpers/supabaseClient";

const formatRp = (n) =>
  `Rp ${new Intl.NumberFormat("id-ID").format(Math.abs(parseInt(n) || 0))}`;

const TransactionRow = ({ item }) => {
  const isIncome = item.type === "income";
  const tone = isIncome
    ? { bg: "income.50", color: "income.500", sign: "+" }
    : { bg: "expense.50", color: "expense.500", sign: "-" };

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={3}
      py={3}
      px={{ base: 1, md: 2 }}
    >
      <Flex align="center" gap={3} flex="1" minW={0}>
        <Flex
          align="center"
          justify="center"
          boxSize={{ base: "40px", md: "44px" }}
          borderRadius="full"
          bg={tone.bg}
          color={tone.color}
          flexShrink={0}
        >
          {isIncome ? (
            <ArrowDownIcon boxSize={5} />
          ) : (
            <ArrowUpIcon boxSize={5} />
          )}
        </Flex>
        <Box minW={0} flex="1">
          <Text
            fontWeight={600}
            color="ink.900"
            textTransform="capitalize"
            noOfLines={1}
          >
            {item.jenisTransaksi || (isIncome ? "Pemasukan" : "Pengeluaran")}
          </Text>
          <Text fontSize="sm" color="ink.500" noOfLines={1}>
            {item.name}
          </Text>
          <Text fontSize="xs" color="ink.400" mt={0.5}>
            {moment.unix(item.transactionDate / 1000).format("LL")}
          </Text>
        </Box>
      </Flex>
      <Text
        fontSize={{ base: "md", md: "lg" }}
        fontWeight={700}
        color={tone.color}
        whiteSpace="nowrap"
        fontVariantNumeric="tabular-nums"
      >
        {tone.sign} {formatRp(item.nominal)}
      </Text>
    </Flex>
  );
};

const EmptyState = () => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    py={16}
    px={6}
    textAlign="center"
  >
    <Flex
      align="center"
      justify="center"
      boxSize="72px"
      borderRadius="full"
      bg="brand.50"
      color="brand.500"
      fontSize="3xl"
      fontWeight={800}
      mb={4}
    >
      ∅
    </Flex>
    <Heading as="h4" size="md" color="ink.900" mb={2}>
      Belum ada transaksi
    </Heading>
    <Text color="ink.500" maxW="320px">
      Catat pemasukan atau pengeluaran pertamamu dari halaman utama.
    </Text>
  </Flex>
);

const groupByDate = (items) => {
  const groups = items.reduce((acc, item) => {
    const key = moment(item.transactionDate).format("YYYY-MM-DD");
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return Object.entries(groups).sort(([a], [b]) => (a < b ? 1 : -1));
};

const FinancialRecords = () => {
  moment.locale("id");

  const [transaksi, setTransaksi] = useState([]);

  const fetchDatabase = async () => {
    let { data } = await supabase
      .from("records")
      .select(`type, name, jenisTransaksi, transactionDate, nominal`);

    localStorage.setItem("transactions", JSON.stringify(data));
    if (!isEmpty(data)) setTransaksi(data);
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  const grouped = groupByDate(transaksi);

  return (
    <PageShell>
      <SectionTitle
        eyebrow="Riwayat"
        title={`${transaksi.length} transaksi tercatat`}
        mt={2}
        mb={4}
      />

      <Box layerStyle="cardElevated" overflow="hidden">
        {isEmpty(transaksi) ? (
          <EmptyState />
        ) : (
          <VStack
            spacing={0}
            align="stretch"
            divider={<Divider borderColor="surface.border" />}
          >
            {grouped.map(([date, items]) => (
              <Box key={date} px={{ base: 4, md: 5 }} py={2}>
                <Text
                  fontSize="xs"
                  fontWeight={600}
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color="ink.500"
                  mt={2}
                  mb={1}
                >
                  {moment(date).format("dddd, LL")}
                </Text>
                <VStack
                  spacing={0}
                  align="stretch"
                  divider={<Divider borderColor="surface.border" />}
                >
                  {items.map((item, i) => (
                    <TransactionRow key={`${date}-${i}`} item={item} />
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </PageShell>
  );
};

export default FinancialRecords;
