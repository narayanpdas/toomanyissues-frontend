import { Box, Container, VStack, Heading, Text, Input,Image, Flex, Link as ChakraLink } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react"; 
import { Field } from  "@chakra-ui/react"; 
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./auth/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { apiFetch } from "./auth/api";
import { toaster } from "./Page Components/toaster";
import logoUrl from '../public/logo.png';
export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();


const loginMutation = useMutation({
  mutationFn: async () => {
    const data = await apiFetch('/api/auth/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return data;
  },
  onSuccess: (data) => {

    login(data.jwtToken, data.refreshToken, data.role);
    toaster.create({
      title: "Login Successful",
      description: `Welcome back, ${username}!`,
      type: "success",
      meta: { closable: true }
    });
    navigate('/');
  },
  onError: (error) => {
    console.error("Login failed:", error);
    toaster.create({
      title: "Login Failed",
      description: "Please check your credentials and try again.",
      type: "error",
      meta: { closable: true }
    });
  }
});

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <Container w="md" py={20}>
      <Box bg="#1a1614" p={8} borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.100" shadow="2xl">
        <VStack gap={6} align="stretch">
          <Flex direction="column" align="center" mb={6} gap={3}>
          <Image src={logoUrl} alt="Too Many Issues Logo" boxSize="48px" borderRadius="md" />
            <Heading size="lg" color="white" letterSpacing="tight">
              Too Many Issues
            </Heading>
          </Flex>
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
                  Invalid username or password. Please try again.
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