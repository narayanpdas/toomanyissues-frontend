import { Box, Input, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi"; 

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(inputValue);
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [inputValue, onSearch]);

  return (
    <Box w="full" mb={6}>
      <Flex 
        align="center" 
        bg="blackAlpha.400" 
        borderWidth="1px" 
        borderColor="gray.600" 
        borderRadius="xl"
        px={4}
        transition="all 0.2s"
        _focusWithin={{ borderColor: "#f25f4c", boxShadow: "0 0 0 1px #f25f4c" }}
      >
        <Box color="gray.400" mr={3}>
          <FiSearch size={20} />
        </Box>
        <Input 
          placeholder="Search issues by title or description..."
          bg="transparent"
          border="none"
          outline="none"
          boxShadow="none"
          _focus={{ border: "none", boxShadow: "none", outline: "none" }}
          color="white"
          py={3}
          px={0}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          _placeholder={{ color: "gray.500" }}
        />
      </Flex>
    </Box>
  );
}