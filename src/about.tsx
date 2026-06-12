import { Box, Container, VStack, Heading, Text, Flex, Link as ChakraLink } from "@chakra-ui/react";

export default function About() {
  const techStack = [
    "React", "TypeScript", "Chakra UI v3", 
    "Spring Boot", "Java", "MongoDB", "PostgreSQL","GitHub API",
  ];

  return (
    <Container maxW="container.md" py={12} color="gray.300">
      <VStack gap={10} align="stretch" scrollBehavior={"smooth"}>
        
        <Box textAlign="center" mb={4}>
          <Heading size="3xl" color="white" mb={4} letterSpacing="tight">
            About the Project
          </Heading>
          <Text fontSize="lg" color="gray.400">
            A tool to help developers find their next contribution or Repo.
          </Text>
        </Box>
        <Box bg="#1a1614" p={8} borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.100" shadow="xl">
          <Heading size="lg" color="white" mb={4}>
             Accelerating your Journey with Open Source
          </Heading>
          <Text lineHeight="tall">
            Contributing to open source is an incredible experience, 
            but finding the issues especially the right ones to tackle is often the hardest part. <br/>
            This platform is aimed to cut through this challenge,
            by surfacing relevant and recent issues that help you in your contribution.
          </Text>
        </Box>
        <Box bg="#1a1614" p={8} borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.100" shadow="xl">
          <Heading size="lg" color="white" mb={4}>
            The Advantage
          </Heading>
          <Text lineHeight="tall" mb={4}>
            While traditional GitHub searches and tools like {" "}
            <ChakraLink href="https://goodfirstissue.dev" target="_blank" color="#f25f4c" fontWeight="bold"> goodfirstissue.dev </ChakraLink> 
            {" "}
            are great, they often lack control and personalization. Here is how this platform goes deeper:
          </Text>
          <VStack align="stretch" gap={3} pl={4}>
            <Text><b>• Personalized Recommendations:</b> Unlike static lists, the recommendation engine tailors issues specifically to your stack and experience level.</Text>
            <Text><b>• Advanced Filtering:</b> Instantly pivot between languages, bug fixes, enhancements, and paid bounties without writing complex GitHub search queries or google searches.</Text>
            <Text><b>• Everything at a glance:</b> Get a quick overview of all the relevant information of an issue without having to navigate through multiple pages.</Text>

          </VStack>
        </Box>

        <Box bg="#1a1614" p={8} borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.100" shadow="xl">
          <Heading size="lg" color="white" mb={4}>
            About Me
          </Heading>
          <Text lineHeight="tall">
            I built this tool because I was facing a similar problem. 
            I wanted to find more active repository based on the number of issues but found myself spending more 
            time juggling through github's UI and less time actually searching.
            I built this application to solve that bottleneck for myself, and hopefully, 
            for thousands of other developers looking to make their mark on the open-source community.
          </Text>
        </Box>

        <Box bg="#1a1614" p={8} borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.100" shadow="xl">
          <Heading size="lg" color="white" mb={4}>
            Tech Stack Used
          </Heading>
          <Flex wrap="wrap" gap={3}>
            {techStack.map((tech) => (
              <Box 
                key={tech} 
                px={4} 
                py={2} 
                bg="blackAlpha.500" 
                borderWidth="1px"
                borderColor="#f25f4c"
                color="#f2f2f2"
                borderRadius="full"
                fontSize="sm"
                fontWeight="medium"
              >
                {tech}
              </Box>
            ))}
          </Flex>
        </Box>

        {/* Section 5: Connect With Me */}
        <Box bg="#1a1614" p={8} borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.100" shadow="xl">
          <Heading size="lg" color="white" mb={4}>
            Connect with Me
          </Heading>
          <Text mb={6}>
            Got feedback, feature requests, or just want to chat about tech? I'd love to hear from you.
          </Text>
          <Flex gap={4} wrap="wrap">
            <ChakraLink 
              href="https://github.com/narayandabu" 
              target="_blank" 
              color="#f25f4c" 
              fontWeight="bold"
              _hover={{ color: "#d94b3a", textDecoration: "underline" }}
            >
              GitHub
            </ChakraLink>
            <Text color="gray.600">•</Text>
            <ChakraLink 
              href="https://linkedin.com/in/YOUR_USERNAME" 
              target="_blank" 
              color="#f25f4c" 
              fontWeight="bold"
              _hover={{ color: "#d94b3a", textDecoration: "underline" }}
            >
              LinkedIn
            </ChakraLink>
            <Text color="gray.600">•</Text>
            <ChakraLink 
              href="mailto:your.email@example.com" 
              color="#f25f4c" 
              fontWeight="bold"
              _hover={{ color: "#d94b3a", textDecoration: "underline" }}
            >
              Email Me
            </ChakraLink>
          </Flex>
        </Box>
      </VStack>
    </Container>
  );
}