import { Box, Center, Text, Flex, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import './App.css';
import LabelsDisplay from "./Page Components/LabelsDisplay";
import IssuesContainer from "./Page Components/IssuesContainer";
import IssuePreview from "./Page Components/IssuePreview";
import AdminPanel from "./admin-panel";
import type { GithubIssues, SpringPage } from "./Interfaces/DTOs";
import { useState } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import PaginationControls from "./Page Components/PaginationControls";
import SignIn from "./login";
import MainLayout from "./MainLayout";
import { apiFetch } from "./auth/api";
import About from "./about";
import Register from "./register";
import Profile from "./profile";
import { useAuth } from "./auth/AuthContext";
import SearchBar from "./Page Components/Searchbar";
import { toaster, ToasterProvider } from "./Page Components/toaster";
import ProtectedRoute from "./Page Components/ProtectedRoute";

function App() {
  const [activeSort, setActiveSort] = useState("Recent");
  const [activeLanguages, setActiveLanguages] = useState<string[]>([]);
  const [activeLabels, setActiveLabels] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { isAuthenticated } = useAuth();
  const [selectedIssue, setSelectedIssue] = useState<GithubIssues | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSortChange = (newSort: string) => {
    if (newSort === "Recommended") {
      handleSignInRequest();
    }
    setActiveSort(newSort);
    setActiveLabels([]); 
    setActiveLanguages([]);
    setSearchQuery("");
    setCurrentPage(0);
  };

  const handleApplyFilters = (newLanguage: string[], newLabels: string[]) => {
    const languagesChanged = JSON.stringify(activeLanguages) !== JSON.stringify(newLanguage);
    const labelsChanged = JSON.stringify(activeLabels) !== JSON.stringify(newLabels);
    if (languagesChanged || labelsChanged) {
      setActiveLanguages(newLanguage);
      setActiveLabels(newLabels);
      setCurrentPage(0); 
    }
  };

  const handlePageChange = (newPageNumber: number) => {
    setCurrentPage(newPageNumber);
  };

  const handleOpenPreview = (issueId: string) => {
    const found = pageData?.content.find((it) => it.githubIssueId === issueId) || null;
    setSelectedIssue(found);
    setIsPreviewOpen(true);
  };

  const handleSignInRequest = (): boolean => {
    if (isAuthenticated) {
      return true;
    } else {
      console.warn("User attempted to access recommended issues without authentication.");
      toaster.create({
        title: "Authentication Required",
        description: "Please sign in to access recommended issues filtering.",
        type: "error", 
        action: {
          label: "Sign In",
          onClick: () => {
            window.location.href = "/login";
          }
        },
        meta: { closable: true }
      });
      return false;
    }
  };

  const { data: pageData, isLoading } = useQuery({
    queryKey: ['issues', activeSort, activeLanguages, activeLabels, searchQuery, currentPage, isAuthenticated],
    enabled: activeSort === 'Recommended' ? !!localStorage.getItem('jwt') : true,
    queryFn: async () => {
      const labelsParam = activeLabels.length > 0 ? `&labels=${activeLabels.join(',')}` : "";
      const langParam = activeLanguages.length > 0 ? `&primaryLanguages=${encodeURIComponent(activeLanguages.join(','))}` : "";
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";
      console.log(`Fetching with params: ${labelsParam} ${langParam} ${searchParam}`);
      const basePath = activeSort === "Recommended" ? "/api/issues/recommended" : "/api/issues/recent";
      const response = await apiFetch(
         `${basePath}?filter=${activeSort.toLowerCase()}&page=${currentPage}${labelsParam}${langParam}${searchParam}`
      );
      return response as SpringPage<GithubIssues>;
    },
    staleTime: 1000 * 60 * 3, 
  });

  return (
    <BrowserRouter>
      <Box h="100vh" w="100vw" p={0} backgroundColor={"#0f0e17"} overflow="hidden">
      <ToasterProvider />

        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
              <Route element={<MainLayout />}>
                <Route path={"/"} element={
                  <Flex flex="1" overflow="hidden" mt={4} px={4} gap={8} maxW="1600px" mx="auto" w="full">
                      
                      {/* LEFT COLUMN: Labels */}
                      <Box
                        w={{ base: "100%", md: "400px" }} 
                        overflowY="auto"
                        pr={2} 
                        css={{
                          '&::-webkit-scrollbar': { width: '4px' },
                          '&::-webkit-scrollbar-track': { background: 'transparent' },
                          '&::-webkit-scrollbar-thumb': { background: '#55423d', borderRadius: '8px' },
                        }}
                      >
                        <LabelsDisplay
                              activeSort={activeSort} 
                              initialLabels={activeLabels}
                              PrimaryLanguages={activeLanguages}
                              onSortChange={handleSortChange}
                              onApplyFilters={handleApplyFilters}
                              onSignInRequest={handleSignInRequest}
                        />
                      </Box>
                      
                      {/* RIGHT COLUMN: Search + Issues Wrapper */}
                      <Flex 
                        flex="1" 
                        direction="column" 
                        pr={4}
                        h="full"
                      >
                        {/* STATIC HEADER: Search Bar */}
                        <Box pt={4} pb={4} bg="#0f0e17" zIndex={10}>
                          <SearchBar onSearch={(query) => {
                            if (query !== searchQuery) {
                                  setSearchQuery(query);
                                  setCurrentPage(0); 
                                }
                          }} />
                        </Box>

                        {/* SCROLLABLE AREA: Issues List */}
                        <Box
                          flex="1"
                          overflowY="auto"
                          pr={2}
                          css={{
                            '&::-webkit-scrollbar': { width: '8px' },
                            '&::-webkit-scrollbar-track': { background: 'transparent' },
                            '&::-webkit-scrollbar-thumb': { background: '#ffc0ad', borderRadius: '8px' },
                            '&::-webkit-scrollbar-thumb:hover': { background: '#f7a890' },
                          }}
                        >
                          {pageData?.content.length === 0 ? (
                            <Center h="200px">
                              <Box display="flex" gap={3} flexDirection="column" alignItems="center">
                                <Text color="gray.400" fontWeight="medium">No issues found with the selected filters.</Text>
                              </Box>
                            </Center>
                          ) : null}
                          
                          {isLoading || !pageData ? (
                            <Center h="200px">
                              <Box display="flex" gap={3} flexDirection="column" alignItems="center">
                                <Spinner color="#ffc0ad" borderWidth="4px" />
                                <Text color="gray.400" fontWeight="medium">Fetching issues...</Text>
                              </Box>
                            </Center>
                          ) : (
                            <>
                              <IssuesContainer
                                pageData={pageData}
                                onPageChange={handlePageChange}
                                onOpenPreview={handleOpenPreview}
                              />
                              <PaginationControls
                                currentPage={pageData?.page.number}
                                totalPages={pageData?.page.totalPages}
                                onPageChange={handlePageChange}
                              />
                            </>
                          )}
                        </Box>
                      </Flex>

                      <IssuePreview
                        issue={selectedIssue as GithubIssues}
                        isOpen={isPreviewOpen}
                        onClose={() => {
                          setIsPreviewOpen(false);
                          setTimeout(() => setSelectedIssue(null), 200);
                        }}
                      />

                  </Flex>
                }/>
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/about" element={
                  <Box
                    flex="1"
                    overflowY="auto" 
                    h="full"         
                    px={4}
                    css={{
                      '&::-webkit-scrollbar': { width: '8px' },
                      '&::-webkit-scrollbar-track': { background: 'transparent' },
                      '&::-webkit-scrollbar-thumb': { background: '#ffc0ad', borderRadius: '8px' },
                      '&::-webkit-scrollbar-thumb:hover': { background: '#f7a890' },
                    }}
                  >
                    <About />
                  </Box>} 
                />
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                </Route>
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>
                <Route path="*" element={<Box color="white"><div>Not Found</div></Box>} />
              </Route>
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;