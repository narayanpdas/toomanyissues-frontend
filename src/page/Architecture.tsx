import { useState } from "react";
import { Box, Heading, Text, VStack, SimpleGrid, Image, Flex, Button } from "@chakra-ui/react";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogBody,
} from "@chakra-ui/react";

export default function Architecture() {

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const flows = [
    {
      title: "1. The Ingestion Engine (Cron Scraper)",
      description: "A resilient Spring Boot background service polling GitHub's GraphQL API. It utilizes a dynamic 'Thermostat' algorithm to adjust polling frequencies (Hot/Warm/Cold) based on repository activity, minimizing network payload and avoiding API rate limits.",
      imagePath: "/ingestion-engine.png", 
      imageScale: 1.1,
    },
    {
      title: "2. AI Summarization Pipeline",
      description: "Integrates Google Gemini to parse complex issue threads. To guarantee stability and prevent third-party API quota exhaustion, the endpoint is protected by Redis distributed atomic locks (SETNX) and implements a cache-aside pattern.",
      imagePath: "/summarizer-flow.png", 
      imageScale: 1.1,
    },
    {
      title: "3. Overall Cloud Infrastructure",
      description: "A decoupled microservice architecture. The React frontend is distributed via Vercel's Edge Network, communicating with a containerized Spring Boot backend. Data is routed between PostgreSQL (relational metadata) and MongoDB (unstructured markdown).",
      imagePath: "/cloud-network.png", 
      imageScale: 1.0,
    },
    {
      title: "4. Security & Authentication Layer",
      description: "Stateless JWT-based authentication flow. Features Role-Based Access Control (RBAC) for Admin features, secure password hashing (Bcrypt), and explicit Cross-Origin Resource Sharing (CORS) configurations to protect the REST API.",
      imagePath: "/security-chain.png", 
      imageScale: 1.08,
    }
  ];

  return (
    <>
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
        <VStack maxW="1200px" mx="auto" gap={8} align="stretch">
          
          <Box textAlign="center" mb={6}>
            <Heading as="h1" size="2xl" color="white" mb={4}>
              Under the Hood
            </Heading>
            <Text fontSize="lg" color="gray.400" maxW="800px" mx="auto">
              A look at the backend systems, data pipelines, and cloud infrastructure that power the Too Many Issues platform.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, xl: 2 }} gap={8}>
            {flows.map((flow, index) => (
              <Flex 
                key={index} 
                direction="column" 
                bg="#2a1f1b" 
                borderRadius="xl" 
                borderWidth="1px" 
                borderColor="gray.700"
                overflow="hidden"
                _hover={{ borderColor: "#ffc0ad" }}
                transition="all 0.2s"
              >
                <Box 
                  w="full" 
                  aspectRatio={16/9} 
                  bg="#1a1412" 
                  p={4}
                  position="relative"
                  overflow="hidden"
                  className="group"
                >
                  <Image 
                    src={flow.imagePath} 
                    alt={flow.title} 
                    w="full" 
                    h="full" 
                    objectFit="contain" 
                    cursor="zoom-in" // 2. Change cursor
                    onClick={() => setZoomedImage(flow.imagePath)} // 3. Trigger zoom
                    transform={`scale(${flow.imageScale})`} 
                    transition="transform 0.2s ease-in-out"
                    _groupHover={{ transform: `scale(${flow.imageScale + 0.05})` }}
                  />
                </Box>

                <VStack align="stretch" p={6} gap={2} flex="1">
                  <Heading as="h3" size="md" color="#ffc0ad">
                    {flow.title}
                  </Heading>
                  <Text color="gray.300" fontSize="sm" lineHeight="tall">
                    {flow.description}
                  </Text>
                </VStack>
              </Flex>
            ))}
          </SimpleGrid>

        </VStack>
      </Box>

      {/* 4. THE LIGHTBOX MODAL */}
      <DialogRoot 
        open={!!zoomedImage} 
        onOpenChange={(e) => {
          if (!e.open) setZoomedImage(null);
        }} 
        size="cover" 
        placement="center"
      >
        <DialogBackdrop bg="blackAlpha.800" backdropFilter="blur(10px)" zIndex={9998} />
        
        <DialogContent 
          bg="transparent" 
          boxShadow="none" 
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          margin={0}
          w="100vw"      
          h="100vh"      
          maxW="100vw"   
          zIndex={9999} 
          onClick={() => setZoomedImage(null)} // Click background to close
        >
          
          <Button 
            position="absolute"
            top={6}
            right={6}
            zIndex={10000}
            size="sm"
            bg="blackAlpha.700"
            color="white"
            borderRadius="full"
            px={4}
            _hover={{ bg: "blackAlpha.900", color: "#f25f4c" }}
            onClick={(e) => {
              e.stopPropagation(); 
              setZoomedImage(null);
            }}
          >
            ✕ Close
          </Button>
          
          <DialogBody display="flex" w="full" h="full" justifyContent="center" alignItems="center" p={0}>
            {zoomedImage && (
              <Image 
                src={zoomedImage} 
                maxW="95vw"    
                maxH="90vh" 
                objectFit="contain" 
                borderRadius="md" 
                boxShadow="dark-lg"
                onClick={(e) => e.stopPropagation()} // Prevent clicks on image from closing
                cursor="default"
              />
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
}