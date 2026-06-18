import { Box, VStack, HStack, Text, Flex, Skeleton } from "@chakra-ui/react";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
} from "@chakra-ui/react"; 
import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import type { GithubIssues } from "../Interfaces/DTOs";
import MarkdownRenderer from "./MarkdownRenderer";
import { useAuth } from "../auth/AuthContext"; 
import { toaster } from "./toaster"; 
import { useLocation, useNavigate } from 'react-router-dom';
import { IoCloseOutline } from "react-icons/io5";
import { apiFetch } from "../auth/api";

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

function getContrastColor(hexColor: string) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}

interface IssuePreviewProps {
  issue: GithubIssues;
  isOpen: boolean;
  onClose: () => void;
}

export default function IssuePreview({ issue, isOpen, onClose }: IssuePreviewProps) {
  const { isAuthenticated } = useAuth();
  

  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [isSharedLink, setIsSharedLink] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();


  const primaryLanguageColorMapper: Record<string, string> = {
    "python":"#3572A5", "c":"#555555", "c++":"#89465a",
    "ruby":"#701516", "javascript":"#F7DF1E", "java":"#ee873d",
    "golang":"#0fc3f0", "rust":"#DEA584",
  };

  const handleClose = () => {
    if (location.pathname.includes('/shared/')) {
      navigate('/');
    }
    onClose();
    setTimeout(() => {
      setShowSummaryPanel(false);
      setIsSummarizing(false);
      setSummaryText("");
      setDisplayedSummary("");
    }, 300);
  };

  useEffect(() => {

    if(location.pathname.includes("/shared/")) {
      setIsSharedLink(true);
    } else {
      setIsSharedLink(false);
    }

    if (!isSummarizing && summaryText.length > 0) {
      let currentIndex = 0;
      const timer = setInterval(() => {
        setDisplayedSummary(summaryText.slice(0, currentIndex + 1));
        currentIndex++;
        if (currentIndex === summaryText.length) {
          clearInterval(timer);
        }
      }, 15); 
      return () => clearInterval(timer); 
    }
  }, [isSummarizing, summaryText]);

  const handleSummarizeClick = async (node_id: string) => {
    // 1. AUTH CHECK: If not logged in, fire the teaser toast and stop!
    if (!isAuthenticated) {
      toaster.create({
        title: "Authentication Required",
        description: "Please sign in to generate AI issue summaries.",
        type: "warning",
        action: {
          label: "Sign In",
          onClick: () => {
            window.location.href = "/login";
          }
        },
        meta: { closable: true }
      });
      return; // Stop execution here
    }

    // 2. If logged in, proceed with the summary panel
    setShowSummaryPanel(true);
    setIsSummarizing(true);
    setDisplayedSummary("");

    try {
      
      const response = await apiFetch(`/api/issues/summarize/${node_id}`);
      setSummaryText(response.summary);
      
    } catch (error: any) {
      if (error?.status === 429) {
        toaster.create({
          title: "Rate Limit Reached",
          description: "You have used your 50 summary requests for today. Please try again tomorrow.",
          type: "error",
        });
        setShowSummaryPanel(false); 
      } else {
        toaster.create({
          title: "Summarization Failed",
          description: "We couldn't generate a summary right now.",
          type: "error",
        });
      }
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }} 
      placement="center"
      closeOnInteractOutside={!isSharedLink}
      closeOnEscape={!isSharedLink}
    >
      <DialogBackdrop bg="blackAlpha.600" backdropFilter="blur(8px)" />
      
      <DialogContent 
        bg="#3e2f2a" 
        color="white" 
        borderRadius="xl" 
        shadow="2xl"
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        margin={0}
        maxW={showSummaryPanel ? "1200px" : "700px"} 
        transition="max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        <DialogHeader>
          <DialogTitle gap={4} display="flex" flexDirection="column" alignItems="flex-start">
            <Flex justify={"space-between"} align="flex-start" w="full">
              <Button 
                size="sm" 
                background="orange.800"
                _hover={{ backgroundColor: "orange.500" }}
                borderRadius="3xl"
                onClick={() => {
                  if (issue?.githubIssueId) window.open(issue.repositoryUrl, "_blank");
                }}
              >
                {issue?.repoName} • {getTimeAgo(issue?.createdAtGithub || "")}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                minW="auto"
                color="gray.400"
                _hover={{ bg: "whiteAlpha.200", color: "red.500" }}
                onClick={handleClose}
                borderRadius="md"
                px={2}
                mr={-14}
              >
                <IoCloseOutline /> 
              </Button>
            </Flex>


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
        </DialogHeader>

        <DialogBody>
          {issue && (
            <VStack align="stretch" gap={4} mt={2}>
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
              
              {/* BOTTOM ROW: The Side-by-Side Split */}
              <Flex gap={5} align="stretch" w="full" mt={2}>
                
                {/* LEFT CARD: Markdown Description */}
                <Box 
                  flex={showSummaryPanel ? 1.5 : 1} // Makes description slightly wider than summary
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
                    
                  }}
                >
                  <MarkdownRenderer content={issue.body || "No description provided."} />
                </Box>

                {/* RIGHT CARD: AI Summary Panel */}
                {showSummaryPanel && (
                  <Box 
                    flex={1} 
                    bg="#2a1f1b" // Match the left card exactly
                    borderRadius="md" 
                    borderWidth="1px" 
                    borderColor="#ffc0ad" 
                    p={4}
                    maxH="50vh" 
                    overflowY="auto"
                    position="relative" // Required for absolute positioning the close button
                    css={{ animation: "fadeIn 0.5s ease-in-out" }}
                  >
                    {/* Close "X" Button for the Summary Panel */}
                    <Button 
                      size="xs"
                      variant="ghost" 
                      color="gray.400"
                      position="absolute"
                      top={2}
                      right={2}
                      _hover={{ color: "white", bg: "whiteAlpha.200" }}
                      onClick={() => setShowSummaryPanel(false)}
                    >
                      ✕
                    </Button>

                    <Text fontWeight="bold" color="#ffc0ad" mb={4}>
                      ✨ AI Summary
                    </Text>
                    
                    {isSummarizing ? (
                      <VStack align="stretch" gap={4}>
                        <Skeleton height="20px" bg="whiteAlpha.200" />
                        <Skeleton height="20px" bg="whiteAlpha.200" w="90%" />
                        <Skeleton height="20px" bg="whiteAlpha.200" w="80%" />
                        <Skeleton height="20px" bg="whiteAlpha.200" w="60%" mt={4} />
                        <Skeleton height="20px" bg="whiteAlpha.200" w="85%" />
                      </VStack>
                    ) : (
                      <Box color="gray.200">
                        <MarkdownRenderer content={displayedSummary} />
                      </Box>
                    )}
                  </Box>
                )}
              </Flex>

            </VStack>
          )}
        </DialogBody>

        <DialogFooter>
          <HStack w="full" gap={4}>
            {/* The button is now ALWAYS rendered unless the panel is already open! */}
            {!showSummaryPanel && (
              <Button 
                flex={1}
                variant="outline"
                borderColor="#ffc0ad"
                color="#ffc0ad"
                _hover={{ bg: "whiteAlpha.100" }}
                onClick={() => handleSummarizeClick(issue?.githubIssueId)}
              >
                ✨ Summarize Issue
              </Button>
            )}
            <Button 
              flex={!showSummaryPanel ? 1 : "auto"}
              w={showSummaryPanel ? "full" : "auto"}
              bg="#f25f4c"
              color="whiteAlpha.900"
              _hover={{ bg: "#d94b3a" }}
              onClick={() => {
                if (issue?.githubIssueId) window.open(issue.htmlUrl, "_blank");
              }}
            >
              Open in GitHub 
            </Button>
            <Button
              variant="ghost"
              color="gray.400"
              _hover={{ bg: "whiteAlpha.100", color: "white" }}
              onClick={() => {
                const shareUrl = `${window.location.origin}/shared/${issue?.githubIssueId}`;
                navigator.clipboard.writeText(shareUrl);
                toaster.create({
                  title: "Link Copied!",
                  description: "You can now share this issue with anyone.",
                  type: "success",
                });
              }}
            >
              🔗 Share
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}