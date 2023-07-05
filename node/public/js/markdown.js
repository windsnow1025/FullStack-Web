import axios from 'axios';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import 'github-markdown-css/github-markdown-dark.css';
import '../css/markdown.css';

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: false,
    xhtml: false
});

function getFileName() {
    const urlParams = new URLSearchParams(window.location.search);
    const filename = urlParams.get('filename');
    return filename;
}

function setTitle(filename) {
    document.title = filename;
}

async function parseMarkdown(filename) {
    await axios.get('../markdown/' + filename).then(response => {
        markdown = response.data;
        markdown = marked.parse(markdown);
    }).catch(function (error) {
        console.log(error);
    });
}

async function process() {
    var filename = getFileName();
    setTitle(filename);
    await parseMarkdown(filename);
    var markdown_div = document.getElementById('markdown');
    markdown_div.innerHTML = markdown;
}


var markdown;
process();