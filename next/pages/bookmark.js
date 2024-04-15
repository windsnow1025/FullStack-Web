import '../src/asset/css/index.css';

import React, {useEffect} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import BookmarkDataGrid from "../app/components/BookmarkDataGrid";
import {CssBaseline} from "@mui/material";
import useThemeHandler from "../app/hooks/useThemeHandler";

function Bookmark() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  useEffect(() => {
    document.title = "Bookmark";
  }, []);

  return (
    <>
      {muiTheme &&
        <ThemeProvider theme={muiTheme}>
          <CssBaseline enableColorScheme />
          <HeaderAppBar
            title="Bookmarks"
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
          <BookmarkDataGrid/>
        </ThemeProvider>
      }
    </>
  );
}

export default Bookmark;