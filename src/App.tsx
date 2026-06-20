import { Box } from "@chakra-ui/react";
import './App.css';
import AdminPanel from "./admin-panel";
import type { GithubIssues } from "./Interfaces/DTOs";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom"; 
import SignIn from "./login";
import MainLayout from "./MainLayout";
import { apiFetch } from "./auth/api";
import About from "./about";
import Register from "./register";
import Profile from "./profile";
import Home from "./Home"; 
import Issues from "./Issues"; 
import { toaster, ToasterProvider } from "./Page Components/toaster";
import ProtectedRoute from "./Page Components/ProtectedRoute";
import IssuePreview from "./Page Components/IssuePreview";

function SharedLinkHandler({ onFetchSharedIssue }: { onFetchSharedIssue: (id: string) => void }) {
  const { issueId } = useParams();
  
  useEffect(() => {
    if (issueId) {
      onFetchSharedIssue(issueId);
    }
  }, [issueId]);

  return null;
}

function App() {
  const [sharedIssue, setSharedIssue] = useState<GithubIssues | null>(null);
  const [isSharedOpen, setIsSharedOpen] = useState(false);

  const handleOpenSharedIssue = async (issueId: string) => {
    try {
      const response = await apiFetch(`/api/issues/shared/${issueId}`);
      setSharedIssue(response as GithubIssues);
      setIsSharedOpen(true);
    } catch (error) {
      toaster.create({
        title: "Issue Not Found",
        description: "This shared link might be invalid or expired.",
        type: "error",
      });
    }
  };

  return (
    <BrowserRouter>
      <Box h="100vh" w="100vw" p={0} backgroundColor={"#0f0e17"} overflow="hidden">
        <ToasterProvider />

        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/issues" element={<Issues />} />
            
            <Route path="/shared/:issueId" element={
              <>
                <SharedLinkHandler onFetchSharedIssue={handleOpenSharedIssue} />
                <Issues />
              </>
            } />
            
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
              </Box>
            } />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
            
            <Route path="*" element={<Box color="white"><div>Not Found</div></Box>} />
          </Route>
        </Routes>
        <IssuePreview
          issue={sharedIssue as GithubIssues}
          isOpen={isSharedOpen}
          onClose={() => {
            setIsSharedOpen(false);
            setTimeout(() => setSharedIssue(null), 200);
          }}
        />
      </Box>
    </BrowserRouter>
  );
}

export default App;