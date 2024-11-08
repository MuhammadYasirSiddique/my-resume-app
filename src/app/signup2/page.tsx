// pages/signup.tsx
"use client";
// pages/signup.tsx
import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import Image from "next/image";

import { Great_Vibes, Montserrat } from "next/font/google";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";

import {
  GitHub,
  Google,
  Facebook,
  LinkedIn,
  Instagram,
} from "@mui/icons-material";
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: "300" });

// import GoogleIcon from '@mui/icons-material/Google';
// import GitHubIcon from '@mui/icons-material/GitHub';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Add form submission logic here
  };

  return (
    <Container
      maxWidth="xl"
      className="flex h-screen items-center"
      disableGutters
    >
      {/* Left Section */}
      <Box className="hidden md:flex h-full w-7/12 items-center justify-center bg-gradient-to-bl from-blue-400 via-blue-700 to-blue-400 relative">
        <div className="absolute top-0 right-0 sm:w-48 sm:h-48 w-36 h-36 bg-gradient-to-br from-white to-blue-400 opacity-100 rounded-full transform -translate-x-1/4 translate-y-1/4 shadow-xl shadow-black">
          <Image
            src="/AFLogo.png"
            width={100} // Adjust for small screens
            height={100} // Adjust for small screens
            alt="Logo"
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-42 lg:h-42 mt-6 mx-auto opacity-100"
          />
          <div className="absolute top-0 left-0 w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-white to-amber-900 rounded-full transform translate-x-1/4 translate-y-1/4 shadow-xl shadow-black"></div>
        </div>
        <div className="absolute top-0 left-0 lg:w-10 lg:h-10 bg-gradient-to-br from-white to-amber-900 opacity-60 rounded-full transform translate-x-1/4 translate-y-1/4 shadow-xl shadow-black hidden sm:block"></div>

        <div className="flex flex-col items-center">
          {/* Title */}
          <Typography
            variant="h1"
            className={`${greatVibes.className} text-8xl font-serif text-amber-400 drop-shadow-lg glow glow-amber`}
          >
            My Resume
          </Typography>
          <Typography
            variant="h6"
            className={`${montserrat.className} text-md font-serif text-slate-100 drop-shadow-lg glow`}
          >
            Design. Disseminate. Dominate.
          </Typography>

          {/* Social Media Icons at the Bottom */}
          <Box className="flex space-x-4 mt-8 absolute bottom-8">
            <Box className="p-2 rounded-full bg-white">
              <IconButton
                component="a"
                href="https://www.facebook.com"
                target="_blank"
                color="inherit"
              >
                <Facebook fontSize="large" style={{ color: "#3b5998" }} />
              </IconButton>
            </Box>
            <Box className="p-2 rounded-full bg-white">
              <IconButton
                component="a"
                href="https://www.twitter.com"
                target="_blank"
                color="inherit"
              >
                <XIcon fontSize="large" style={{ color: "#000000" }} />
              </IconButton>
            </Box>
            <Box className="p-2 rounded-full bg-white">
              <IconButton
                component="a"
                href="https://www.linkedin.com"
                target="_blank"
                color="inherit"
              >
                <LinkedIn fontSize="large" style={{ color: "#0e76a8" }} />
              </IconButton>
            </Box>
            <Box className="p-2 rounded-full bg-white">
              <IconButton
                component="a"
                href="https://www.linkedin.com"
                target="_blank"
                color="inherit"
              >
                <GitHub fontSize="large" style={{ color: "#000000" }} />
              </IconButton>
            </Box>
            <Box className="p-2 rounded-full bg-white">
              <IconButton
                component="a"
                href="https://www.instagram.com"
                target="_blank"
                color="inherit"
              >
                <Instagram fontSize="large" style={{ color: "#C13584" }} />
              </IconButton>
            </Box>
          </Box>
        </div>
      </Box>

      {/* Right Section */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 h-full flex flex-col justify-center px-24 py-36 bg-white shadow-md"
        maxWidth="md"
      >
        <Typography variant="h4" className="text-blue-600 mb-4 text-center">
          Create Your Account
        </Typography>

        {/* Form Fields */}
        <TextField
          label="Name"
          variant="standard"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          className="mb-4"
        />
        <TextField
          label="Email"
          variant="standard"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          className="mb-4"
        />
        <TextField
          label="Password"
          variant="standard"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          className="mb-4"
        />
        <TextField
          label="Confirm Password"
          variant="standard"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          fullWidth
          required
          className="mb-4"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="bg-blue-600 hover:bg-blue-700 mb-4"
        >
          Sign Up
        </Button>

        {/* Divider and Social Signup */}
        <Divider className="my-4">or sign up with</Divider>
        <Box className="flex gap-4">
          <Button
            variant="contained"
            startIcon={<Google />}
            fullWidth
            className="bg-blue-600 hover:bg-blue-700 mb-4"
          >
            Google
          </Button>
          <Button
            variant="contained"
            startIcon={<GitHub />}
            fullWidth
            className="bg-blue-600 hover:bg-blue-700 mb-4"
          >
            GitHub
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
