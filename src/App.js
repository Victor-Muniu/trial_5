import { CssBaseline, GlobalStyles } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


function App() {
  const globalStyles = {
    a: {
      color: "unset",
      textDecoration: "none"
    }
  };
  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
