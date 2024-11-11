// theme.ts (create a theme file)
import { createTheme } from "@mui/material/styles";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: "300" });

const fontProvider = createTheme({
  typography: {
    fontFamily: montserrat.style.fontFamily,
  },
});

export default fontProvider;
