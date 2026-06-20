import { Box, Container, VStack, SegmentGroup, Text, Flex } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react"; // Adjust path to your snippets
import { useState } from "react";

// 1. Define the props to communicate with App.tsx
interface LabelsDisplayProps {
  activeSort: string;
initialLabels: string[];
PrimaryLanguages: string [];
  onSortChange: (sort: string) => void;
onApplyFilters: (language: string[], labels: string[]) => void;
  onSignInRequest: () => boolean;
}

const CATEGORIES = {
  PrimaryLanguage: ["python","c","c++","c#","ruby","javascript","go", "java", "rust"],
  Type: ["bug", "feature", "documentation","ui/ux","refactor","testing","performance", "security","accessibility","build"],
  Others: ["good first issue","help wanted", "bounty"]
};

export default function LabelsDisplay({ activeSort, 
  initialLabels,
  PrimaryLanguages, 
  onSortChange, 
  onApplyFilters, 
  onSignInRequest}: LabelsDisplayProps) {


  const [draftLabels, setDraftLabels] = useState<string[]>(initialLabels);
  const [draftLanguages, setDraftLanguages] = useState<string[]>(PrimaryLanguages);
  const toggleLabel = (category: string,label: string) => {
if (category === "PrimaryLanguage") {
    setDraftLanguages((prev) => 
        prev.includes(label) 
          ? prev.filter((l) => l !== label) 
          : [...prev, label]
      );
    } else {
     
      setDraftLabels((prev) => 
        prev.includes(label) 
          ? prev.filter((l) => l !== label) 
          : [...prev, label]               
      );
    }
  };

const handleSortChange = (details: { value: string |null}) => {
  if (!details.value) return;
    if (details.value === "Recommended") {
      const isLoggedIn = onSignInRequest();
      if (!isLoggedIn) return; // Stop the toggle if guest
    } 
    // Instantly tell App.tsx to change the sort and fetch!
    onSortChange(details.value); 
  };
const handleClearFilters = () => {
setDraftLabels([]); 
    setDraftLanguages([]);
    onApplyFilters([], []);
  };
  return (
    <Container  py={5}>
      <VStack gap={6} align="stretch" bg="#1a1614" p={6} borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.100">
        <Flex justify="center">
          <SegmentGroup.Root
            bg="black"
            borderWidth="1px"
            borderColor="#f25f4c"
            borderRadius="3xl"
            value={activeSort}
            onValueChange={handleSortChange}
            size="md"
            style={{ boxShadow: "0 6px 20px rgba(242,95,76,0.12)" }}
          >
            <SegmentGroup.Indicator borderRadius="3xl" backgroundColor="#f25f4c" />
            {["Recommended", "Recent"].map((item) => (
              <SegmentGroup.Item 
                key={item} 
                value={item}
                css={{
                  "& + &": {
                    borderLeftWidth: "0px",
                    borderRightWidth: "0px",
                    borderLeftColor: "#f2f2f2", 
                    borderRightColor: "#f2f2f2", 
                    height: "90%", 
                  },
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
              >
                <SegmentGroup.ItemText px={6} py={2} color="#f2f2f2" style={{ letterSpacing: "0.2px" }}>
                  {item}
                </SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            ))}
          </SegmentGroup.Root>
        </Flex>
        <VStack align="stretch" gap={4}>
          {Object.entries(CATEGORIES).map(([categoryName, labels]) => (
            <Box key={categoryName}>
              <Text fontSize="sm" color="gray.400" mb={2} fontWeight="medium">
                {categoryName === "PrimaryLanguage" ? "Primary Language" : categoryName}
              </Text>
              <Flex wrap="wrap" gap={2}>
                {labels.map((label) => {
                const isSelected = categoryName === "PrimaryLanguage" 
                      ? draftLanguages.includes(label) 
                      : draftLabels.includes(label);
                  return (
                    <Button
                      key={label}
                      size="sm"
                      variant={isSelected ? "solid" : "outline"}
                      bg={isSelected ? "#f25f4c" : "transparent"}
                      color={isSelected ? "white" : "gray.300"}
                      borderColor={isSelected ? "#f25f4c" : "gray.600"}
                      _hover={{
                        bg: isSelected ? "#d94b3a" : "whiteAlpha.200",
                        transform: "translateY(-1px)"
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


        <Flex justify="flex-end" pt={4} gap={4} borderTopWidth="1px" borderColor="whiteAlpha.100">
          <Button 
            variant="ghost" 
            color="whiteAlpha.900" 
            borderColor="whiteAlpha.400"
            borderRadius="3xl"
            borderWidth={"2px"}
            _hover={{ color: "white", bg: "whiteAlpha.100" }}
            onClick={handleClearFilters}
            disabled={draftLabels.length === 0 && draftLanguages.length === 0}
          >
            Clear
          </Button>
          <Button 
            bg="#f25f4c" 
            color="white" 
            borderRadius="3xl"

            px={8}
            _hover={{ bg: "#d94b3a" }}
            onClick={() => onApplyFilters(draftLanguages, draftLabels)}
          >
            Apply Filters
          </Button>
        </Flex>

      </VStack>
    </Container>
  );
}