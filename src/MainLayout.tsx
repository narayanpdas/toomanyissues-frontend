import { Outlet } from "react-router-dom"; // <-- Add this import
import NavBar from "./Page Components/navbar/navBar";
import { Flex } from "@chakra-ui/react";

// 1. Create a Layout Component
function MainLayout() {
  return (
    <Flex direction="column" h="full" py={5}>
      <NavBar />
      <Outlet /> 
    </Flex>
  );
}
export default MainLayout;