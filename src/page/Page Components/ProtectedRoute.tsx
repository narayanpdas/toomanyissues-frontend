import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { toaster } from "./toaster";
import { Button, Center, Heading, VStack,Text } from "@chakra-ui/react";
import { FiLock } from "react-icons/fi";

export default function ProtectedRoute({requireAdmin = false}: {requireAdmin?: boolean}) {
  const { isAuthenticated ,role} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toaster.create({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
        type: "error",
        action: {
          label: "Sign In",
          onClick: () => {
navigate("/login", { state: { from: location.pathname } });
          }
        },
        meta: { closable: true }
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (<Center h="70vh" w="full">
        <VStack gap={4} p={8} bg="blackAlpha.300" borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.100">
          <FiLock size={48} color="gray" />
          <Heading color="white" size="lg">Restricted</Heading>
          <Text color="gray.400" textAlign="center" maxW="sm">
            {(requireAdmin && role !== 'ADMIN') ? 'You need to be an administrator to view this content.' : 'You need to sign in to view this content.'}
          </Text>
          <Button 
            mt={4}
            bg="#f25f4c" 
            color="white" 
            _hover={{ bg: "#d94b3a" }}
            onClick={() => navigate("/login", { state: { from: location.pathname } })}
          >
            Go to Sign In
          </Button>
        </VStack>
      </Center>
    );
  }
  return <Outlet />;
}