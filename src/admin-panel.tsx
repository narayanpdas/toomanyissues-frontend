import { 
  Box, Container, VStack, Heading, Text, Flex, 
  SimpleGrid, Badge, HStack, Tabs
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./auth/api";
import { FiUsers, FiAlertCircle, FiActivity, FiPlay, FiPause } from "react-icons/fi"; // npm install react-icons

interface UserStatus { totalUsers: number; byLanguage: Record<string, number>; byLabel: Record<string, number>; }
interface IssueStatus { 
  total: number; fresh: number; old: number;
  topPrimaryLanguage: Record<string, number>; 
  topRepoName: Record<string, number>;
  topLabelMetrics: Record<string, number>;
}
interface GithubStatus { remainingPoints: number; resetTime: string; }
interface Scheduler {id:string; name: string; pointsCostInCurrentCycle:number; totalPointsCost:number;description: string; progress: number; total:number ; count:number ; status: 'RUNNING' | 'PAUSED' | 'IDLE'; }

export default function AdminPanel() {
  const queryClient = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => await apiFetch('/admin/users/status') as UserStatus,
  });

  const { data: issueData } = useQuery({
    queryKey: ['admin', 'issues'],
    queryFn: async () => await apiFetch('/admin/issues/status') as IssueStatus ,
  });
  const { data: scrapersData } = useQuery({
    queryKey: ['admin', 'schedulers'],
    queryFn: async () => {
      console.log("Fetching schedulers and GitHub API status...");

      const schedulers = await apiFetch('/admin/schedulers/status') as Scheduler[];
      const github = await apiFetch('/admin/github-api/status') as GithubStatus;

      console.log("Fetched Schedulers:", schedulers);
      return { schedulers, github };
    },
    refetchInterval: 10000, 
  });

 
  const toggleScheduler = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'RUNNING' | 'PAUSED' }) => {
      await apiFetch(`/admin/schedulers/${id}/${action}`, { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'schedulers'] });
    }
  });


  const StatCard = ({ title, value, subtext }: { title: string, value: string | number, subtext?: string }) => (
    <Box bg="blackAlpha.300" p={6} borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.100">
      <Text color="gray.400" fontSize="sm" fontWeight="bold" textTransform="uppercase" mb={2}>{title}</Text>
      <Heading size="2xl" color="white">{value}</Heading>
      {subtext && <Text color="gray.500" fontSize="sm" mt={2}>{subtext}</Text>}
    </Box>
  );

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
      <Container maxW="container.xl" py={10}>
        <VStack gap={8} align="stretch">
          
          <Box>
            <Heading size="2xl" color="white" mb={2}>System Control Center</Heading>
          </Box>

          <Box bg="#1a1614" borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.100" shadow="2xl" overflow="hidden">
            
            <Tabs.Root defaultValue="users" size="lg" variant="enclosed">
              <Tabs.List bg="blackAlpha.400" px={4} pt={4} borderBottomWidth="1px" borderColor="whiteAlpha.100">
                <Tabs.Trigger value="users" color="gray.400" _selected={{ color: "#f25f4c", borderColor: "#f25f4c", borderBottomWidth: "2px" }}><HStack gap={2}><FiUsers /><Text>Users</Text></HStack></Tabs.Trigger>
                <Tabs.Trigger value="issues" color="gray.400" _selected={{ color: "#f25f4c", borderColor: "#f25f4c", borderBottomWidth: "2px" }}><HStack gap={2}><FiAlertCircle /><Text>Issues</Text></HStack></Tabs.Trigger>
                <Tabs.Trigger value="scrapers" color="gray.400" _selected={{ color: "#f25f4c", borderColor: "#f25f4c", borderBottomWidth: "2px" }}><HStack gap={2}><FiActivity /><Text>Scrapers & API</Text></HStack></Tabs.Trigger>
              </Tabs.List>

              <Box p={8}>


                {/* TAB 2: USERS */}
                <Tabs.Content value="users">
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
                    <StatCard title="Total Active Users" value={userData?.totalUsers || 0} />
                  </SimpleGrid>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    <Box bg="blackAlpha.300" p={6} borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.100">
                       <Text color="white" fontWeight="bold" mb={4}>Top User Primary Languages</Text>
                       <Flex wrap="wrap" flexDir="column" gap={2}>
                          {Object.entries(userData?.byLanguage || {}).map(([lang, count]) => (
                            <Box  key={lang} display="flex" alignItems="center" gap={2}>
                            <Badge bg="#ad5e2d" color="white" size={"lg"} px={2} py={1}>{lang}</Badge>
                            <Badge  bg="green" color="white" size={"lg"} px={2} py={1}>{count}</Badge>
                            </Box>
                          ))}
                       </Flex>
                    </Box>
                    <Box bg="blackAlpha.300" p={6} borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.100">
                       <Text color="white" fontWeight="bold" mb={4}>Top User Preferences</Text>
                       
                       <Flex wrap="wrap" flexDir="column" gap={2}>
                          {Object.entries(userData?.byLabel || {}).map(([label, count]) => (
                            <Box key={label} display="flex" alignItems="center" gap={2}>
                            <Badge  bg="#ad5e2d" color="white" size={"lg"} px={2} py={1}>{label}</Badge>
                            <Badge  bg="green" color="white" size={"lg"} px={2} py={1}>{count}</Badge>
                            </Box>
                          ))}
                       </Flex>
                    </Box>
                  </SimpleGrid>
                </Tabs.Content>

                {/* TAB 3: ISSUES */}
                <Tabs.Content value="issues">
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                    <StatCard title="Total Tracked Issues" value={issueData?.total || 0} />
                    <StatCard title="Fresh (< 24h)" value={issueData?.fresh || 0} subtext="Recently found in github" />
                    <StatCard title="Stale (> 24h)" value={issueData?.old || 0} subtext="Requires pruning" />
                    <SimpleGrid columns={{ base: 1, md: 1 }} gap={6}>
                      <Box bg="blackAlpha.300"  p={6} borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.100">
                         <Text color="white" fontWeight="bold" mb={4}>Top Primary Languages</Text>
                         <Flex wrap="wrap" flexDir="column" gap={2}>
                            {Object.entries(issueData?.topPrimaryLanguage || {}).map(([lang, count]) => (
                              <Box key={lang} display="flex" alignItems="center" gap={2}>
                              <Badge bg="#ad5e2d" color="white" size={"lg"} px={2} py={1}>{lang}</Badge>
                              <Badge  bg="green" color="white" size={"lg"} px={2} py={1}>{count}</Badge>
                              </Box>
                            ))}
                         </Flex>
                      </Box>
                      <Box bg="blackAlpha.300" p={6} borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.100">
                         <Text color="white" fontWeight="bold" mb={4}>Top Repositories</Text>
                         <Flex wrap="wrap" flexDir="column" gap={2}>
                            {Object.entries(issueData?.topRepoName || {}).map(([repo, count]) => (
                              <Box key={repo} display="flex" alignItems="center" gap={2}>
                              <Badge bg="#ad5e2d" color="white" size={"lg"} px={2} py={1}>{repo}</Badge>
                              <Badge  bg="green" color="white" size={"lg"} px={2} py={1}>{count}</Badge>
                              </Box>
                            ))}
                         </Flex>
                      </Box>
                    </SimpleGrid>
                    <Box bg="blackAlpha.300" p={6} borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.100">
                         <Text color="white" fontWeight="bold" mb={4}>Top Issue Labels</Text>
                         <Flex wrap="wrap" flexDir="column" gap={2}>
                            {Object.entries(issueData?.topLabelMetrics || {}).map(([label, count]) => (
                              <Box key={label} display="flex" alignItems="center" gap={2}>
                              <Badge bg="#ad5e2d" color="white" size={"lg"} px={2} py={1}>{label}</Badge>
                              <Badge  bg="green" color="white" size={"lg"} px={2} py={1}>{count}</Badge>
                              </Box>
                            ))}
                         </Flex>
                      </Box>
                    </SimpleGrid>
                </Tabs.Content>

                {/* TAB 4: SCRAPERS & API */}
                <Tabs.Content value="scrapers">
                  
                  {/* GitHub API Info */}
                  <Flex bg="blackAlpha.500" p={6} borderRadius="xl" borderWidth="1px" borderColor="#f25f4c" justify="space-between" align="center" mb={8}>
                    <Box>
                      <Text color="gray.400" fontSize="sm" fontWeight="bold" textTransform="uppercase" mb={1}>GitHub API Limits</Text>
                      <Heading size="lg" color="white">{scrapersData?.github?.remainingPoints || 0} / 5000</Heading>
                      <Text color="gray.500" fontSize="sm">Points reset at {scrapersData?.github?.resetTime || "..."}</Text>
                    </Box>
                    <Badge bg={scrapersData?.github?.remainingPoints && scrapersData.github.remainingPoints < 500 ? "red.500" : "green.500"} color="white" px={3} py={1} fontSize="md">
                      {scrapersData?.github?.remainingPoints && scrapersData.github.remainingPoints < 500 ? "CRITICAL" : "HEALTHY"}
                    </Badge>
                  </Flex>

                  {/* Schedulers List */}
                  <VStack align="stretch" gap={4}>
                    <Text color="white" fontWeight="bold" fontSize="lg">Active Schedulers</Text>
                   
                    {scrapersData?.schedulers?.map((scheduler) => {
                      const percentage = Math.round((scheduler.progress / scheduler.total) * 100) || 0;
                      const isRunning = scheduler.status === 'RUNNING';

                      return (
                        <Box key={scheduler.id} bg="blackAlpha.300" p={5} borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.100">
                          <Flex justify="space-between" align="center" mb={4}>
                            <Box>
                              <HStack mb={1}>
                                <Heading size="md" color="white">{scheduler.name}</Heading>
                                <Badge colorScheme={isRunning ? "green" : "yellow"}>{scheduler.status}</Badge>
                              </HStack>
                              <Text color="gray.400" fontSize="sm">{scheduler.description}</Text>
                              <Text color="gray.200" fontSize="sm">{scheduler.pointsCostInCurrentCycle} Points Used in the Last Run</Text>
                              <Text color="gray.200" fontSize="sm">{scheduler.totalPointsCost} Total Points Used</Text>

                            </Box>
                            
                            {/* Controls */}
                            <HStack gap={3}>
                              <Button 
                                size="sm" 
                                bg={isRunning ? "transparent" : "#f25f4c"} 
                                color={isRunning ? "gray.400" : "white"}
                                variant={isRunning ? "outline" : "solid"}
                                borderColor={isRunning ? "gray.600" : "transparent"}
                                onClick={() => toggleScheduler.mutate({ id: scheduler.id, action: isRunning ? 'PAUSED' : 'RUNNING' })}
                                loading={toggleScheduler.isPending}
                              >
                                {isRunning ? <FiPause /> : <FiPlay />}
                                <Text ml={2}>{isRunning ? "Pause" : "Start"}</Text>
                              </Button>
                            </HStack>
                          </Flex>

                          {/* Custom Progress Bar */}
                          <Box w="full" bg="whiteAlpha.100" h="8px" borderRadius="full" overflow="hidden" mb={2}>
                            <Box w={`${percentage}%`} bg="#f25f4c" h="full" transition="width 0.3s ease" />
                          </Box>
                          <Text color="gray.500" fontSize="xs" textAlign="right">
                            {scheduler.progress} / {scheduler.total} Repos Scanned ({percentage}%)
                          </Text>
                        </Box>
                      );
                    })}
                  </VStack>

                </Tabs.Content>

              </Box>
            </Tabs.Root>

          </Box>
        </VStack>
      </Container>
    </Box>
  );
}