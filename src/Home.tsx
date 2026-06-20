import { Box, Heading, Text, Button, VStack, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box 
      flex="1" 
      h="full" 
      overflowY="auto" 
      px={6} 
      py={12} 
      bg="#0f0e17"
      css={{
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: '#ffc0ad', borderRadius: '8px' },
      }}
    >
      <VStack maxW="1000px" mx="auto" gap={12} align="center" textAlign="center" mt={8}>
        
        {/* Hero Section */}
        <VStack gap={4} maxW="750px">
          <Heading as="h1" size="3xl" fontWeight="bold" color="white" lineHeight="1.2">
            Find Your Next Open Source Contribution, <Text as="span" color="#ffc0ad">Instantly</Text>.
          </Heading>
          <Text fontSize="xl" color="gray.400">
            Want to solve open source issues but having difficulty finding the right one? 
            Our platform indexes real-time GitHub issues across core technical ecosystems, 
            filtering out the noise so you can start coding immediately.
          </Text>
          <Button 
            size="lg" 
            bg="#f25f4c" 
            color="white" 
            _hover={{ bg: "#d94b3a" }} 
            px={8} 
            mt={4}
            onClick={() => navigate("/issues")}
          >
            Explore Issues 🚀
          </Button>
        </VStack>
<VStack gap={6} w="full" pt={6} align="stretch" pb={12}>
          <Heading as="h2" size="xl" color="white" textAlign="left" borderBottom="2px solid" borderColor="#2a1f1b" pb={2}>
            System Highlights (For Recruiters)
          </Heading>
          <Text color="gray.400" textAlign="left" fontSize="md" mb={2}>
            This platform was built to demonstrate enterprise-ready Full-Stack engineering principles. Key engineering features implemented include:
          </Text>
        <VStack gap={4} w="full" align="stretch">
            {/* Horizontal Card 1 */}
            <Flex 
              direction={{ base: "column", md: "row" }} 
              bg="#2a1f1b" 
              p={6} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor="gray.700" 
              textAlign="left"
              align={{ base: "flex-start", md: "center" }}
              gap={{ base: 2, md: 8 }}
              _hover={{ borderColor: "#ffc0ad", bg: "#362722" }}
              transition="all 0.2s"
            >
              <Box flex={{ base: "none", md: "1" }} minW={{ md: "250px" }}>
                <Text fontSize="xl" fontWeight="bold" color="#ffc0ad">
                  Polyglot Data Pipeline
                </Text>
              </Box>
              <Box flex="3">
                <Text color="gray.300" fontSize="md" lineHeight="tall">
                  Engineered a highly resilient Spring Boot ingestion engine that dynamically polls 14,000+ GitHub repositories. Utilizes a dual-database architecture PostgreSQL for strict relational metadata and MongoDB with compound indexes for high-volume, unstructured issue text.
                </Text>
              </Box>
            </Flex>

            {/* Horizontal Card 2 */}
            <Flex 
              direction={{ base: "column", md: "row" }} 
              bg="#2a1f1b" 
              p={6} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor="gray.700" 
              textAlign="left"
              align={{ base: "flex-start", md: "center" }}
              gap={{ base: 2, md: 8 }}
              _hover={{ borderColor: "#ffc0ad", bg: "#362722" }}
              transition="all 0.2s"
            >
              <Box flex={{ base: "none", md: "1" }} minW={{ md: "250px" }}>
                <Text fontSize="xl" fontWeight="bold" color="#ffc0ad">
                  Distributed Concurrency & AI
                </Text>
              </Box>
              <Box flex="3">
                <Text color="gray.300" fontSize="md" lineHeight="tall">
                  Integrated Google Gemini to instantly summarize complex repository threads. To guarantee system stability under load, the AI layer is protected by Redis distributed atomic locks (SETNX), preventing race conditions and third-party API quota exhaustion.
                </Text>
              </Box>
            </Flex>

            {/* Horizontal Card 3 */}
            <Flex 
              direction={{ base: "column", md: "row" }} 
              bg="#2a1f1b" 
              p={6} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor="gray.700" 
              textAlign="left"
              align={{ base: "flex-start", md: "center" }}
              gap={{ base: 2, md: 8 }}
              _hover={{ borderColor: "#ffc0ad", bg: "#362722" }}
              transition="all 0.2s"
            >
              <Box flex={{ base: "none", md: "1" }} minW={{ md: "250px" }}>
                <Text fontSize="xl" fontWeight="bold" color="#ffc0ad">
                  Adaptive Data Pipelines
                </Text>
              </Box>
              <Box flex="3">
                <Text color="gray.300" fontSize="md" lineHeight="tall">
                  Engineered an optimized data pipeline leveraging GitHub's GraphQL API to minimize network payload sizes. Implemented an autonomous background cron job driven by a custom "Thermostat" algorithm that dynamically shifts polling frequencies (Hot/Warm/Cold) based on repository activity reducing unnecessary API consumption by over 60%.
                </Text>
              </Box>
            </Flex>
          </VStack>
          </VStack>
        </VStack>
    </Box>
  );
}