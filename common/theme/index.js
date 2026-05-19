import { extendTheme } from "@chakra-ui/react";

const fontStack = `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    heading: fontStack,
    body: fontStack,
  },
  colors: {
    brand: {
      50: "#E6F7F1",
      100: "#C2EBDC",
      200: "#92D9BF",
      300: "#5CC4A0",
      400: "#2EAE82",
      500: "#018062",
      600: "#016A52",
      700: "#0D3D31",
      800: "#082821",
      900: "#031310",
    },
    income: {
      50: "#E7F8F0",
      500: "#13A981",
      600: "#0E8F6D",
    },
    expense: {
      50: "#FDECEC",
      500: "#EE5A5A",
      600: "#D14848",
    },
    surface: {
      base: "#F4F7F5",
      muted: "#EEF2F0",
      card: "#FFFFFF",
      border: "#E6ECE9",
    },
    ink: {
      900: "#0F1A16",
      700: "#384743",
      500: "#637773",
      400: "#8C9C97",
      300: "#B6C2BE",
    },
  },
  radii: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "28px",
    pill: "999px",
  },
  shadows: {
    soft: "0 1px 2px rgba(15, 60, 50, 0.04), 0 2px 8px rgba(15, 60, 50, 0.06)",
    card: "0 4px 12px rgba(15, 60, 50, 0.06), 0 12px 32px rgba(15, 60, 50, 0.08)",
    glow: "0 8px 24px rgba(1, 128, 98, 0.25)",
    insetSoft: "inset 0 0 0 1px rgba(15, 60, 50, 0.06)",
  },
  layerStyles: {
    card: {
      bg: "surface.card",
      borderRadius: "lg",
      boxShadow: "soft",
      border: "1px solid",
      borderColor: "surface.border",
    },
    cardElevated: {
      bg: "surface.card",
      borderRadius: "xl",
      boxShadow: "card",
      border: "1px solid",
      borderColor: "surface.border",
    },
    pill: {
      borderRadius: "pill",
      px: 4,
      py: 2,
      fontWeight: 500,
    },
  },
  textStyles: {
    pageTitle: {
      fontSize: { base: "xl", md: "2xl" },
      fontWeight: 700,
      letterSpacing: "-0.01em",
      color: "ink.900",
    },
    sectionTitle: {
      fontSize: { base: "md", md: "lg" },
      fontWeight: 600,
      color: "ink.900",
    },
    label: {
      fontSize: "xs",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontWeight: 600,
      color: "ink.500",
    },
    money: {
      fontSize: { base: "2xl", md: "3xl" },
      fontWeight: 700,
      letterSpacing: "-0.01em",
      fontVariantNumeric: "tabular-nums",
    },
    moneyLg: {
      fontSize: { base: "3xl", md: "4xl" },
      fontWeight: 800,
      letterSpacing: "-0.02em",
      fontVariantNumeric: "tabular-nums",
    },
  },
  styles: {
    global: {
      "html, body": {
        bg: "surface.base",
        color: "ink.900",
        fontFeatureSettings: '"cv02","cv03","cv04","cv11"',
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      "*::selection": {
        bg: "brand.100",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 600,
        borderRadius: "pill",
      },
      variants: {
        solid: (props) => {
          if (props.colorScheme === "brand") {
            return {
              bg: "brand.500",
              color: "white",
              _hover: { bg: "brand.600", _disabled: { bg: "brand.500" } },
              _active: { bg: "brand.700" },
              boxShadow: "glow",
            };
          }
          return {};
        },
        ghostOnSurface: {
          bg: "surface.muted",
          color: "ink.700",
          _hover: { bg: "surface.border" },
        },
      },
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Input: {
      variants: {
        soft: {
          field: {
            bg: "surface.muted",
            border: "1px solid",
            borderColor: "transparent",
            borderRadius: "md",
            _hover: { borderColor: "surface.border" },
            _focus: {
              borderColor: "brand.400",
              bg: "white",
              boxShadow: "0 0 0 3px rgba(46, 174, 130, 0.15)",
            },
          },
        },
      },
      defaultProps: { variant: "soft" },
    },
    FormLabel: {
      baseStyle: {
        fontSize: "sm",
        fontWeight: 600,
        color: "ink.700",
        mb: 1.5,
      },
    },
    Heading: {
      baseStyle: {
        letterSpacing: "-0.01em",
      },
    },
  },
});

export default theme;
