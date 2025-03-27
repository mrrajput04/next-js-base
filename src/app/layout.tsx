import React from 'react';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Box, Container, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/config/metadata';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Box>
            <Box as="nav" bg="gray.100" py={4}>
              <Container maxW="container.xl">
                <Flex gap={6}>
                  <Link as={NextLink} href="/" fontWeight="bold">
                    Home
                  </Link>
                  <Link as={NextLink} href="/config" fontWeight="bold">
                    Configuration
                  </Link>
                  <Link as={NextLink} href="/api-docs" fontWeight="bold">
                    API Docs
                  </Link>
                </Flex>
              </Container>
            </Box>
            <Box as="main">{children}</Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
} 