// components/Footer.tsx
import React from "react";
import { Box, Typography, Link, Container, Grid2 } from "@mui/material";
// import Grid2 from "@mui/material/Unstable_Grid2"; // Import Grid2

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: "auto",
        backgroundColor: "primary.dark",
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={4} justifyContent="center" component="div">
          {/* Column 1 - About Section */}
          <Grid2 component="div">
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography variant="body2">
              This is a personal resume site showcasing my work and experience.
              Learn more about my projects and services offered here.
            </Typography>
          </Grid2>

          {/* Column 2 - Links */}
          <Grid2 component="div">
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/about" color="inherit" underline="hover">
              About Me
            </Link>
            <br />
            <Link href="/projects" color="inherit" underline="hover">
              Projects
            </Link>
            <br />
            <Link href="/contact" color="inherit" underline="hover">
              Contact
            </Link>
          </Grid2>

          {/* Column 3 - Social Media */}
          <Grid2 component="div">
            <Typography variant="h6" gutterBottom>
              Follow Me
            </Typography>
            <Link href="https://linkedin.com" color="inherit" underline="hover">
              LinkedIn
            </Link>
            <br />
            <Link href="https://github.com" color="inherit" underline="hover">
              GitHub
            </Link>
            <br />
            <Link href="https://twitter.com" color="inherit" underline="hover">
              Twitter
            </Link>
          </Grid2>
        </Grid2>

        {/* Bottom Text */}
        <Box mt={4} textAlign="center">
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Yasir Siddique. All rights
            reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
