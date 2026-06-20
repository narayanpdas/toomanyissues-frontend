import { VStack } from "@chakra-ui/react";
import type { SpringPage,GithubIssues } from "../../Interfaces/DTOs";
import { IssueCard } from "./IssueCard";


interface IssuesDisplayProps {
  pageData: SpringPage<GithubIssues>;
  onPageChange: (newPage: number) => void;
  onOpenPreview: (issueId: string) => void;
}
function IssuesContainer({ pageData, onOpenPreview }: IssuesDisplayProps){
return(
        <VStack gap={4} w={"full"} align="stretch" scrollBehavior={"smooth"}>
        {pageData.content.map((issue) => (
          <IssueCard 
            key={issue.githubIssueId} 
            GithubIssue={issue} 
            onClickPreview={onOpenPreview} 
          />
        ))}
      </VStack>


)

}
export default IssuesContainer;