import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Text, Heading, Link, Code, List } from '@chakra-ui/react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <Box 
      className="markdown-body" 
      color="gray.300" // Matches your dark theme body text
      fontSize="sm"
      lineHeight="tall"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Map standard markdown tags to Chakra UI components
          
          // Paragraphs
          p: (props) => <Text mb={4} {...props} />,
          
          // Headings (#, ##, ###)
          h1: (props) => <Heading as="h1" size="xl" color="white" mt={6} mb={4} {...props} />,
          h2: (props) => <Heading as="h2" size="lg" color="white" mt={6} mb={4} {...props} />,
          h3: (props) => <Heading as="h3" size="md" color="white" mt={4} mb={2} {...props} />,
          
          // Links [text](url)
          a: (props) => (
            <Link color="cyan.400" textDecoration="underline" _hover={{ color: "cyan.300" }} {...props} />
          ),
          
          // Inline Code `const x = 1;`
          code: (props) => (
            <Code bg="blackAlpha.400" color="pink.200" px={1.5} py={0.5} borderRadius="md" fontSize="0.9em" {...props} />
          ),
          
          // Lists (- item)
          ul: (props) => <List.Root as="ul" pl={6} mb={4} {...props} />,
          ol: (props) => <List.Root as="ol" pl={6} mb={4} {...props} />,
          li: (props) => <List.Item {...props} />,

          blockquote: ({ node, ...props }: any) => (
            <Box
              as="blockquote"
              borderLeftWidth="4px"
              borderColor="gray.500"
              pl={4}
              py={1}
              my={4}
              color="gray.400"
              bg="whiteAlpha.50"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}