import { Outlet } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import NavBar from "./Page Components/navbar/navBar";
import SystemBanner from "./Page Components/SystemBanner";

function MainLayout() {
  const maintenanceMessage = import.meta.env.VITE_MAINTENANCE_MESSAGE;
  return (
    <Flex direction="column" h="full" py={5}>
      <NavBar />
      {maintenanceMessage && (
        <SystemBanner 
          message={maintenanceMessage} 
          type="warning" 
          isDismissible={true}
        />
      )}
      <Outlet /> 
    </Flex>
  );
}
export default MainLayout;