import {
  useDisclosure,
  Drawer,
  Button,
  Portal,
  CloseButton,
  Icon,
} from "@chakra-ui/react";
import { CiMenuBurger } from "react-icons/ci";
import Logo from "./logo";
import MenuLinks from "./menulinks";

const MobileDrawer = () => {
  const { open, onToggle } = useDisclosure();

  return (
    <Drawer.Root open={open} onOpenChange={onToggle} size="full">
      <Drawer.Trigger asChild>
        <Button variant="outline" size="sm">
          <Icon color="blue.600">
            <CiMenuBurger />
          </Icon>
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>
                <Logo />
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <MenuLinks isMobile />
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="md" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default MobileDrawer;