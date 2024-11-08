"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Menu, X } from "lucide-react"; // Importing icons from lucide-react
import { Great_Vibes } from "next/font/google";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

function Navbar() {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // Function to toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".menu-button") &&
        !target.closest(".MuiDrawer-root")
      ) {
        setMobileMenuVisible(false); // Close mobile menu on click outside
      }
    };

    if (mobileMenuVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mobileMenuVisible]);

  return (
    <AppBar
      position="static"
      className="bg-gradient-to-r from-blue-800 to-blue-500 shadow-md"
    >
      <Toolbar className="flex justify-between items-center">
        {/* Logo with custom font */}

        <Link href="/">
          <Typography
            className={`${greatVibes.className} text-white  text-4xl  glow-amber`}
          >
            My Resume
          </Typography>
        </Link>

        {/* Hamburger menu icon for small screens */}
        <IconButton
          className="menu-button lg:hidden text-white"
          onClick={toggleMobileMenu}
          edge="end"
        >
          {mobileMenuVisible ? <X size={30} /> : <Menu size={30} />}
        </IconButton>

        {/* Links for desktop */}
        <div className="hidden lg:flex gap-4">
          <Link href="/signup">
            <Button
              variant="contained"
              color="primary"
              className="bg-blue-800 hover:bg-blue-700 rounded-full"
            >
              Register
            </Button>
          </Link>
          <Link href="/signin" className="flex items-center text-base">
            {/* <Button
              variant="contained"
              color="primary"
              className="bg-blue-800 hover:bg-blue-700"
            > */}
            Sign-in
            {/* </Button> */}
          </Link>
        </div>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={mobileMenuVisible}
        onClose={toggleMobileMenu}
        className="lg:hidden "
      >
        <Box className="w-full p-4 bg-gradient-to-b from-slate-200 to-slate-100 shadow-md">
          {" "}
          {/* Set width to full */}
          <Box className="flex items-center mb-4">
            <Image
              src={"/AFLogo.png"}
              height={40}
              width={40}
              alt="Profile Image"
              className="rounded-full"
            />
          </Box>
          <Link href="/">
            <Typography
              className={`${greatVibes.className} text-white text-4xl glow-amber`}
            >
              My Resume
            </Typography>
          </Link>
          <Divider />
          <List className="text-black">
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/signup"
                onClick={toggleMobileMenu}
                className="w-full" // Ensure button takes full width
              >
                Sign Up
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/signin"
                onClick={toggleMobileMenu}
                className="w-full" // Ensure button takes full width
              >
                Sign In
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
