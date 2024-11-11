"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
<<<<<<< HEAD
import { Menu, X } from "lucide-react";
=======
import { Menu, X } from "lucide-react"; // Importing icons from lucide-react
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
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

<<<<<<< HEAD
=======
  // Function to toggle the mobile menu visibility
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

<<<<<<< HEAD
=======
  // Close menu if clicked outside
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".menu-button") &&
        !target.closest(".MuiDrawer-root")
      ) {
<<<<<<< HEAD
        setMobileMenuVisible(false);
=======
        setMobileMenuVisible(false); // Close mobile menu on click outside
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
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
<<<<<<< HEAD
      sx={{
        background: "linear-gradient(to right, #1e3a8a, #3b82f6)",
        boxShadow: 3,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" passHref>
          <Typography
            className={greatVibes.className}
            sx={{
              color: "white",
              fontSize: "2rem",
              textShadow: "0px 0px 10px rgba(255, 193, 7, 0.8)",
            }}
=======
      className="bg-gradient-to-r from-blue-800 to-blue-500 shadow-md"
    >
      <Toolbar className="flex justify-between items-center">
        {/* Logo with custom font */}

        <Link href="/">
          <Typography
            className={`${greatVibes.className} text-white  text-4xl  glow-amber`}
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
          >
            My Resume
          </Typography>
        </Link>

<<<<<<< HEAD
        <IconButton
          onClick={toggleMobileMenu}
          edge="end"
          sx={{ display: { lg: "none" }, color: "white" }}
=======
        {/* Hamburger menu icon for small screens */}
        <IconButton
          className="menu-button lg:hidden text-white"
          onClick={toggleMobileMenu}
          edge="end"
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
        >
          {mobileMenuVisible ? <X size={30} /> : <Menu size={30} />}
        </IconButton>

<<<<<<< HEAD
        <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 2 }}>
          <Link href="/signup" passHref>
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "16px",
=======
        {/* Links for desktop */}
        <div className="hidden lg:flex gap-4">
          <Link href="/signup">
            <Button
              variant="contained"
              color="primary"
              // className="bg-blue-800 hover:bg-blue-700 rounded-full"
              sx={{
                borderRadius: "16px", // Adjust as needed
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
                padding: "6px 12px",
                fontSize: "0.8rem",
              }}
            >
              Register
            </Button>
          </Link>
<<<<<<< HEAD
          <Link href="/signin" passHref>
            <Button
              sx={{
                color: "white",
                textTransform: "none",
                fontSize: "0.875rem",
              }}
            >
              Sign-in
            </Button>
          </Link>
        </Box>
      </Toolbar>

=======
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
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
      <Drawer
        anchor="top"
        open={mobileMenuVisible}
        onClose={toggleMobileMenu}
<<<<<<< HEAD
        sx={{ display: { lg: "none" } }}
      >
        <Box
          sx={{
            width: "100%",
            padding: 2,
            background: "linear-gradient(to bottom, #e2e8f0, #f1f5f9)",
            boxShadow: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
=======
        className="lg:hidden "
      >
        <Box className="w-full p-4 bg-gradient-to-b from-slate-200 to-slate-100 shadow-md">
          {" "}
          {/* Set width to full */}
          <Box className="flex items-center mb-4">
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
            <Image
              src={"/AFLogo.png"}
              height={40}
              width={40}
              alt="Profile Image"
<<<<<<< HEAD
              style={{ borderRadius: "50%" }}
            />
          </Box>
          <Link href="/" passHref>
            <Typography
              className={greatVibes.className}
              sx={{
                color: "white",
                fontSize: "2rem",
                textShadow: "0px 0px 10px rgba(255, 193, 7, 0.8)",
              }}
=======
              className="rounded-full"
            />
          </Box>
          <Link href="/">
            <Typography
              className={`${greatVibes.className} text-white text-4xl glow-amber`}
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
            >
              My Resume
            </Typography>
          </Link>
          <Divider />
<<<<<<< HEAD
          <List>
=======
          <List className="text-black">
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/signup"
                onClick={toggleMobileMenu}
<<<<<<< HEAD
=======
                className="w-full" // Ensure button takes full width
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
              >
                Sign Up
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/signin"
                onClick={toggleMobileMenu}
<<<<<<< HEAD
=======
                className="w-full" // Ensure button takes full width
>>>>>>> acf6ed0ab4e0bd8a21990b2f799608cfe77e8fc5
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
