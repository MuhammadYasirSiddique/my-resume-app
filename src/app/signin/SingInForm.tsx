"use client";
import { FormEvent, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import {
  GitHub,
  Google,
  Facebook,
  // XIcon,
  LinkedIn,
  Instagram,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";

import XIcon from "@mui/icons-material/X";

import { Great_Vibes, Montserrat } from "next/font/google";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: "300" });
// TypeScript interface for email sign-in form data
interface SignInFormData {
  email: string;
  password: string;
}

// Set up font styles outside the component

const SigninForm = ({ token }: { token: string }) => {
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }, [token]);

  // console.log("Token Rcvd from Page...." + token);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null); // New message state
  const router = useRouter();

  // Handle input changes for email/password

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle email sign-in submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Clear previous messages
    const formData = new FormData(e.currentTarget);

    let reCaptchaToken = "";
    try {
      if (!executeRecaptcha) {
        toast.error("reCAPTCHA not available");
        setLoading(false);
        return;
      }
      reCaptchaToken = await executeRecaptcha("form_submit");
      // console.log(reCaptchaToken);

      // Token Retrieval
      const authToken = token;
      // console.log("authTOken Assigned Value : --" + authToken);
      try {
        if (!authToken) {
          toast.error("Not Authenticated.");
          setLoading(false);
          return;
        } else {
          // console.log(authToken);
          try {
            // Perform the sign-in request
            const res = await signIn("credentials", {
              redirect: false,
              email: formData.get("email"),
              password: formData.get("password"),
              reCaptchaToken,
              authToken,
            });

            // console.log(window.location.href);
            // console.log("Response from signIn:", res); // Inspect for any anomalies

            const email = formData.get("email") as string;

            // console.log("Status returned from Server:  - " + res?.status);

            // Check for errors in the response
            if (res?.error) {
              if (res?.status === 429) {
                setMessage("Too many requests. Please try again later.");
                setLoading(false);
                return;
              }
              // console.log(res.error);
              if (res.error === "Session/API Key validation failed.") {
                setMessage("Session/API Key validation failed.");
                return;
              }

              if (res.error === "Invalid User ID or Password.") {
                // Show a message with "Email not verified" message
                setMessage("Invalid User ID or Password");
                return;
              }
              if (res.error === "Invalid credentials.") {
                // Show a message with "Email not verified" message
                setMessage("Invalid credentials.");
                return;
              }

              if (res.error === "Email not verified.") {
                // Show a message with "Email not verified" message
                setMessage(
                  "Email not verified. Redirecting to verification page..."
                );

                // Redirect to the verify-email page
                router.push(
                  `/auth/verify-email?email=${encodeURIComponent(email)}`
                );
                setLoading(false);
                return;
              }

              // For any other errors, show a generic error message
              setMessage("Failed to sign in. Please check your credentials.");
              setLoading(false);
              return;
            }

            // Successful sign-in: Show success message and redirect to dashboard
            if (res?.status === 200) {
              setMessage("Signed in successfully!. Redirecting...");
              setLoading(false);
              router.push("/dashboard");
              router.refresh();
            }
          } catch (error) {
            console.error("Error during sign-in:", error);
            setMessage("An unexpected error occurred. Please try again later.");
            // router.push(
            //   `/auth/error?error=${encodeURIComponent("Something went wrong.")}`
            // );
            // router.refresh();
          }
        }
      } catch (tokenError) {
        console.error("Token retrieval error:", tokenError);
        toast.error("Session invalid of Expired.");
        setLoading(false);
        return;
      }
    } catch (reCaptchaError) {
      console.error("reCAPTCHA error:", reCaptchaError);
      toast.error("ReCAPTCHA failed.");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
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
        className="w-full md:w-3/4 h-full flex flex-col justify-center px-4 py-2 md:px-24 py-36 bg-white shadow-md"
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
        <Box className="relative mt-1">
          <TextField
            label="Password"
            variant="standard"
            name="password"
            type={showPassword ? "text" : "password"}
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
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            sx={{
              position: "absolute",
              top: "50%",
              right: "8px",
              transform: "translateY(-50%)",
              minWidth: "auto",
              color: "gray",
              "&:hover": {
                color: "darkgray",
              },
            }}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </Button>
        </Box>
        {message && (
          <div className="text-red-700 mt-2 text-sm text-center">{message}</div>
        )}
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
          {loading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Sign in"
          )}
        </Button>

        {/* Divider and Social Login */}
        <Divider className="my-3">or sign in with</Divider>
        <Box className="flex gap-3">
          <Button
            variant="contained"
            startIcon={<Google />}
            onClick={() => signIn("google")}
            fullWidth
            className="bg-blue-600 hover:bg-blue-700 mb-3"
            sx={{
              padding: "6px 12px",
              fontSize: "0.8rem",
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Google"
            )}
          </Button>
          <Button
            variant="contained"
            startIcon={<GitHub />}
            onClick={() => signIn("github")}
            fullWidth
            className="bg-blue-600 hover:bg-blue-700 mb-3"
            sx={{
              padding: "6px 12px",
              fontSize: "0.8rem",
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "GitHub"
            )}{" "}
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

export default SigninForm;
