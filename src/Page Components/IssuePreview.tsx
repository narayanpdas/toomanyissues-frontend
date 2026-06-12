import { Box, VStack, HStack, Text } from "@chakra-ui/react";

import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTitle,
} from "@chakra-ui/react"; 
import { Button } from "@chakra-ui/react";
import type { GithubIssues } from "../Interfaces/DTOs";
import MarkdownRenderer from "./MarkdownRenderer";


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


interface IssuePreviewProps {
  issue: GithubIssues ;
  isOpen: boolean;
  onClose: () => void;
}

function getContrastColor(hexColor: string) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}

export default function IssuePreview({ issue, isOpen, onClose }: IssuePreviewProps) {
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
    <DialogRoot 
      open={isOpen} 
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }} 
      size="lg" 
      placement="center" 
      
    >
      <DialogBackdrop 
        bg="blackAlpha.600" 
        backdropFilter="blur(8px)" 
      />
      <DialogContent bg="#3e2f2a" 
        color="white" 
        borderRadius="xl" 
        shadow="2xl"
        
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        margin={0}>
        <DialogHeader>
          <DialogTitle gap={4} display="flex" flexDirection="column" alignItems="flex-start">
            <Button 
              size="sm" 
              background="orange.800"
              _hover={{ backgroundColor: "orange.500" }}
              borderRadius="3xl"
              onClick={() => {
                if (issue?.githubIssueId) {
                  window.open(issue.repositoryUrl, "_blank");
                }
              }}
              >
              {issue?.repoName} • {getTimeAgo(issue?.createdAtGithub || "")}
              </Button>
            <Text fontSize="xl" fontWeight="bold" color="white" lineHeight="tall">
              {issue?.title}
            </Text>
            <Text 
                    fontSize="xs" 
                    px={2.5} 
                    py={1} 
                    bg={primaryLanguageColorMapper[issue?.primaryLanguage] || "cyan.600"} 
                    color={getContrastColor(primaryLanguageColorMapper[issue?.primaryLanguage] || "cyan.600")} 
                    borderRadius="3xl"
                  >
                    {issue?.primaryLanguage} 
              </Text>
          </DialogTitle>
          <DialogCloseTrigger color="white" />
        </DialogHeader>

        <DialogBody>
          {issue && (
            <VStack align="stretch" gap={6} mt={4}>
              <HStack flexWrap="wrap">
                {issue.labels.map((label, index) => (
                  <Box 
                    key={`${label.name}-${index}`} 
                    fontSize="xs" 
                    px={2.5} 
                    py={1} 
                    bg={"#" + label.color} 
                    color={getContrastColor(label.color)} 
                    borderRadius="md"
                  >
                    {label.name} 
                  </Box>

                ))}

              </HStack>

              <HStack gap={6} color="gray.300" fontSize="sm">
                <Text>💬 {issue.comments} comment</Text>
                <Text>👥 {issue.assigneesCount} assignee</Text>
                
              </HStack>
              <Box 
              borderWidth="1px" 
              borderColor="gray.600" 
              borderRadius="md" 
              p={4} 
              bg="#2a1f1b"
              maxH="50vh" 
              overflowY="auto"
              css={{
                '&::-webkit-scrollbar': { width: '8px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: '#55423d', borderRadius: '8px' },
                '&::-webkit-scrollbar-thumb:hover': { background: '#f7a890' },
              }}>
                <MarkdownRenderer content={issue.body || "No description provided."} />
              </Box>
            </VStack>
          )}
        </DialogBody>

        <DialogFooter>
          <Button 
            w="full" 
            bg="#f25f4c"
            color="whiteAlpha.900"
            _hover={{ bg: "#d94b3a" }}
            onClick={() => {
              if (issue?.githubIssueId) {
                window.open(issue.htmlUrl, "_blank");
              }
            }}
          >
            Open in GitHub 
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}