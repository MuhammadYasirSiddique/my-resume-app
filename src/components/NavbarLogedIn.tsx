"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { Menu, X } from "lucide-react";
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
  Divider,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

function NavbarLogin() {
  const { data: session } = useSession();
  const [menuVisible, setMenuVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const toggleMenuVisible = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".menu-button") &&
        !target.closest(".MuiDrawer-root")
      ) {
        setMenuVisible(false);
        setMobileMenuVisible(false);
      }
    };

    if (menuVisible || mobileMenuVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuVisible, mobileMenuVisible]);

  const handleSignOut = () => {
    toast.promise(
      signOut({ redirect: true, callbackUrl: "/" }).then(() => {
        setMenuVisible(false);
        setMobileMenuVisible(false);
      }),
      {
        loading: "Logging out...",
        success: "Logged out successfully!",
        error: "Error logging out!",
      },
      {
        duration: 3000,
        style: {
          fontSize: "16px",
          borderRadius: "8px",
          backgroundColor: "#1f2937",
          color: "#fff",
        },
      }
    );
  };

  return (
    <AppBar
      position="static"
      className="bg-gradient-to-r from-blue-800 to-blue-500 shadow-md"
    >
      <Toolbar className="flex justify-between items-center">
        <Link href="/">
          <Typography
            className={`${greatVibes.className}  text-4xl glow-amber`}
          >
            My Resume
          </Typography>
        </Link>

        <IconButton
          className="menu-button lg:hidden text-white"
          onClick={toggleMobileMenu}
          edge="end"
        >
          {mobileMenuVisible ? <X size={30} /> : <Menu size={30} />}
        </IconButton>

        <Box className="hidden lg:flex gap-4 items-center">
          <Typography color="white">Welcome, {session?.user?.name}!</Typography>
          <IconButton onClick={toggleMenuVisible}>
            <Image
              src={session?.user?.image || "/profileimg.png"}
              height={50}
              width={50}
              alt="Profile Image"
              className="rounded-full shadow-md"
            />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={mobileMenuVisible}
        onClose={toggleMobileMenu}
        className="lg:hidden"
      >
        <Box className="w-full p-4 bg-gradient-to-b from-slate-200 to-slate-100 shadow-md">
          {/* Close button at the top right */}
          <Box className="flex justify-between items-center mb-4">
            <Typography
              variant="h6"
              className={`${greatVibes.className}   glow-amber`}
            >
              My Resume
            </Typography>
            <IconButton onClick={toggleMobileMenu} className="text-gray-500">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* User profile section */}
          <Box className="flex items-center mb-4">
            <Image
              src={session?.user?.image || "/profileimg.png"}
              height={40}
              width={40}
              alt="Profile Image"
              className="rounded-full"
            />
            <Box ml={2}>
              <Typography className="text-sm font-semibold">
                {session?.user?.name}
              </Typography>
              <Typography className="text-xs text-gray-500">
                {session?.user?.email}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Menu items */}
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/auth/reset-password"
                onClick={toggleMobileMenu}
                className="w-full"
              >
                Reset Password
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/dashboard"
                onClick={toggleMobileMenu}
                className="w-full"
              >
                Dashboard
              </ListItemButton>
            </ListItem>
          </List>

          {/* Sign out button */}
          <Button
            onClick={handleSignOut}
            className="bg-red-500 text-white hover:bg-red-600 w-full mt-2"
          >
            Sign out
          </Button>
        </Box>
      </Drawer>

      {/* Desktop Drawer for Sub-menu */}
      <Drawer
        anchor="right"
        open={menuVisible}
        onClose={toggleMenuVisible}
        className="hidden lg:block "
        sx={{ width: "25%" }} // Set drawer width to 1/4 of the screen
      >
        <Box className="w-full p-4 bg-gradient-to-b from-slate-200 to-slate-100">
          <Typography
            variant="h6"
            className={`${greatVibes.className} mb-4  glow-amber`}
          >
            My Resume
          </Typography>
          <Box className="flex items-center mb-4">
            <Image
              src={session?.user?.image || "/profileimg.png"}
              height={40}
              width={40}
              alt="Profile Image"
              className="rounded-full"
            />
            <Box ml={2}>
              <Typography className="text-sm font-semibold">
                {session?.user?.name}
              </Typography>
              <Typography className="text-xs text-gray-500">
                {session?.user?.email}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/auth/reset-password"
                onClick={toggleMenuVisible}
              >
                Reset Password
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/dashboard"
                onClick={toggleMenuVisible}
              >
                Dashboard
              </ListItemButton>
            </ListItem>
          </List>
          <Button
            onClick={handleSignOut}
            className="bg-red-500 text-white hover:bg-red-600 w-full mt-2"
          >
            Sign out
          </Button>
        </Box>
      </Drawer>

      <Toaster position="top-right" reverseOrder={false} />
    </AppBar>
  );
}

export default NavbarLogin;
