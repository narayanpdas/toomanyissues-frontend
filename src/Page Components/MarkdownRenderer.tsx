import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Text,Image, Heading, Link, Code, List, DialogBackdrop, DialogContent, DialogCloseTrigger, DialogBody, DialogRoot } from '@chakra-ui/react';
import rehypeRaw from 'rehype-raw';
import { useState } from 'react';
interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  return (
    <>
    <Box 
      className="markdown-body" 
      color="gray.300" // Matches your dark theme body text
      fontSize="sm"
      lineHeight="tall"
      css={{
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginTop: '16px',
          marginBottom: '16px'
        },
        // '& pre': { overflowX: 'auto', padding: '16px', backgroundColor: '#1a1614', borderRadius: '8px' },
        '& table': { display: 'block', overflowX: 'auto', whiteSpace: 'nowrap' }
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Map standard markdown tags to Chakra UI components
          // Intercept ALL <img> tags and raw HTML images
          img: (props) => (
              <Image 
                src={props.src} 
                alt={props.alt} 
                cursor="zoom-in" // Changes mouse to a magnifying glass
                onClick={() => setZoomedImage(props.src || null)}
                maxWidth="100%"
                height="auto"
                borderRadius="md"
                my={4}
                borderWidth="1px"
                borderColor="whiteAlpha.200"
                transition="all 0.2s"
                _hover={{ opacity: 0.8, borderColor: "#ffc0ad" }}
              />
            ),
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
    <DialogRoot 
        open={!!zoomedImage} 
        onOpenChange={(e) => {
          if (!e.open) setZoomedImage(null);
        }} 
        size="cover" // Takes up the whole screen
        placement="center"
      >
        <DialogBackdrop bg="blackAlpha.800" backdropFilter="blur(10px)" zIndex={9998} />
        <DialogContent 
          bg="transparent" 
          boxShadow="none" 
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          margin={0}
          w="100vw"      // 1. ADD THIS: Force container to be 100% screen width
          h="100vh"      // 2. ADD THIS: Force container to be 100% screen height
          maxW="100vw"   // 3. OVERRIDE Chakra's default max-width restrictions
          zIndex={9999}
          onClick={() => setZoomedImage(null)}
        >

          {/* Close button positioned absolutely to the screen */}
          <DialogCloseTrigger 
            color="white" 
            bg="blackAlpha.600" 
            _hover={{ bg: "blackAlpha.800" }} 
            position="absolute"
top={4}       // Tweak these so it doesn't get cut off at the very edge
            right={4}
            zIndex={10000}
          />
          
          <DialogBody display="flex" justifyContent="center" alignItems="center" p={0}>
            {zoomedImage && (
              <Image 
                src={zoomedImage} 
                maxW="100%" 
                maxH="90vh" 
                objectFit="contain" 
                borderRadius="md" 
                boxShadow="dark-lg"
              />
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
      </>
  );
}