import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
export default function NavbarComponent(props) {

  const logout = () => {
    localStorage.removeItem("enigma_laundry_token");
    localStorage.removeItem("is_login");
    Navigate("/login");
    toast.success("Berhasil Logout");
  }
  return (
    <>
      <Navbar className="bg-slate-200"
        classNames={{
          item: [
            "flex",
            "relative",
            "h-full",
            "items-center",
            "data-[active=true]:after:content-['']",
            "data-[active=true]:after:absolute",
            "data-[active=true]:after:bottom-0",
            "data-[active=true]:after:left-0",
            "data-[active=true]:after:right-0",
            "data-[active=true]:after:h-[2px]",
            "data-[active=true]:after:rounded-[2px]",
            "data-[active=true]:after:bg-primary",
          ],
        }}
      >
        <NavbarBrand className="max-w-[200px] ">
          <img src="/logo.png" alt="" className="w-24 h-24" />
        </NavbarBrand>
        <NavbarContent className=" sm:flex " >
          <NavbarItem isActive={props.menu === "productMenu"}>
            <Link color="foreground" to="/" className="font-bold">Products</Link>
          </NavbarItem>
          <NavbarItem isActive={props.menu === "customerMenu"}>
            <Link color="foreground" to="/customer" className="font-bold">Customers</Link>
          </NavbarItem>
          <NavbarItem isActive={props.menu === "orderMenu"}>
            <Link color="foreground" to="/order" className="font-bold">Orders</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="lg:flex">
            <Link className="text-red-400 font-extrabold" onClick={logout}>Logout</Link>
          </NavbarItem>
          {/* <NavbarItem>
            <Button color="primary" href="#" variant="flat" isDisabled>
              Sign Up
            </Button>
          </NavbarItem> */}
        </NavbarContent>
      </Navbar>
    </>
  );
}