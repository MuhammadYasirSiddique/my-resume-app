"use client";
import { FormEvent, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Divider,
  // IconButton,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import {
  GitHub,
  Google,
  // Facebook,
  // LinkedIn,
  // Instagram,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";

// import XIcon from "@mui/icons-material/X";

import { Great_Vibes, Montserrat } from "next/font/google";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: "300" });

interface SignInFormData {
  email: string;
  password: string;
}

const SigninForm = ({ token }: { token: string }) => {
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }, [token]);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    let reCaptchaToken = "";
    try {
      if (!executeRecaptcha) {
        toast.error("reCAPTCHA not available");
        setLoading(false);
        return;
      }
      reCaptchaToken = await executeRecaptcha("form_submit");

      const authToken = token;
      if (!authToken) {
        toast.error("Not Authenticated.");
        setLoading(false);
        return;
      } else {
        try {
          const res = await signIn("credentials", {
            redirect: false,
            email: formData.get("email"),
            password: formData.get("password"),
            reCaptchaToken,
            authToken,
          });

          const email = formData.get("email") as string;

          if (res?.error) {
            if (res?.status === 429) {
              setMessage("Too many requests. Please try again later.");
              setLoading(false);
              return;
            }
            if (res.error === "Session/API Key validation failed.") {
              setMessage("Session/API Key validation failed.");
              return;
            }

            if (res.error === "Invalid credentials.") {
              setMessage("Invalid credentials.");
              return;
            }

            if (res.error === "Email not verified.") {
              setMessage(
                "Email not verified. Redirecting to verification page..."
              );
              router.push(
                `/auth/verify-email?email=${encodeURIComponent(email)}`
              );
              setLoading(false);
              return;
            }

            setMessage("Failed to sign in. Please check your credentials.");
            setLoading(false);
            return;
          }

          if (res?.status === 200) {
            setMessage("Signed in successfully!. Redirecting...");
            setLoading(false);
            router.push("/dashboard");
            router.refresh();
          }
        } catch (error) {
          console.error("Error during sign-in:", error);
          setMessage("An unexpected error occurred. Please try again later.");
        }
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
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        padding: 0,
      }}
      disableGutters
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: { xs: "100%", md: "75%" },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingX: { xs: 4, md: 10 },
          paddingY: { xs: 2, md: 10 },
          backgroundColor: "white",
          boxShadow: 3,
          maxWidth: "sm",
        }}
      >
        <Typography
          variant="h5"
          color="primary"
          sx={{ marginBottom: 3, textAlign: "center" }}
        >
          Sign In to Your Account
        </Typography>

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
            marginBottom: 2,
            "& .MuiInputBase-root": { fontSize: "0.9rem" },
          }}
        />
        <Box sx={{ position: "relative" }}>
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
              marginBottom: 2,
              "& .MuiInputBase-root": { fontSize: "0.9rem" },
            }}
          />
          <Button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
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
          <Typography
            color="error"
            variant="body2"
            sx={{ marginTop: 1, textAlign: "center" }}
          >
            {message}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            paddingY: 1,
            fontSize: "0.8rem",
            marginBottom: 2,
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Sign in"
          )}
        </Button>

        <Divider sx={{ my: 3 }}>or sign in with</Divider>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Google />}
            onClick={() => signIn("google")}
            fullWidth
            color="primary"
            sx={{
              paddingY: 1,
              fontSize: "0.8rem",
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
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
            color="primary"
            sx={{
              paddingY: 1,
              fontSize: "0.8rem",
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "GitHub"
            )}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "60%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e88e5, #42a5f5)",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: { xs: 36, sm: 96 },
            height: { xs: 36, sm: 96 },
            background: "linear-gradient(135deg, #ffffff, #1e88e5)",
            opacity: 0.9,
            borderRadius: "50%",
            transform: "translate(25%, 25%)",
            boxShadow: 3,
          }}
        >
          <Image
            src="/AFLogo.png"
            width={80}
            height={80}
            alt="Logo"
            style={{
              marginTop: "1rem",
              margin: "auto",
              display: "block",
              opacity: 1,
            }}
          />
        </Box>

        <Box
          sx={{
            textAlign: "center",
            color: "white",
            mt: -4,
            pt: 8,
            width: "60%",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            fontWeight={700}
            className={greatVibes.className}
            sx={{
              fontSize: { xs: "2rem", md: "3.75rem" },
              color: "white",
              textShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
            }}
          >
            My Resume
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            fontWeight={300}
            className={montserrat.className}
            sx={{ fontSize: { xs: "1rem", md: "1.5rem" }, mt: 2 }}
          >
            Welcome to the gateway of your professional journey.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SigninForm;
