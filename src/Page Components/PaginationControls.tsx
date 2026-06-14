import { HStack, Text } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react"; 
interface PaginationProps {
  currentPage: number; 
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <HStack justify="center" gap={6}  mt={4}>
      <Button 
        variant="outline"
        borderColor="gray.600"
        color="gray.300"
        borderRadius="3xl"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        _hover={{ bg: "whiteAlpha.200" }}
      >
        Previous
      </Button>
      
      <Text fontWeight="medium" color="gray.400">
        Page {currentPage + 1} of {totalPages}
      </Text>
      
      <Button 
        variant="outline"
        borderColor="gray.600"
        color="gray.300"
        borderRadius="3xl"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        _hover={{ bg: "whiteAlpha.200" }}
      >
        Next
      </Button>
    </HStack>
  );
}