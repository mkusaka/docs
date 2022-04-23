import { Box, Container, Heading } from "@chakra-ui/react";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <Container>
      <Box borderRadius="lg" bg="red" p={3} textAlign="center" mb={6}>
        Hello I'm a fullstack developer
      </Box>
      <Box display={{ md: "flex" }}>
        <Heading as="h2" variant="page-title">
          Masatomo kusaka
        </Heading>
      </Box>
      <p>developer</p>
    </Container>
  );
};

export default Page;
