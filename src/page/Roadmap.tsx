import { Box, Heading, Text, VStack, Flex, Badge, Icon } from "@chakra-ui/react";
import { 
  IoRocketOutline, 
  IoAnalyticsOutline, 
  IoFlashOutline, 
  IoPulseOutline 
} from "react-icons/io5";

export default function Roadmap() {
  const upcomingFeatures = [
    {
      id: "01",
      category: "Feature Scaling",
      title: "GSoC & Event Aggregation",
      icon: IoRocketOutline,
      color: "blue",
      description: "Implementing dedicated event tabs to aggregate and showcase issues for massive open-source programs like Google Summer of Code (GSoC). This includes expanding our ingestion engine to support multi-platform sources, tracking repositories across GitLab alongside GitHub."
    },
    {
      id: "02",
      category: "AI/ML Integration",
      title: "Vector-Based User Recommendations",
      icon: IoAnalyticsOutline,
      color: "purple",
      description: "Transitioning from basic text-matching to a semantic search architecture. By generating vector embeddings for GitHub issues and a user's past commit history (via pgvector or MongoDB Vector Search), the platform will autonomously recommend issues perfectly aligned with a developer's specific coding style and skill level."
    },
    {
      id: "03",
      category: "Architecture Upgrade",
      title: "Event-Driven GitHub Webhooks",
      icon: IoFlashOutline,
      color: "green",
      description: "Phasing out the Hot/Warm/Cold polling state-machine for high-tier enterprise repositories in favor of a purely event-driven architecture using GitHub Webhooks. This will reduce scheduled API consumption to zero for those repos while achieving true millisecond real-time issue syncing."
    },
    {
      id: "04",
      category: "UX & Performance",
      title: "Server-Sent Events (SSE) AI Streaming",
      icon: IoPulseOutline,
      color: "orange",
      description: "Upgrading the Gemini AI summarization pipeline to utilize Server-Sent Events (SSE). Instead of making the client wait for the entire summary generation to finish, the Spring Boot backend will stream AI tokens directly to the React frontend in real-time, drastically reducing the perceived latency."
    }
  ];

  return (
    <Box 
      flex="1" 
      h="full" 
      overflowY="auto" 
      px={6} 
      py={10} 
      bg="#0f0e17"
      css={{
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: '#ffc0ad', borderRadius: '8px' },
      }}
    >
      <VStack maxW="900px" mx="auto" gap={10} align="stretch">
        
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Heading as="h1" size="2xl" color="white" mb={4}>
            What's Next? <Text as="span" color="#ffc0ad">(v3 Roadmap)</Text>
          </Heading>
          <Text fontSize="lg" color="gray.400" maxW="700px" mx="auto">
            Development never stops. Here is a look at the upcoming features and architectural overhauls planned for the next major release of Too Many Issues.
          </Text>
        </Box>

        {/* Roadmap Timeline */}
        <VStack gap={6} align="stretch">
          {upcomingFeatures.map((feature) => (
            <Flex 
              key={feature.id}
              direction={{ base: "column", md: "row" }}
              bg="#2a1f1b"
              p={6}
              borderRadius="xl"
              borderWidth="1px"
              borderColor="gray.700"
              gap={{ base: 4, md: 8 }}
              align={{ base: "flex-start", md: "center" }}
              position="relative"
              overflow="hidden"
              _hover={{ borderColor: `${feature.color}.400`, transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              {/* Subtle background glow based on category color */}
              <Box 
                position="absolute" 
                top="-20px" 
                left="-20px" 
                w="100px" 
                h="100px" 
                bg={`${feature.color}.500`} 
                filter="blur(60px)" 
                opacity={0.15} 
                zIndex={0}
              />
              <Flex 
                direction="column" 
                align="center" 
                justify="center" 
                minW="80px" 
                zIndex={1}
              >
                <Text fontSize="4xl" fontWeight="black" color={`${feature.color}.400`} lineHeight="1">
                  {feature.id}
                </Text>
                <Icon as={feature.icon} boxSize={6} color={`${feature.color}.400`} mt={-2} />
              </Flex>

              {/* Text Content */}
              <Box flex="1" zIndex={1}>
                <Badge colorScheme={feature.color} backgroundColor={`${feature.color}.300`} mb={2} borderRadius="md" px={2} py={0.5}>
                  {feature.category}
                </Badge>
                <Heading as="h3" size="md" color="white" mb={2}>
                  {feature.title}
                </Heading>
                <Text color="gray.300" fontSize="md" lineHeight="tall">
                  {feature.description}
                </Text>
              </Box>
            </Flex>
          ))}
        </VStack>

      </VStack>
    </Box>
  );
}