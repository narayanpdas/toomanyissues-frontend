import { HStack, VStack, Link } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
const links = [
  { name: "Home", href: "/home" },
  {name:"Issues", href: "/issues"},
  { name: "About", href: "/about" },
  {name: "Admin", href: "/admin"},
  { name: "Profile", href: "/profile" }
];

const MenuLinks = ({ isMobile = false }) => {
  const LinkComponent = isMobile ? VStack : HStack;
  const role = localStorage.getItem("userRole");
  return (
    <LinkComponent gap={isMobile ? 4 : 8} align="center"> 
      {links.map((link) => (
        // Only show Admin link if user is an admin
        (link.name !== "Admin" || role === "ADMIN") && (
        <Link
          key={link.name}
          href={link.href}
          fontWeight="medium"
          color="blue.600"
          _hover={{
            textDecoration: "underline",
          }}
          transition="color 0.2s ease"
        >
          {link.name == "Profile" ? <CgProfile size={24} /> : link.name}
        </Link>)
      ))}
      
    </LinkComponent>
  );
};

export default MenuLinks;