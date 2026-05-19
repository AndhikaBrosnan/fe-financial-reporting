import { Box, Flex, Text } from "@chakra-ui/react";

const SectionTitle = ({ eyebrow, title, action, mt = 6, mb = 3 }) => {
  return (
    <Flex align="end" justify="space-between" mt={mt} mb={mb} gap={3}>
      <Box>
        {eyebrow && (
          <Text
            fontSize="xs"
            fontWeight={600}
            letterSpacing="0.08em"
            textTransform="uppercase"
            color="ink.500"
            mb={1}
          >
            {eyebrow}
          </Text>
        )}
        <Text textStyle="sectionTitle" lineHeight="1.2">
          {title}
        </Text>
      </Box>
      {action}
    </Flex>
  );
};

export default SectionTitle;
