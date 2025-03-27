'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, VStack, FormControl, FormLabel, Input, Button, useToast, Radio, RadioGroup, Stack, Text, Select, Flex, Table, Thead, Tr, Th, Tbody, Td, IconButton, Icon } from '@chakra-ui/react';
import { getClientConfig, updateClientConfig, type ClientConfig } from '../../lib/config/client';
import { getPageTitle } from '@/lib/config/metadata';
import { FaPlug, FaTrash } from 'react-icons/fa';

export default function ConfigPage() {
  const [config, setConfig] = useState<ClientConfig>(getClientConfig());
  const [newDatabase, setNewDatabase] = useState({
    connectionString: '',
    type: 'mongodb' as const,
    name: ''
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Saving config:', config); // Debug what we're trying to save
      updateClientConfig(config);
      console.log('Saved config. Current localStorage:', localStorage.getItem('app_config')); // Verify it was saved
      toast({
        title: 'Configuration updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving config:', error); // Log any errors
      toast({
        title: 'Error updating configuration',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleProviderChange = (value: 'anthropic' | 'openai') => {
    setConfig(prev => ({ ...prev, activeAiProvider: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleDatabaseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewDatabase(prev => ({ ...prev, [name]: value }));
  };

  const testDatabaseConnection = async (type: string, connectionString: string) => {
    if (!connectionString) {
      toast({
        title: 'Connection string required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    try {
      const endpoint = `/api/validate-${type}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionString }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to connect to database');
      }

      toast({
        title: 'Connection successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Failed to connect to database',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    await testDatabaseConnection(newDatabase.type, newDatabase.connectionString);
    setIsTestingConnection(false);
  };

  const handleTestExistingConnection = async (database: ClientConfig['databases'][string]) => {
    const button = document.querySelector(`[data-test-db="${database.name}"]`);
    if (button instanceof HTMLButtonElement) {
      button.disabled = true;
    }
    
    await testDatabaseConnection(database.type, database.connectionString);
    
    if (button instanceof HTMLButtonElement) {
      button.disabled = false;
    }
  };

  const handleSaveDatabase = () => {
    if (!newDatabase.connectionString || !newDatabase.type || !newDatabase.name) {
      toast({
        title: 'All fields are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedConfig = {
      ...config,
      databases: {
        ...config.databases,
        [newDatabase.name]: newDatabase
      }
    };

    // Update state
    setConfig(updatedConfig);
    
    // Save to localStorage immediately
    updateClientConfig(updatedConfig);

    // Reset form
    setNewDatabase({
      connectionString: '',
      type: 'mongodb',
      name: ''
    });

    toast({
      title: 'Database added successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

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

  const DatabasesTable = () => {
    // Add useEffect to handle client-side rendering
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
      setIsClient(true);
    }, []);

    // Return null on server-side render
    if (!isClient) {
      return null;
    }

    if (!config.databases || Object.values(config.databases).length === 0) {
      return null;
    }

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

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            {getPageTitle('Configuration')}
          </Heading>
        </Box>

        {/* Database Configuration - Separate form */}
        <Box>
          <Text fontSize="lg" fontWeight="bold" color="blue.600" mb={4}>
            Database Configuration
          </Text>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">Database Name</FormLabel>
              <Input
                name="name"
                value={newDatabase.name}
                onChange={handleDatabaseChange}
                placeholder="my-database"
                size="lg"
                bg="white"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">Database Type</FormLabel>
              <Select
                name="type"
                value={newDatabase.type}
                onChange={handleDatabaseChange}
                size="lg"
                bg="white"
              >
                <option value="mongodb">MongoDB</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">Connection String</FormLabel>
              <Flex gap={2}>
                <Input
                  name="connectionString"
                  value={newDatabase.connectionString}
                  onChange={handleDatabaseChange}
                  placeholder="mongodb://localhost:27017/mydatabase"
                  size="lg"
                  bg="white"
                />
                <Button
                  onClick={handleTestConnection}
                  isLoading={isTestingConnection}
                  colorScheme="green"
                  size="lg"
                >
                  Test
                </Button>
              </Flex>
            </FormControl>

            <Button
              onClick={handleSaveDatabase}
              colorScheme="blue"
              size="lg"
              width="full"
            >
              Add Database
            </Button>

            <DatabasesTable />
          </VStack>
        </Box>

        {/* AI Configuration - Separate form */}
        <Box as="form" onSubmit={handleSubmit}>
          <Text fontSize="lg" fontWeight="bold" color="blue.600" mb={4}>
            AI Configuration
          </Text>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">Active AI Provider</FormLabel>
              <RadioGroup value={config.activeAiProvider} onChange={handleProviderChange}>
                <Stack direction="row" spacing={5}>
                  <Radio value="anthropic" size="lg">Anthropic Claude</Radio>
                  <Radio value="openai" size="lg">OpenAI</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {/* OpenAI Settings */}
            <Box width="full" p={4} borderWidth={1} borderRadius="md" bg="gray.50">
              <Text fontWeight="semibold" mb={3}>OpenAI Settings</Text>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.600">Model</FormLabel>
                <Input
                  name="openaiModel"
                  value={config.openaiModel}
                  onChange={handleChange}
                  placeholder="gpt-4-turbo-preview"
                  size="lg"
                  bg="white"
                />
              </FormControl>
            </Box>

            {/* Anthropic Settings */}
            <Box width="full" p={4} borderWidth={1} borderRadius="md" bg="gray.50">
              <Text fontWeight="semibold" mb={3}>Anthropic Settings</Text>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.600">Model</FormLabel>
                <Input
                  name="anthropicModel"
                  value={config.anthropicModel}
                  onChange={handleChange}
                  placeholder="claude-3-sonnet-20240229"
                  size="lg"
                  bg="white"
                />
              </FormControl>
            </Box>

            <Button type="submit" colorScheme="blue" size="lg" width="full">
              Save AI Configuration
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}