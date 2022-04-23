import styled from "@emotion/styled";
import Link from "next/link";
import Image from "next/image";
import { Text } from "@chakra-ui/react";
import Okashi from "src/image/okashi.jpg";

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-block;
  align-items: center;
  height: 30px;
  line-height: 20px;
  padding: 10px;

  &:hover img {
    transform: rotate(20deg);
  }
`;

export const Logo = () => {
  return (
    <Link href="/">
      <a>
        <LogoBox>
          <Image src={Okashi} width={20} height={20} alt="logo image" />
          <Text
            color="gray.800"
            fontFamily="M PLUS Rounded 1c"
            fontWeight="bold"
            ml={3}
          >
            logo
          </Text>
        </LogoBox>
      </a>
    </Link>
  );
};
