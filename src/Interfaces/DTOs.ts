
export interface GithubIssues {
  githubIssueId: string,
  title: string,
  body:string,
  htmlUrl:string,
  assignes: GithubUserInfo[],
  labels: GithubLabelInfo[],
  createdAtGithub:string,
  updatedAtGihub:string,
  GithubUserInfo:GithubUserInfo,
  primaryLanguage: string,
  comments: number,
  repositoryUrl: string,
  scrappedAt:string,
  repoName:string,
  userName:string,
  assigneesCount: number
}

export interface GithubLabelInfo{
    name:string,
    color:string,
    description:string
}
export interface GithubUserInfo{
    node_id:string,
    login:string,
    html_url:string
}

export interface SpringPage<T>{
  content: T[];
page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}