## SpecStory

## Adding a Delete Button to Database Table (2/3/2025, 12:46:04 PM)

_**User**_

Similar to the 'test connection' button in the existing database table, I need to add a "delete" button to the table to allow a user to delete and existing database.  The button should occur in the farthest right column so as not to accidently be pressed.  
When the user presses this button, the system should delete that database from the existing database table and the localStorage.  Any questions?

---

_**Assistant**_

I'll help you add a delete button to the databases table. We'll need to add a new column to the table and create a handler function for the delete operation.

Here are the changes needed:

```typescript:src/app/config/page.tsx
// ... existing code ...

const handleDeleteDatabase = (databaseName: string) => {
  const updatedConfig = {
    ...config,
    databases: { ...config.databases }
  };
  
  delete updatedConfig.databases[databaseName];
  
  // Update state
  setConfig(updatedConfig);
  
  // Save to localStorage
  updateClientConfig(updatedConfig);

  toast({
    title: 'Database removed successfully',
    status: 'success',
    duration: 3000,
    isClosable: true,
  });
};

// In the DatabasesTable component, update the table header and rows
const DatabasesTable = () => {
  // ... existing isClient code ...

  return (
    <Box width="full" p={4} borderWidth={1} borderRadius="md" bg="gray.50">
      <Text fontWeight="semibold" mb={3}>Configured Databases</Text>
      <Table variant="simple" bg="white" borderRadius="md" overflow="hidden">
        <Thead>
          <Tr>
            <Th width="50px"></Th>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Connection String</Th>
            <Th width="50px"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.values(config.databases).map((db) => (
            <Tr key={db.name}>
              <Td>
                <IconButton
                  aria-label="Test connection"
                  icon={<Icon as={FaPlug} />}
                  size="sm"
                  colorScheme="green"
                  data-test-db={db.name}
                  onClick={() => handleTestExistingConnection(db)}
                />
              </Td>
              <Td fontWeight="medium">{db.name}</Td>
              <Td>{db.type}</Td>
              <Td>
                <Text isTruncated maxW="300px">
                  {db.connectionString}
                </Text>
              </Td>
              <Td>
                <IconButton
                  aria-label="Delete database"
                  icon={<Icon as={FaTrash} />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteDatabase(db.name)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

// ... existing code ...
```

We also need to import the trash icon at the top of the file:

```typescript:src/app/config/page.tsx
// Update the import line that includes FaPlug to add FaTrash
import { FaPlug, FaTrash } from 'react-icons/fa';
```

These changes will:
1. Add a delete button in the rightmost column of each database row
2. Create a handler function to remove the database from both state and localStorage
3. Show a success toast when the database is deleted
4. Use a red trash icon button to indicate the destructive action

The delete button is placed in the rightmost column to prevent accidental clicks, and the red color scheme helps users identify it as a destructive action.

---



---

