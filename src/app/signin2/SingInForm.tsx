"use client";
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
import {
  GitHub,
  Google,
  Facebook,
  // XIcon,
  LinkedIn,
  Instagram,
} from "@mui/icons-material";

import XIcon from "@mui/icons-material/X";

import { Great_Vibes, Montserrat } from "next/font/google";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: "300" });

const SigninPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
  };

  return (
    <Container
      maxWidth={false}
      className="flex h-screen items-center"
      disableGutters
    >
      {/* Right Section */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="w-full md:w-3/4 h-full flex flex-col justify-center px-24 py-36 bg-white shadow-md"
        maxWidth="sm"
      >
        <Typography variant="h5" className="text-blue-600 mb-3 text-center">
          Sign In to Your Account
        </Typography>

        {/* Form Fields */}
        <TextField
          label="Email"
          variant="standard"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          sx={{
            fontSize: "0.8rem",
            padding: "6px 8px",
            marginBottom: "16px",
            "& .MuiInputBase-root": { fontSize: "0.9rem" },
          }}
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
          sx={{
            fontSize: "0.8rem",
            padding: "6px 8px",
            marginBottom: "16px",
            "& .MuiInputBase-root": { fontSize: "0.9rem" },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="bg-blue-600 hover:bg-blue-700 mb-3"
          sx={{
            padding: "6px 12px",
            fontSize: "0.8rem",
          }}
        >
          Sign In
        </Button>

        {/* Divider and Social Login */}
        <Divider className="my-3">or sign in with</Divider>
        <Box className="flex gap-3">
          <Button
            variant="contained"
            startIcon={<Google />}
            fullWidth
            className="bg-blue-600 hover:bg-blue-700 mb-3"
            sx={{
              padding: "6px 12px",
              fontSize: "0.8rem",
            }}
          >
            Google
          </Button>
          <Button
            variant="contained"
            startIcon={<GitHub />}
            fullWidth
            className="bg-blue-600 hover:bg-blue-700 mb-3"
            sx={{
              padding: "6px 12px",
              fontSize: "0.8rem",
            }}
          >
            GitHub
          </Button>
        </Box>
      </Box>

      {/* Left Section */}
      <Box className="hidden md:flex h-full w-3/5 items-center justify-center bg-gradient-to-br from-blue-400 via-blue-700 to-blue-400 relative">
        <div className="absolute top-0 left-0 sm:w-48 sm:h-48 w-36 h-36 bg-gradient-to-br from-white to-blue-400 opacity-100 rounded-full transform translate-x-1/4 translate-y-1/4 shadow-xl shadow-black">
          <Image
            src="/AFLogo.png"
            width={80}
            height={80}
            alt="Logo"
            className="w-20 h-20 sm:w-28 sm:h-28 lg:w-38 lg:h-38 mt-6 mx-auto opacity-100"
          />
          <div className="absolute top-0 right-0 w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-white to-amber-900 rounded-full transform -translate-x-1/4 translate-y-1/4 shadow-xl shadow-black"></div>
        </div>

        <div className="flex flex-col">
          <Typography
            variant="h4"
            className={`${montserrat.className} text-md font-serif text-slate-100 drop-shadow-lg glow`}
          >
            Welcome Back to
          </Typography>
          <Typography
            variant="h1"
            className={`${greatVibes.className} text-7xl font-serif text-amber-400 drop-shadow-lg glow glow-amber`}
          >
            My Resume
          </Typography>
        </div>

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
              href="https://www.github.com"
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
      </Box>
    </Container>
  );
};

export default SigninPage;
