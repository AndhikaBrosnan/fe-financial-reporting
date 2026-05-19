import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import CreatableSelect from "react-select/creatable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import CurrencyInput from "react-currency-input-field";
import { isMiniMobileHandler } from "../../../../common/helpers/responsive";
import { supabase } from "../../../../common/helpers/supabaseClient";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderRadius: 12,
    background: state.isFocused ? "#fff" : "#EEF2F0",
    borderColor: state.isFocused ? "#2EAE82" : "transparent",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(46, 174, 130, 0.15)" : "none",
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
      ? "#018062"
      : state.isFocused
        ? "#E6F7F1"
        : "#fff",
    color: state.isSelected ? "#fff" : "#0F1A16",
    cursor: "pointer",
  }),
};

const IncomeComponent = () => {
  const formatter = new Intl.NumberFormat("id-ID");
  const isMobile = isMiniMobileHandler();
  const toast = useToast();

  const [jenisTransaksi, setJenisTransaksi] = useState("");
  const [namaTransaksi, setNamaTransaksi] = useState("");
  const [nominalTransaksi, setNominalTransaksi] = useState(null);
  const [tanggalTransaksi, setTanggalTransaksi] = useState(
    new Date().getTime()
  );
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        setTransactions(Array.isArray(parsed) ? parsed : []);
      } catch {
        setTransactions([]);
      }
    }
  }, []);

  const options = [
    { value: "penjualan", label: "Penjualan" },
    { value: "penambahan modal", label: "Penambahan modal" },
    { value: "pendapatan di luar usaha", label: "Pendapatan di luar usaha" },
    { value: "pendapatan jasa", label: "Pendapatan jasa" },
    { value: "terima pinjaman", label: "Terima pinjaman" },
    { value: "penagihan utang/cicilan", label: "Penagihan utang/ cicilan" },
  ];

  useEffect(() => {
    if (!Array.isArray(transactions)) {
      setTotalIncome(0);
      return;
    }

    const calculateIncome = transactions.reduce((accumulator, currentValue) => {
      if (currentValue.type === "income")
        return accumulator + parseInt(currentValue.nominal);
      return accumulator;
    }, 0);

    setTotalIncome(calculateIncome);
  }, [transactions]);

  const onSubmitIncome = async () => {
    const validate = validateForms();
    if (!validate) return;

    const transactionTemp = {
      type: "income",
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
      console.error("error income upsert: ", error);
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
      description: "Pemasukan telah dicatat.",
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
      <VStack spacing={ 4 } align="stretch">
        <FormControl isRequired>
          <FormLabel>Jenis transaksi</FormLabel>
          <CreatableSelect
            isClearable
            options={ options }
            value={ jenisTransaksi }
            onChange={ (item) => setJenisTransaksi(item) }
            placeholder="Pilih atau ketik jenis transaksi"
            styles={ selectStyles }
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Keterangan</FormLabel>
          <Input
            type="text"
            placeholder="Misal: Penjualan 12 pcs kaos"
            value={ namaTransaksi }
            onChange={ (e) => setNamaTransaksi(e.target.value) }
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Jumlah transaksi</FormLabel>
          <CurrencyInput
            className="currency-input"
            value={ nominalTransaksi }
            onValueChange={ handleChangeNominal }
            placeholder="Rp 0"
            intlConfig={ { locale: "id-ID", currency: "IDR" } }
          />
        </FormControl>

        <FormControl>
          <FormLabel>Tanggal transaksi</FormLabel>
          <DatePicker
            className="datepicker-input"
            placeholderText="Pilih tanggal"
            dateFormat="dd MMMM yyyy"
            selected={ tanggalTransaksi }
            onChange={ (date) => setTanggalTransaksi(date.getTime()) }
          />
        </FormControl>
      </VStack>

      <Divider my={ 6 } borderColor="surface.border" />

      <Flex
        align="center"
        justify="space-between"
        gap={ 3 }
        bg="income.50"
        borderRadius="lg"
        px={ { base: 4, md: 5 } }
        py={ 4 }
      >
        <Box>
          <Text
            fontSize="xs"
            fontWeight={ 600 }
            letterSpacing="0.08em"
            textTransform="uppercase"
            color="income.600"
          >
            Total pemasukan saat ini
          </Text>
          <Text
            mt={ 1 }
            fontSize={ { base: "xl", md: "2xl" } }
            fontWeight={ 800 }
            color="income.600"
            fontVariantNumeric="tabular-nums"
          >
            Rp { formatter.format(totalIncome) }
          </Text>
        </Box>
        <Flex
          align="center"
          justify="center"
          boxSize="44px"
          borderRadius="full"
          bg="white"
          color="income.500"
          flexShrink={ 0 }
        >
          <ArrowDownIcon boxSize={ 5 } />
        </Flex>
      </Flex>

      <Button
        mt={ 6 }
        size="lg"
        w="100%"
        onClick={ onSubmitIncome }
        bgGradient="linear(135deg, #13A981 0%, #018062 100%)"
        color="white"
        _hover={ { bgGradient: "linear(135deg, #0E8F6D 0%, #016A52 100%)" } }
      >
        Submit Pemasukan
      </Button>
    </Box>
  );
};

export default IncomeComponent;
