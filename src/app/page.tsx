import React from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  Textarea, 
  Button, 
  HStack,
  Code,
} from '@chakra-ui/react';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/config/metadata';

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            {APP_NAME}
          </Heading>
          <Text fontSize="xl" color="gray.600">
            {APP_DESCRIPTION}
          </Text>
        </Box>

        {/* User Prompt Section */}
        <Box 
          borderWidth={2} 
          borderRadius="xl" 
          p={6} 
          borderColor="gray.300"
          boxShadow="sm"
          bg="white"
        >
          <Heading as="h2" size="md" mb={4}>
            Ask Your Question
          </Heading>
          <Textarea
            value="Display total number of customers per state"
            isReadOnly
            height="100px"
            mb={3}
            bg="gray.50"
            borderColor="gray.300"
          />
          <HStack justify="flex-end">
            <Button colorScheme="green" isDisabled>
              Send
            </Button>
          </HStack>
        </Box>

        {/* AI Suggestion Section */}
        <Box 
          borderWidth={2} 
          borderRadius="xl" 
          p={6} 
          borderColor="gray.300"
          boxShadow="sm"
          bg="white"
        >
          <Heading as="h2" size="md" mb={4}>
            AI Suggests:
          </Heading>
          <Code p={4} borderRadius="lg" display="block" whiteSpace="pre" bg="gray.50">
            {`SELECT state, COUNT(*) as customer_count
FROM customers
GROUP BY state
ORDER BY customer_count DESC;`}
          </Code>
        </Box>

        {/* Chat History Section */}
        <Box 
          borderWidth={2} 
          borderRadius="xl" 
          p={6} 
          borderColor="gray.300"
          boxShadow="sm"
          bg="white"
        >
          <Heading as="h2" size="md" mb={4}>
            Chat History
          </Heading>
          <VStack align="stretch" spacing={4}>
            <Box bg="gray.50" p={4} borderRadius="lg" borderWidth={1} borderColor="gray.200">
              <Text fontWeight="bold">User:</Text>
              <Text>Display total number of customers per state</Text>
            </Box>
            <Box bg="green.50" p={4} borderRadius="lg" borderWidth={1} borderColor="green.200">
              <Text fontWeight="bold">AI Assistant:</Text>
              <Text>I can help you with that. Here's a SQL query that will show the total number of customers per state:</Text>
              <Code p={3} mt={2} borderRadius="md" display="block" whiteSpace="pre">
                {`SELECT state, COUNT(*) as customer_count
FROM customers
GROUP BY state
ORDER BY customer_count DESC;`}
              </Code>
              <Text mt={2}>This query will:</Text>
              <Text>• Group customers by state</Text>
              <Text>• Count the number of customers in each state</Text>
              <Text>• Sort the results by customer count in descending order</Text>
            </Box>
          </VStack>
        </Box>

        {/* Existing Features Section */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Features
          </Heading>
          <VStack align="stretch" spacing={4}>
            <Box p={4} borderWidth={1} borderRadius="md">
              <Heading as="h3" size="md" mb={2}>
                Modern Stack
              </Heading>
              <Text>Next.js 14, TypeScript, Chakra UI, and more</Text>
            </Box>

            <Box p={4} borderWidth={1} borderRadius="md">
              <Heading as="h3" size="md" mb={2}>
                AI Integration
              </Heading>
              <Text>Built-in support for Anthropic and OpenAI</Text>
            </Box>

            <Box p={4} borderWidth={1} borderRadius="md">
              <Heading as="h3" size="md" mb={2}>
                Database Ready
              </Heading>
              <Text>MongoDB integration with Mongoose</Text>
            </Box>

            <Box p={4} borderWidth={1} borderRadius="md">
              <Heading as="h3" size="md" mb={2}>
                Authentication
              </Heading>
              <Text>Simple JWT-based authentication system</Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 