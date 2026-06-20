import { Flex, Box } from "@chakra-ui/react";
import Logo from "./logo";
import MenuLinks from "./menulinks";
import MobileDrawer from "./mobiledrawer";

function NavBar() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      gap={{ base: 8, lg: 16 }}
      px={{ base: 6, lg: 12 }}
      py={3}
      maxW={{ base: "full", xl: "1440px" }}
      mx="auto"
      position="sticky"
      top={0}
      zIndex={20}
      backdropFilter="saturate(140%) blur(6px)"
      bg="rgba(0,0,0,0.04)"
      boxShadow="sm"
      borderBottomWidth="1px"
      borderColor="rgba(255,255,255,0.04)"
    >
      <Logo />
      <Box display={{ base: "none", md: "block" }}>
        <MenuLinks />
      </Box>
      <Box display={{ base: "block", md: "none" }}>
        <MobileDrawer />
      </Box>
    </Flex>
  );
}

export default NavBar;