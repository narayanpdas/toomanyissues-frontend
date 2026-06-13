import { 
  Box, Container, VStack, Heading, Text, Input, Flex, 
  Spinner, Center, Badge, HStack, Separator 
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./auth/api"; 

const CATEGORIES = {
  PrimaryLanguage: ["python", "c", "c++", "ruby", "javascript", "go", "java", "rust"],
  Type: ["bug", "feature", "documentation", "ui/ux", "refactor", "testing", "performance", "security", "accessibility", "build"]
};

interface UserProfile {
  name: string;
  username: string;
  email: string;
  preferences: string[];
  primaryLanguages: string[];
}

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);

  const [draftName, setDraftName] = useState("");
  const [draftPreferences, setDraftPreferences] = useState<string[]>([]);
  const [draftLanguages, setDraftLanguages] = useState<string[]>([]);
  
  const [draftPassword, setDraftPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await apiFetch('/api/users/me');
      return response as UserProfile;
    },
  });

  useEffect(() => {
    if (user) {
      setDraftName(user.name || "");
      setDraftPreferences(user.preferences || []);
      setDraftLanguages(user.primaryLanguages || []);
      setDraftPassword(""); 
      setPasswordError("");
    }
  }, [user, isEditing]);

  const toggleLabel = (category: string, label: string) => {
    if (category === "PrimaryLanguage") {
      setDraftLanguages((prev) =>
        prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
      );
    } else {
      setDraftPreferences((prev) =>
        prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
      );
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setDraftPassword(newVal);
    if (newVal && newVal.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError("");
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (draftPassword && draftPassword.length < 8) {
        throw new Error("Please fix the password errors before saving.");
      }

      const payload: any = {
        name: draftName,
        preferences: draftPreferences,
        primaryLanguages: draftLanguages,
      };
      if (draftPassword) {
        payload.password = draftPassword;
      }

      const response = await apiFetch('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setIsEditing(false); 
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
      }).catch(() => null); 
    },
    onSettled: () => {
      localStorage.removeItem('jwt');
      queryClient.clear(); 
      navigate('/login');
    }
  });

  if (isLoading) {
    return (
      <Center h="50vh">
        <VStack gap={3}>
          <Spinner color="#f25f4c" borderWidth="4px" size="xl" />
          <Text color="gray.400">Loading profile...</Text>
        </VStack>
      </Center>
    );
  }

  if (isError || !user) {
    return (
      <Center h="50vh">
        <Text color="red.400">Failed to load profile data.</Text>
      </Center>
    );
  }

  return (
    <Box 
      h="full" 
      w="full"
      overflowY="auto" 
      css={{
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: '#ffc0ad', borderRadius: '8px' },
        '&::-webkit-scrollbar-thumb:hover': { background: '#f7a890' },
      }}
    >
    <Container maxW="container.md" py={10}>
      <Box bg="#1a1614" p={8} borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.100" shadow="2xl">
        
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading size="xl" color="white">Your Profile</Heading>
            <Text color="gray.400">Manage your account settings and preferences.</Text>
          </Box>
          <Button 
            variant={isEditing ? "ghost" : "outline"}
            color={isEditing ? "gray.400" : "white"}
            borderColor={isEditing ? "transparent" : "gray.600"}
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => setIsEditing(!isEditing)}
            disabled={updateProfileMutation.isPending}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </Flex>

        <Separator borderColor="whiteAlpha.200" mb={6} />

        <VStack gap={6} align="stretch">
          
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <Box flex="1">
              <Field.Root>
                <Field.Label color="white">Display Name</Field.Label>
                {isEditing ? (
                  <Input 
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    bg="blackAlpha.400" 
                    borderColor="gray.600"
                    color="white"
                    _focus={{ borderColor: "#f25f4c", boxShadow: "none" }}
                  />
                ) : (
                  <Text color="gray.300" p={2} bg="whiteAlpha.50" borderRadius="md" borderWidth="1px" borderColor="transparent">
                    {user.name || "Not provided"}
                  </Text>
                )}
              </Field.Root>
            </Box>

            <Box flex="1">
              <Field.Root readOnly>
                <Field.Label color="gray.400">Username (Read-only)</Field.Label>
                <Input 
                  value={user.username}
                  bg="whiteAlpha.50" 
                  borderColor="transparent"
                  color="gray.500"
                  cursor="not-allowed"
                />
              </Field.Root>
            </Box>
          </Flex>

          <Field.Root readOnly>
            <Field.Label color="gray.400">Email Address (Read-only)</Field.Label>
            <Input 
              value={user.email}
              bg="whiteAlpha.50" 
              borderColor="transparent"
              color="gray.500"
              cursor="not-allowed"
            />
          </Field.Root>

          {/* NEW: Conditional Password Field */}
          {isEditing && (
             <Field.Root invalid={!!passwordError}>
               <Field.Label color="white">New Password</Field.Label>
               <Input 
                 type="password"
                 value={draftPassword}
                 onChange={handlePasswordChange}
                 placeholder="Leave blank to keep your current password"
                 bg="blackAlpha.400" 
                 borderColor={passwordError ? "red.400" : "gray.600"}
                 color="white"
                 _focus={{ borderColor: "#f25f4c", boxShadow: "none" }}
                 _placeholder={{ color: "gray.600" }}
               />
               {passwordError && <Text color="red.400" fontSize="sm" mt={1}>{passwordError}</Text>}
             </Field.Root>
          )}

          <Box mt={4} p={5} bg="blackAlpha.300" borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.100">
            <Text color="white" fontWeight="bold" mb={4}>Developer Preferences</Text>
            
            <VStack align="stretch" gap={6}>
              {Object.entries(CATEGORIES).map(([categoryName, allLabels]) => {
                const isLang = categoryName === "PrimaryLanguage";
                const activeArray = isEditing 
                  ? (isLang ? draftLanguages : draftPreferences) 
                  : (isLang ? user.primaryLanguages : user.preferences);

                return (
                  <Box key={categoryName}>
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={3} fontWeight="bold">
                      {isLang ? "Primary Languages" : "Issue Types"}
                    </Text>

                    {isEditing ? (
                      <Flex wrap="wrap" gap={2}>
                        {allLabels.map((label) => {
                          const isSelected = activeArray.includes(label);
                          return (
                            <Button
                              key={label}
                              size="sm"
                              variant={isSelected ? "solid" : "outline"}
                              bg={isSelected ? "#f25f4c" : "transparent"}
                              color={isSelected ? "white" : "gray.300"}
                              borderColor={isSelected ? "#f25f4c" : "gray.600"}
                              _hover={{ bg: isSelected ? "#d94b3a" : "whiteAlpha.200" }}
                              onClick={() => toggleLabel(categoryName, label)}
                            >
                              {label}
                            </Button>
                          );
                        })}
                      </Flex>
                    ) : (
                      <Flex wrap="wrap" gap={2}>
                        {activeArray?.length > 0 ? (
                          activeArray.map((label) => (
                            <Badge key={label} bg="#f25f4c" color="white" px={2} py={1} borderRadius="md" textTransform="lowercase">
                              {label}
                            </Badge>
                          ))
                        ) : (
                          <Text color="gray.500" fontSize="sm" fontStyle="italic">None selected</Text>
                        )}
                      </Flex>
                    )}
                  </Box>
                );
              })}
            </VStack>
          </Box>

          {updateProfileMutation.isError && (
             <Text color="red.400" fontSize="sm" textAlign="right">
               {updateProfileMutation.error.message || "Failed to save profile updates."}
             </Text>
          )}

          <HStack justify={isEditing ? "flex-end" : "space-between"} mt={4} pt={4} borderTopWidth="1px" borderColor="whiteAlpha.100">
            {!isEditing && (
              <Button 
                variant="outline" 
                color="red.400" 
                borderColor="red.900"
                _hover={{ bg: "red.900", color: "red.200" }}
                onClick={() => logoutMutation.mutate()}
                loading={logoutMutation.isPending}
              >
                Sign Out
              </Button>
            )}

            {isEditing && (
              <Button 
                bg="#f25f4c" 
                color="white" 
                px={8}
                _hover={{ bg: "#d94b3a" }}
                onClick={() => updateProfileMutation.mutate()}
                loading={updateProfileMutation.isPending}
                disabled={!!passwordError}
              >
                Save Changes
              </Button>
            )}
          </HStack>

        </VStack>
      </Box>
    </Container>
    </Box>
  );
}