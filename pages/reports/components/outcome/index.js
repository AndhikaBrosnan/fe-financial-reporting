import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isEmpty } from "lodash";
import CreatableSelect from "react-select/creatable";
import CurrencyInput from "react-currency-input-field";
import { isMiniMobileHandler } from "../../../../common/helpers/responsive";
import { supabase } from "../../../../common/helpers/supabaseClient";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderRadius: 12,
    background: state.isFocused ? "#fff" : "#EEF2F0",
    borderColor: state.isFocused ? "#EE5A5A" : "transparent",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(238, 90, 90, 0.18)" : "none",
    "&:hover": { borderColor: "#E6ECE9" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  placeholder: (base) => ({ ...base, color: "#637773" }),
  menu: (base) => ({
    ...base,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 12px 32px rgba(15, 60, 50, 0.12)",
    border: "1px solid #E6ECE9",
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? "#D14848"
      : state.isFocused
        ? "#FDECEC"
        : "#fff",
    color: state.isSelected ? "#fff" : "#0F1A16",
    cursor: "pointer",
  }),
};

const OutcomeComponent = () => {
  const formatter = new Intl.NumberFormat("id-ID");
  const toast = useToast();
  const isMobile = isMiniMobileHandler();

  const [jenisTransaksi, setJenisTransaksi] = useState("");
  const [namaTransaksi, setNamaTransaksi] = useState("");
  const [nominalTransaksi, setNominalTransaksi] = useState(null);
  const [tanggalTransaksi, setTanggalTransaksi] = useState(
    new Date().getTime()
  );

  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  const options = [
    { value: "pembelian bahan baku", label: "Pembelian bahan baku" },
    { value: "pengeluaran di luar usaha", label: "Pengeluaran di luar usaha" },
    { value: "biaya operasional", label: "Biaya operasional" },
    { value: "gaji/bonus karyawan", label: "Gaji/ bonus karyawan" },
    { value: "sewa Bangunan", label: "Sewa Bangunan" },
    {
      value: "beban listrik/air/telepon",
      label: "Beban listrik/ air/ telepon",
    },
    { value: "pemberian utang", label: "Pemberian Utang" },
    { value: "pembayaran utang/cicilan", label: "pembayaran utang/ cicilan" },
    { value: "pengeluaran lain lain", label: "Pengeluaran lain lain" },
  ];

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    const calculateIncome = transactions.reduce((accumulator, currentValue) => {
      if (currentValue.type === "outcome")
        return accumulator + parseInt(currentValue.nominal);
      return accumulator;
    }, 0);

    setTotalIncome(calculateIncome);
  }, [transactions]);

  const onSubmitIncome = async () => {
    const validate = validateForms();
    if (!validate) return;

    const transactionTemp = {
      type: "outcome",
      jenisTransaksi: jenisTransaksi.value,
      name: namaTransaksi,
      nominal: nominalTransaksi,
      transactionDate: tanggalTransaksi,
    };

    const tempTransactions = [...transactions, transactionTemp];
    setTransactions(tempTransactions);
    localStorage.setItem("transactions", JSON.stringify(tempTransactions));

    let { error } = await supabase.from("records").upsert(transactionTemp);
    if (error) {
      console.error("error outcome upsert: ", error);
      toast({
        title: "Gagal.",
        description: "gagal menyimpan ke database.",
        status: "error",
        duration: 3000,
        position: isMobile ? "bottom" : "top",
        isClosable: true,
      });
      throw error;
    }

    toast({
      title: "Transaksi berhasil ditambahkan.",
      description: "Pengeluaran telah dicatat.",
      status: "success",
      duration: 3000,
      position: isMobile ? "bottom" : "top",
      isClosable: true,
    });

    setNamaTransaksi("");
    setJenisTransaksi(null);
    setNominalTransaksi(0);
    setTanggalTransaksi(new Date().getTime());
  };

  const validateForms = () => {
    if (isEmpty(namaTransaksi)) {
      toast({
        title: "Gagal.",
        description: "Mohon mengisi nama transaksi.",
        status: "error",
        duration: 1500,
        position: isMobile ? "bottom" : "top",
        isClosable: true,
      });
      return false;
    }
    if (isEmpty(nominalTransaksi)) {
      toast({
        title: "Gagal.",
        description: "Mohon mengisi jumlah transaksi.",
        status: "error",
        duration: 1500,
        position: isMobile ? "bottom" : "top",
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleChangeNominal = (newValue) => {
    if (newValue === undefined) {
      setNominalTransaksi(0);
    } else {
      setNominalTransaksi(newValue);
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Jenis transaksi</FormLabel>
          <CreatableSelect
            isClearable
            options={options}
            value={jenisTransaksi}
            onChange={(item) => setJenisTransaksi(item)}
            placeholder="Pilih atau ketik jenis transaksi"
            styles={selectStyles}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Keterangan</FormLabel>
          <Input
            type="text"
            placeholder="Misal: Pembelian bahan baku"
            value={namaTransaksi}
            onChange={(e) => setNamaTransaksi(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Jumlah transaksi</FormLabel>
          <CurrencyInput
            className="currency-input"
            value={nominalTransaksi}
            onValueChange={handleChangeNominal}
            placeholder="Rp 0"
            intlConfig={{ locale: "id-ID", currency: "IDR" }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Tanggal transaksi</FormLabel>
          <DatePicker
            className="datepicker-input"
            placeholderText="Pilih tanggal"
            dateFormat="dd MMMM yyyy"
            selected={tanggalTransaksi}
            onChange={(date) => setTanggalTransaksi(date.getTime())}
          />
        </FormControl>
      </VStack>

      <Divider my={6} borderColor="surface.border" />

      <Flex
        align="center"
        justify="space-between"
        gap={3}
        bg="expense.50"
        borderRadius="lg"
        px={{ base: 4, md: 5 }}
        py={4}
      >
        <Box>
          <Text
            fontSize="xs"
            fontWeight={600}
            letterSpacing="0.08em"
            textTransform="uppercase"
            color="expense.600"
          >
            Total pengeluaran saat ini
          </Text>
          <Text
            mt={1}
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight={800}
            color="expense.600"
            fontVariantNumeric="tabular-nums"
          >
            Rp {formatter.format(totalIncome)}
          </Text>
        </Box>
        <Flex
          align="center"
          justify="center"
          boxSize="44px"
          borderRadius="full"
          bg="white"
          color="expense.500"
          flexShrink={0}
        >
          <ArrowUpIcon boxSize={5} />
        </Flex>
      </Flex>

      <Button
        mt={6}
        size="lg"
        w="100%"
        onClick={onSubmitIncome}
        bgGradient="linear(135deg, #FF7A7A 0%, #D14848 100%)"
        color="white"
        _hover={{ bgGradient: "linear(135deg, #EE5A5A 0%, #B53939 100%)" }}
      >
        Submit Pengeluaran
      </Button>
    </Box>
  );
};

export default OutcomeComponent;
