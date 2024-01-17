import '../src/asset/css/index.css';
import '../src/asset/css/markdown.css';

import React, {useState, useEffect, useRef} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {applyTheme, getInitMUITheme, getLightMUITheme} from "../src/logic/ThemeLogic";
import {parseMarkdown} from "../src/util/MarkdownParser";
import {parseLaTeX} from "../src/util/LaTeXParser";
import {ThemeProvider} from "@mui/material/styles";

function MarkdownViewer() {
  const [theme, setTheme] = useState(getLightMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
  }, []);

  const router = useRouter();
  const [markdown, setMarkdown] = useState('');
  const markdownRef = useRef(null);
  const { filename } = router.query;

  useEffect(() => {
    document.title = "Markdown Viewer";
    applyTheme(localStorage.getItem("theme"));

    const fetchMarkdown = async () => {
      const res = await axios.get(`/markdown/${filename}`);
      const markdown = res.data;

      setMarkdown(parseMarkdown(markdown));
      parseLaTeX(markdownRef.current);
    };

    if (filename) {
      fetchMarkdown();
    }
  }, [filename]);

  return (
    <ThemeProvider theme={theme}>
      <div className="m-2">
        <div
          className="markdown-body p-2 min-h-16"
          ref={markdownRef}
          dangerouslySetInnerHTML={{__html: parseMarkdown(markdown)}}
        />
      </div>
    </ThemeProvider>
  );
}

export default MarkdownViewer;
