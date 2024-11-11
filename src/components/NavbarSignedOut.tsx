"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
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
  Box,
  Divider,
} from "@mui/material";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

function Navbar() {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".menu-button") &&
        !target.closest(".MuiDrawer-root")
      ) {
        setMobileMenuVisible(false);
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
          >
            My Resume
          </Typography>
        </Link>

        <IconButton
          onClick={toggleMobileMenu}
          edge="end"
          sx={{ display: { lg: "none" }, color: "white" }}
        >
          {mobileMenuVisible ? <X size={30} /> : <Menu size={30} />}
        </IconButton>

        <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 2 }}>
          <Link href="/signup" passHref>
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "16px",
                padding: "6px 12px",
                fontSize: "0.8rem",
              }}
            >
              Register
            </Button>
          </Link>
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

      <Drawer
        anchor="top"
        open={mobileMenuVisible}
        onClose={toggleMobileMenu}
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
            <Image
              src={"/AFLogo.png"}
              height={40}
              width={40}
              alt="Profile Image"
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
            >
              My Resume
            </Typography>
          </Link>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/signup"
                onClick={toggleMobileMenu}
              >
                Sign Up
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/signin"
                onClick={toggleMobileMenu}
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
