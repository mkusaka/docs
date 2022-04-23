import React from "react";
import NextLink from "next/link";
import { Box, Container, Flex, Heading, Link } from "@chakra-ui/react";
import { NextPage } from "next";

export const LinkItem: React.FC<{ href: string; path: string }> = ({
  href,
  path,
  children,
}) => {
  const active = path === href;
  const inactiveColor = `gray200`;
  return (
    <NextLink href={href}>
      <Link
        p={2}
        bg={active ? "glassTeal" : undefined}
        color={active ? "#202023" : inactiveColor}
      >
        {children}
      </Link>
    </NextLink>
  );
};

export const Navbar: NextPage<{ path: string }> = (props) => {
  const { path } = props;
  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg="#ffffff40"
      style={{ backdropFilter: "blur(10px)" }}
      zIndex={1}
      {...props}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        textAlign="center"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <Flex textAlign="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing="tight"></Heading>
        </Flex>
      </Container>
    </Box>
  );
};
