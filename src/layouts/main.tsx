import { NextPage } from "next";
import { Box, Container } from "@chakra-ui/react";
import Head from "next/head";
import { Router } from "next/router";
import { Navbar } from "../components/navbar";

type Props = {
  router: Router;
};
export const Main: NextPage<Props> = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>hi</title>
      </Head>
      <Navbar path={router.asPath} />
      <Container maxW="container.md" pb={14}>
        {children}
      </Container>
    </Box>
  );
};
