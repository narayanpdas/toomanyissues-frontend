import { Box, Flex, VStack, HStack, Text } from "@chakra-ui/react";
import type { GithubIssues } from "../Interfaces/DTOs";

interface IssueCardProps {
  GithubIssue: GithubIssues;
  onClickPreview: (id: string) => void;
}

function getTimeAgo(isoString: string) {
  const past = new Date(isoString);
  const pastMs = past.getTime();
  if (Number.isNaN(pastMs)) return 'Not available';

  const seconds = Math.floor((Date.now() - pastMs) / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

function getContrastColor(hexColor:string) {
  const hex = hexColor.replace('#', '');

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;


  return yiq >= 128 ? 'black' : 'white';
}
export function IssueCard({ GithubIssue, onClickPreview }: IssueCardProps) {
    const primaryLanguageColorMapper:Record<string, string>={
    "python":"#3572A5",
    "c":"#555555",
    "c++":"#89465a",

    "ruby":"#701516",
    "javascript":"#F7DF1E",
    "java":"#ee873d",
    "golang":"#0fc3f0",
    "rust":"#DEA584",
  }
  return (
    <Box 
      p={6}
      borderRadius="2xl"
      bg="#563a1a"
      cursor="pointer"
      onClick={() => onClickPreview(GithubIssue.githubIssueId)}
      _hover={{ shadow: "lg", transform: "translateY(-4px)", bg: "#ad5e2d", borderColor: "#ffb68a" }}
      transition="all 0.18s cubic-bezier(.2,.9,.2,1)"
    >
      <Flex justify="space-between" align="flex-start">
        <VStack align="flex-start" flex={1} mr={6}>
          <Text fontSize="sm" color="#ffeedd" fontWeight="medium">
            {GithubIssue.repoName} • {getTimeAgo(GithubIssue?.createdAtGithub || "")}
          </Text>
          <Text wordBreak="break-word" whiteSpace="normal" fontSize="lg" fontWeight="bold" color="#fff3ec" textOverflow={"clip"}>
            {GithubIssue.title}
          </Text>
            <Box fontSize="lg"
            bg={primaryLanguageColorMapper[GithubIssue?.primaryLanguage] || "cyan.600"} 
            color={getContrastColor(primaryLanguageColorMapper[GithubIssue?.primaryLanguage] || "cyan.600")} 
            borderRadius="3xl" mr={2} mb={2} boxShadow="sm" transition="transform 120ms" width="fit-content" px={1} py={1}
            _hover={{transform: "scale(1.03)"}}
            >
              {GithubIssue.primaryLanguage}
            </Box>
          <HStack flexWrap="wrap" mt={3}>
            {GithubIssue.labels.map(label => (
              <Box key={label.name} fontSize="xs" px={3} py={1} 
              bg={"#"+label.color} color={getContrastColor(label.color)} 
              borderRadius="md" mr={2} mb={2} boxShadow="sm" 
              transition="transform 120ms" _hover={{transform: "scale(1.03)"}}>
                {label.name}
              </Box>
            ))}

          </HStack>
        </VStack>
        <VStack align="flex-end" gap={3} flexShrink={0}>
          <Text fontSize="sm" color="#ffd9b8">
            💬 {GithubIssue.comments} comment
          </Text>
          <Text fontSize="sm" color="#ffd9b8">
            👥 {GithubIssue.assigneesCount} assignee
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}