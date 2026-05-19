import { Box, Flex, Text } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

const TONES = {
  income: {
    bg: "linear-gradient(135deg, #13A981 0%, #018062 100%)",
    color: "white",
    iconBg: "rgba(255,255,255,0.18)",
    icon: <ArrowDownIcon boxSize={4} />,
    accent: "white",
  },
  expense: {
    bg: "linear-gradient(135deg, #FF7A7A 0%, #D14848 100%)",
    color: "white",
    iconBg: "rgba(255,255,255,0.18)",
    icon: <ArrowUpIcon boxSize={4} />,
    accent: "white",
  },
  profit: {
    bg: "white",
    color: "ink.900",
    iconBg: "brand.50",
    icon: null,
    accent: "brand.500",
    border: "1px solid",
    borderColor: "surface.border",
  },
  neutral: {
    bg: "white",
    color: "ink.900",
    iconBg: "surface.muted",
    icon: null,
    accent: "ink.700",
    border: "1px solid",
    borderColor: "surface.border",
  },
};

const StatCard = ({
  label,
  amount,
  tone = "neutral",
  icon,
  hint,
  isLoading = false,
  ...rest
}) => {
  const cfg = TONES[tone] || TONES.neutral;

  return (
    <Box
      borderRadius="xl"
      p={{ base: 4, md: 5 }}
      bg={cfg.bg}
      color={cfg.color}
      boxShadow={tone === "neutral" || tone === "profit" ? "soft" : "card"}
      border={cfg.border}
      borderColor={cfg.borderColor}
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{ transform: "translateY(-2px)", boxShadow: "card" }}
      {...rest}
    >
      <Flex align="center" justify="space-between" mb={3}>
        <Text
          fontSize="xs"
          fontWeight={600}
          letterSpacing="0.08em"
          textTransform="uppercase"
          opacity={tone === "neutral" || tone === "profit" ? 0.7 : 0.85}
        >
          {label}
        </Text>
        {(icon || cfg.icon) && (
          <Flex
            align="center"
            justify="center"
            boxSize={8}
            borderRadius="full"
            bg={cfg.iconBg}
            color={cfg.accent}
          >
            {icon || cfg.icon}
          </Flex>
        )}
      </Flex>
      <Text
        textStyle="moneyLg"
        opacity={isLoading ? 0.4 : 1}
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {amount}
      </Text>
      {hint && (
        <Text mt={1} fontSize="xs" opacity={0.75}>
          {hint}
        </Text>
      )}
    </Box>
  );
};

export default StatCard;
