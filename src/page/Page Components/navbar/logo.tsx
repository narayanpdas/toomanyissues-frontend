import { Box, Text ,Image} from "@chakra-ui/react";

const Logo = () => {
  return (
    <Box display="flex" alignItems="center" gap={4}>
      <Image src="/logo.png" alt="Logo" height="40px" />
      <Text fontSize="lg" fontWeight="bold" color="blue.600">
        Too Many Issues
      </Text>
    </Box>
  );
};

export default Logo;