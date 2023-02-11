import { createTheme } from "@mui/material";

// declare module "@mui/material/styles" {
//   interface Theme {
//     status: {
//       danger: string;
//     };
//   }
//   // allow configuration using `createTheme`
//   interface ThemeOptions {
//     status?: {
//       danger?: string;
//     };
//   }
// }

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#b5463f",
    },
    secondary: {
      main: "#78909c",
    },
  },
});

export default theme;
