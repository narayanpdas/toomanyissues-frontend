import { Box, Container, VStack, Heading, Text, Input, Flex, Link as ChakraLink } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react"; 
import { Field } from  "@chakra-ui/react"; 
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();


  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('api/auth/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Invalid credentials");
      return response.json();
    },
    onSuccess: (data) => {

      login(data.jwtToken,data.refreshToken,data.role);
      navigate('/');
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <Container w="md" py={20}>
      <Box bg="#1a1614" p={8} borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.100" shadow="2xl">
        <VStack gap={6} align="stretch">
          <Box textAlign="center" mb={4}>
            <Heading size="2xl" color="white" mb={2}>Welcome back</Heading>
            <Text color="gray.400">Sign in to claim bounties and track issues.</Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack gap={5} align="stretch">
              
              <Field.Root required>
  <Field.Label color={"white"}>Username</Field.Label>
  <Input 
    type="text" 
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    bg="blackAlpha.400" 
    borderColor="gray.600"
    color="white"
    _focus={{ borderColor: "#f25f4c", boxShadow: "none" }}
  />
</Field.Root>

<Field.Root required>
  <Field.Label color={"white"}>Password</Field.Label>
  <Input 
    type="password" 
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    bg="blackAlpha.400" 
    borderColor="gray.600"
    color="white"
    _focus={{ borderColor: "#f25f4c", boxShadow: "none" }}
  />
</Field.Root>

              {loginMutation.isError && (
                <Text color="red.400" fontSize="sm">
                  {loginMutation.error.message}
                </Text>
              )}
              <Button 
                type="submit" 
                w="full" 
                bg="#f25f4c" 
                color="white" 
                size="lg" 
                mt={2}
                loading={loginMutation.isPending}
                _hover={{ bg: "#d94b3a" }}
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <Flex justify="center" mt={2}>
            <Text color="gray.400" fontSize="sm">
              Don't have an account?{' '}
              <ChakraLink asChild color="#f25f4c" fontWeight="medium">
                <RouterLink to="/register">Register here</RouterLink>
              </ChakraLink>
            </Text>
          </Flex>

        </VStack>
      </Box>
    </Container>
  );
}