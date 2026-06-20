import { Box, Flex, Text, IconButton, Center } from "@chakra-ui/react";
import { useState } from "react";
import { FiInfo, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

interface SystemBannerProps {
  message: string;
  type?: "info" | "warning" | "error";
  isDismissible?: boolean;
}

export default function SystemBanner({ message, type = "info", isDismissible = true }: SystemBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const bgColors = {
    info: "blue.900",
    warning: "orange.900",
    error: "red.900",
  };
  const textColors = {
    info: "blue.200",
    warning: "orange.200",
    error: "red.200",
  };

  return (
    <Center bg={`${bgColors[type]}80`} w="full" py={2} position="relative" zIndex={1000}>
    <Box bg={bgColors[type]} w="fill" py={2} px={4} 
    borderRadius={"3xl"} borderBottomWidth="1px" borderColor={`${textColors[type]}40`}>
      <Flex maxW="1600px" mx="auto" align="center" justify="space-between">
        <Flex align="center" gap={3}>
          <Box color={textColors[type]}><FiInfo /></Box>
          <Text  color={textColors[type]} fontSize="sm" fontWeight="medium">
            {message}
            <Link to="/about" style={{ textDecoration: "underline", color: textColors[type] }}>
              {" "} Contact me
            </Link>
          </Text>
        </Flex>
        {isDismissible && (
          <IconButton 
            size="xs" 
            variant="ghost" 
            color={textColors[type]} 
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss banner"
          >
            <FiX />
          </IconButton>
        )}
      </Flex>
    </Box>
  </Center>
  );
}