import { Box, Container, VStack, Heading, Text, Input, Flex, Link as ChakraLink } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react"; 
import { Field } from "@chakra-ui/react"; 
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { apiFetch } from "./api";

// Reusing your categories for the preferences selector
const CATEGORIES = {
  PrimaryLanguage: ["python","c","c++","ruby","javascript","go", "java", "rust"],
  Type: ["bug", "feature", "documentation","ui/ux","refactor","testing","performance", "security","accessibility","build"],
};

export default function Register() {
  const navigate = useNavigate();

  // --- FORM STATE ---
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [primaryLanguages, setPrimaryLanguages] = useState<string[]>([]);

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
const toggleLabel = (category: string, label: string) => {
    if (category === "PrimaryLanguage") {
      setPrimaryLanguages((prev) =>
        prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
      );
    } else {
      setPreferences((prev) =>
        prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
      );
    }
  };
  const checkEmail = async () => {
    if (!email) return;
    try {
      const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
      console.log("Email check response:", res);
      if (res.status === 409 || !res.ok) {
        setEmailError("This email is already registered.");
      } else {
        setEmailError(""); 
      }
    } catch (e) {
      console.error("Failed to check email", e);
    }
  };

  const checkUsername = async () => {
    if (!username) return;
    try {
      // Adjust this URL to match your Spring Boot backend endpoint!
      const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
      console.log("Username check response:", res);

      if (res.status === 409 || !res.ok) {
        setUsernameError("This username is already taken.");
      } else {
        setUsernameError(""); 
      }
    } catch (e) {
      console.error("Failed to check username", e);
    }
  };

  const validatePassword = () => {
    if (password && password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (emailError || usernameError || password.length < 8) {
        throw new Error("Please fix the errors above before submitting.");
      }
      const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name,email, username, password, preferences,primaryLanguages }),
      });
      return response;
    },
    onSuccess: () => {
      // On success, automatically redirect to the login page
      navigate('/login');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }
    registerMutation.mutate();
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box bg="#1a1614" p={8} borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.100" shadow="2xl">
        <VStack gap={6} align="stretch">
          
          <Box textAlign="center" mb={2}>
            <Heading size="2xl" color="white" mb={2}>Create an Account</Heading>
            <Text color="gray.400">Set up your profile and choose your preferences.</Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack gap={5} align="stretch">
              
                <Field.Root required>
                <Field.Label color="white">Display Name</Field.Label>
                <Input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. first last" 
                  bg="blackAlpha.400" 
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: "#f25f4c", boxShadow: "none" }}
                  _placeholder={{ color: "gray.500" }}
                />
              </Field.Root>
               <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <Box flex="1">
                  <Field.Root required invalid={!!emailError}>
                    <Field.Label color="white">Email Address</Field.Label>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={checkEmail} 
                      bg="blackAlpha.400" 
                      borderColor={emailError ? "red.400" : "gray.600"}
                      color="white"
                      _focus={{ borderColor: "#f25f4c", boxShadow: "none" }}
                    />
                    {emailError && <Text color="red.400" fontSize="sm" mt={1}>{emailError}</Text>}
                  </Field.Root>
                </Box>
                <Box flex="1">
                  <Field.Root required invalid={!!usernameError}>
                    <Field.Label color="white">Username</Field.Label>
                    <Input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={checkUsername} 
                      bg="blackAlpha.400" 
                      borderColor={usernameError ? "red.400" : "gray.600"}
                      color="white"
                      _focus={{ borderColor: "#f25f4c", boxShadow: "none" }}
                    />
                    {usernameError && <Text color="red.400" fontSize="sm" mt={1}>{usernameError}</Text>}
                  </Field.Root>
                </Box>
              </Flex>

              <Field.Root required invalid={!!passwordError}>
                <Field.Label color="white">Password</Field.Label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                  bg="blackAlpha.400" 
                  borderColor={passwordError ? "red.400" : "gray.600"}
                  color="white"
                  _focus={{ borderColor: "#f25f4c", boxShadow: "none" }}
                />
                {passwordError && <Text color="red.400" fontSize="sm" mt={1}>{passwordError}</Text>}
              </Field.Root>
              <Box mt={4} p={5} bg="blackAlpha.300" borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.100">
                <Text color="white" fontWeight="bold" mb={1}>Issue Preferences</Text>
                <Text color="gray.400" fontSize="sm" mb={4}>
                  Select your stack so we can recommend the best issues for you.
                </Text>
                
                <VStack align="stretch" gap={4}>
                  {Object.entries(CATEGORIES).map(([categoryName, labels]) => (
                    <Box key={categoryName}>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={2} fontWeight="bold">
                        {categoryName === "PrimaryLanguage" ? "Primary Languages" : categoryName}
                      </Text>
                      <Flex wrap="wrap" gap={2}>
                        {labels.map((label) => {
                          const isSelected = categoryName === "PrimaryLanguage" 
                            ? primaryLanguages.includes(label) 
                            : preferences.includes(label);
                          return (
                            <Button
                              key={label}
                              type="button" // Prevents clicking this from submitting the form!
                              size="sm"
                              variant={isSelected ? "solid" : "outline"}
                              bg={isSelected ? "#f25f4c" : "transparent"}
                              color={isSelected ? "white" : "gray.300"}
                              borderColor={isSelected ? "#f25f4c" : "gray.600"}
                              _hover={{
                                bg: isSelected ? "#d94b3a" : "whiteAlpha.200",
                              }}
                              onClick={() => toggleLabel(categoryName, label)}
                            >
                              {label}
                            </Button>
                          );
                        })}
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>

              {/* MAIN ERROR MESSAGE */}
              {registerMutation.isError && (
                <Text color="red.400" fontSize="sm" textAlign="center">
                  {registerMutation.error.message}
                </Text>
              )}
              <Button 
                type="submit" 
                w="full" 
                bg="#f25f4c" 
                color="white" 
                size="lg" 
                mt={4}
                loading={registerMutation.isPending}
                disabled={!!emailError || !!usernameError || !!passwordError}
                _hover={{ bg: "#d94b3a" }}
              >
                Create Account
              </Button>

            </VStack>
          </form>

          <Flex justify="center" mt={2}>
            <Text color="gray.400" fontSize="sm">
              Already have an account?{' '}
              <ChakraLink asChild color="#f25f4c" fontWeight="medium">
                <RouterLink to="/login">Sign in here</RouterLink>
              </ChakraLink>
            </Text>
          </Flex>

        </VStack>
      </Box>
    </Container>
  );
}