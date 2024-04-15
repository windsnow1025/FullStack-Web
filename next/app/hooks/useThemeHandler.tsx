import { useEffect, useState } from 'react';
import {applyTheme, createMUITheme} from "@/app/utils/Theme";
import { Theme } from "@mui/material/styles";

const useThemeHandler = () => {
  const [systemTheme, setSystemTheme] = useState<string>();
  const [muiTheme, setMuiTheme] = useState<Theme>();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "system";
    if (!["system", "light", "dark"].includes(systemTheme!!)) {
      setSystemTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    applyTheme(systemTheme!!);
    setMuiTheme(createMUITheme(systemTheme!!));
  }, [systemTheme]);

  return { systemTheme, setSystemTheme, muiTheme };
};

export default useThemeHandler;