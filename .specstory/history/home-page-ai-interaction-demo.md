## SpecStory

## Home Page AI Interaction Demo (2/3/2025, 12:52:27 PM)

_**User**_

@page.tsx I want to modify the home page a bit just to show a layout that will be used for our application to the user.  This should be a completely read-only page, but will offer the client an idea of how the home page will look.

Above the existing Features section, add the following:

A user prompt where the user can send a message to the AI provider with a multi-line text box and a green button below it, right justified that says send.  For now, we'll add some example text in the box that say "Display total number of customers per state".
Immediately below this box is another box with an identifying frame of "AI Suggests:",   Inside this box should be a SQL SELECT statement that might be used to Display total number of customers per state if the application was live.   And lastly below this section is a box that shows chat history where the user and AI chat history is display.  

Can you create this as a read-only, pure HTML demo of a possible screen to display?  

Any questions?

---

_**Assistant**_

I'll help modify the home page to include these new sections above the Features section. I'll create it as a read-only demo using Chakra UI components. The layout will include:

1. User prompt section with a multi-line textbox and green send button
2. AI Suggestion section with a SQL example
3. Chat history section
4. Existing Features section

Here's the modified code:

```typescript:src/app/page.tsx
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

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Welcome to AISC Query Assist
          </Heading>
          <Text fontSize="xl" color="gray.600">
            A modern, AI-powered query assistant
          </Text>
        </Box>

        {/* User Prompt Section */}
        <Box borderWidth={1} borderRadius="lg" p={4}>
          <Heading as="h2" size="md" mb={4}>
            Ask Your Question
          </Heading>
          <Textarea
            value="Display total number of customers per state"
            isReadOnly
            height="100px"
            mb={3}
            bg="gray.50"
          />
          <HStack justify="flex-end">
            <Button colorScheme="green" isDisabled>
              Send
            </Button>
          </HStack>
        </Box>

        {/* AI Suggestion Section */}
        <Box borderWidth={1} borderRadius="lg" p={4}>
          <Heading as="h2" size="md" mb={4}>
            AI Suggests:
          </Heading>
          <Code p={4} borderRadius="md" display="block" whiteSpace="pre" bg="gray.50">
{`SELECT state, COUNT(*) as customer_count
FROM customers
GROUP BY state
ORDER BY customer_count DESC;`}
          </Code>
        </Box>

        {/* Chat History Section */}
        <Box borderWidth={1} borderRadius="lg" p={4}>
          <Heading as="h2" size="md" mb={4}>
            Chat History
          </Heading>
          <VStack align="stretch" spacing={4}>
            <Box bg="gray.50" p={3} borderRadius="md">
              <Text fontWeight="bold">User:</Text>
              <Text>Display total number of customers per state</Text>
            </Box>
            <Box bg="green.50" p={3} borderRadius="md">
              <Text fontWeight="bold">AI Assistant:</Text>
              <Text>I can help you with that. Here's a SQL query that will show the total number of customers per state:</Text>
              <Code p={2} mt={2} display="block" whiteSpace="pre">
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
          // ... existing Features code ...
        </Box>
      </VStack>
    </Container>
  );
}
```

This modification:

1. Adds a read-only textarea with the example prompt and a disabled green send button
2. Creates an AI Suggestion section with a formatted SQL query
3. Adds a chat history section showing an example conversation
4. Keeps the existing Features section
5. Uses Chakra UI components for consistent styling
6. Makes everything read-only/disabled to indicate it's just a demo
7. Uses appropriate spacing and borders to separate sections
8. Includes subtle background colors to differentiate user/AI messages

The layout is responsive and maintains the existing styling patterns. Would you like me to make any adjustments to this design?

---

_**User**_

Nice.. Put a visible gray frame around the 3 new sections.  Rounded corners -- somethig really slick.

---

_**Assistant**_

I'll enhance the styling of the three new sections by adding a more visible frame with a subtle shadow and rounded corners. I'll modify the existing boxes to make them more visually distinct.

```typescript:src/app/page.tsx

---



---

