import axios from "axios";
import { marked } from "marked";
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark.css';
import 'github-markdown-css/github-markdown-dark.css';
import 'font-awesome/css/font-awesome.min.css';
import '../css/markdown.css';

// Account
import { getCookie, handleAuth } from './auth.js';
handleAuth();

// Theme
import { initializeTheme } from './theme.js';
initializeTheme();

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

class GPT {
    constructor() {
        this.messages = [];
        this.status = document.getElementById("status");
        this.wait_response = [];
        this.controller = null;
        this.create_render_message_divs();
        this.add(0);
    }

    async parse(content_div, content_value) {
        content_value = content_value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        content_value = marked.parse(content_value);
        content_div.innerHTML = content_value;
        MathJax.typeset([content_div]);
    }

    // Create and render message_div[] from messages[]
    async create_render_message_divs() {
        // Clear messages_div
        const messages_div = document.querySelector("#messages_div");
        messages_div.innerHTML = "";

        // Create and render
        // Add Button
        const add_button_div_template = document.querySelector('div[name="add_button_div"]');
        const add_button_div = add_button_div_template.cloneNode(true);
        const add_button = add_button_div.querySelector('i[name="add_button"]');
        messages_div.appendChild(add_button_div);
        add_button.onclick = function () {
            this.add(0);
        }.bind(this);

        for (let i = 0; i < this.messages.length; i++) {
            this.create_render_message_div(i);
        }

    }

    // Create and render message_div[index] from messages[index]
    async create_render_message_div(index) {
        const render_index = index + 1;

        // Get the template message div
        const template_message_div = document.querySelector('div[name="message_div"]');

        // Create the new message div
        const message_div = template_message_div.cloneNode(true);

        // Get the role and content elements
        const role_select = message_div.querySelector('select[name="role"]');
        const content_div = message_div.querySelector('div[name="content"]');

        // Get the role and content values in the messages array
        let role_value = this.messages[index]["role"];
        let content_value = this.messages[index]["content"];

        // Update the role and content elements
        role_select.value = role_value;
        this.parse(content_div, content_value);

        // On role change, update messages array
        role_select.addEventListener("change", function () {
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div) - 1;
            this.messages[currentIndex]["role"] = role_select.value;
        }.bind(this));

        // On content focus, show the message content in original format
        content_div.addEventListener("focus", function () {
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div) - 1;
            content_div.innerHTML = this.messages[currentIndex]["content"];
        }.bind(this));

        // On content blur, update messages array
        content_div.addEventListener("blur", function () {
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div) - 1;
            this.messages[currentIndex]["content"] = content_div.innerHTML;
            this.render_message_div(currentIndex);
        }.bind(this));

        // Copy button
        const copy_button = message_div.querySelector('i[name="copy_button"]');
        copy_button.onclick = function () {
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div) - 1;
            this.copy(currentIndex);
        }.bind(this);

        // Delete button
        const delete_button = message_div.querySelector('i[name="delete_button"]');
        delete_button.onclick = function () {
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div) - 1;
            this.delete(currentIndex);
        }.bind(this);

        // Add Button
        const add_button = message_div.querySelector('i[name="add_button"]');
        add_button.onclick = function () {
            const currentIndex = Array.from(message_div.parentElement.children).indexOf(message_div) - 1;
            this.add(currentIndex + 1);
        }.bind(this);

        // Insert the new message div to the messages div
        const messages_div = document.querySelector("#messages_div");
        messages_div.insertBefore(message_div, messages_div.childNodes[render_index]);
    }

    // Render message_div[index] from messages[index]
    async render_message_div(index, parse = true) {
        // Get the message div
        const message_div = document.querySelector('div[name="message_div"]:nth-child(' + (index + 2) + ')');

        // Get the role and content elements
        const role_select = message_div.querySelector('select[name="role"]');
        const content_div = message_div.querySelector('div[name="content"]');

        // Get the role and content values in the messages array
        let role_value = this.messages[index]["role"];
        let content_value = this.messages[index]["content"];

        // Update the role and content elements
        role_select.value = role_value;
        if (content_div == document.activeElement || parse == false) {
            content_div.innerHTML = content_value;
        } else {
            this.parse(content_div, content_value);
        }
    }

    // Append a new chunk to message_div[index]
    async append_chunk_to_message_div(index, chunk) {
        // Get the message div
        const message_div = document.querySelector('div[name="message_div"]:nth-child(' + (index + 2) + ')');

        // Get the content div
        const content_div = message_div.querySelector('div[name="content"]');

        // Append the chunk
        content_div.innerHTML += chunk;
    }

    // Generate Response
    async generate() {
        // If not logged in, return
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login first.");
            return;
        }

        // Set status to generating
        this.status.innerHTML = "Generating...";
        document.getElementById("generate").innerHTML = "Stop";

        // Set streaming status
        this.wait_response.push(true);
        const stream_index = this.wait_response.length - 1;

        // Get parameters
        const messages = JSON.stringify(this.messages);
        const model = document.getElementById("model").value;
        const temperature = document.getElementById("temperature").value;
        const stream = document.getElementById("stream").checked;

        // Create a new form data object
        const formData = new FormData();
        formData.append("messages", messages);
        formData.append("model", model);
        formData.append("temperature", temperature);
        formData.append("stream", stream);
        formData.append("token", token);

        // Stream mode off
        if (!stream) {
            try {
                const res = await axios.post("/api/gpt/", formData);

                // Stop if not waiting for response
                if (!this.wait_response[stream_index]) {
                    return;
                }

                // Get the response
                let content = res.data;
                content = content.replace("<", "&lt;").replace(">", "&gt;");

                // Update the last message div
                this.messages.push({ "role": "assistant", "content": content });

                // Render the new message div
                this.create_render_message_div(this.messages.length - 1);

                // Add a new message div
                this.add(this.messages.length);

                // Set status to ready
                this.status.innerHTML = "Ready";
                document.getElementById("generate").innerHTML = "Generate";
            } catch (err) {
                this.status.innerHTML = err;
                document.getElementById("generate").innerHTML = "Generate";
            }
        }

        async function processChunk(reader, controller) {
            const { done, value } = await reader.read();
            if (done) {
                controller.close();
                return;
            }

            // Process the chunk
            let chunk = new TextDecoder("utf-8").decode(value);
            chunk = chunk.replace("<", "&lt;").replace(">", "&gt;");

            // Update messages array
            gpt.messages[gpt.messages.length - 1]["content"] += chunk;

            // Append the chunk to the message div
            gpt.append_chunk_to_message_div(gpt.messages.length - 1, chunk);

            await processChunk(reader, controller);
        }

        // Stream mode on
        if (stream) {
            this.controller = new AbortController();
            try {
                const response = await fetch("/api/gpt/", {
                    method: "POST",
                    body: formData,
                    signal: this.controller.signal,
                });

                const reader = response.body.getReader();
                const processedStream = new ReadableStream({
                    async start(controller) {
                        gpt.messages.push({ role: "assistant", content: "" });
                        gpt.create_render_message_div(gpt.messages.length - 1);
                        await processChunk(reader, controller);
                    },
                }, { signal: this.controller.signal });

                await processedStream.getReader().read();

                // Set status
                this.status.innerHTML = "Ready";
                document.getElementById("generate").innerHTML = "Generate";

                // Render the last message div
                this.render_message_div(this.messages.length - 1);

                // Add a new message div
                this.add(this.messages.length);
            } catch (error) {
                this.status.innerHTML = error;
                document.getElementById("generate").innerHTML = "Generate";
            }
        }

        // Scroll to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Stop generating response
    async stop() {
        // Set last wait_response status to false
        this.wait_response[this.wait_response.length - 1] = false;

        // Abort controller
        if (this.controller) {
            this.controller.abort();
        }

        // Set status to ready
        this.status.innerHTML = "Ready";
        document.getElementById("generate").innerHTML = "Generate";
    }

    // Focus on the content of message at index
    async focus(index) {
        const message = document.getElementById("messages_div").childNodes[index + 1];
        message.querySelector('div[name="content"]').focus();
    }

    // Add a new message at index
    async add(index) {
        // Abort controller
        if (this.controller) {
            this.controller.abort();
        }

        // Set status to ready
        this.status.innerHTML = "Ready";
        document.getElementById("generate").innerHTML = "Generate";

        // Add a new message at index
        if (index < 0 || index > this.messages.length) {
            console.log("Invalid index");
            return;
        }
        this.messages.splice(index, 0, { "role": "user", "content": "" });

        // Create and render the new message div at index
        this.create_render_message_div(index);

        // Re-render the messages div from index + 1
        for (let i = index + 1; i < this.messages.length; i++) {
            this.render_message_div(i);
        }

        // Focus on the new message div
        this.focus(index);
    }

    // Delete the message at index
    async delete(index) {
        // Abort controller
        if (this.controller) {
            this.controller.abort();
        }

        // Set status to ready
        this.status.innerHTML = "Ready";
        document.getElementById("generate").innerHTML = "Generate";

        // Delete the message at index
        if (index < 0 || index >= this.messages.length) {
            console.log("Invalid index");
            return;
        }
        this.messages.splice(index, 1);

        // Re-render the messages div from index
        for (let i = index; i < this.messages.length; i++) {
            this.render_message_div(i);
        }

        // Remove the last message div
        const messages_div = document.getElementById("messages_div");
        messages_div.removeChild(messages_div.lastChild);
    }

    // Copy to clipboard
    async copy(index) {
        // Get message content
        const message = this.messages[index];
        const content = message["content"];

        // Copy to clipboard
        navigator.clipboard.writeText(content);
    }

    // Not supported in mobile browsers

    // async save() {
    //     const fileHandle = await window.showSaveFilePicker({
    //         suggestedName: 'messages.json',
    //         types: [{
    //             description: 'JSON Files',
    //             accept: {
    //                 'application/json': ['.json'],
    //             },
    //         }],
    //     });

    //     const writable = await fileHandle.createWritable();
    //     await writable.write(JSON.stringify(this.messages));
    //     await writable.close();
    // }

    // Save the messages array as a JSON file
    async save() {
        const fileName = 'messages.json';
        const data = JSON.stringify(this.messages);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    // Load the messages array from a JSON file
    async load() {
        // Request a JSON file from the user
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = e => {
            // Get the file
            const file = e.target.files[0];

            // Read the file
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = readerEvent => {
                const content = readerEvent.target.result;

                // Parse the JSON file
                const messages = JSON.parse(content);

                // Update the messages array
                this.messages = messages;

                // Re-render the messages div
                const messages_div = document.getElementById("messages_div");
                messages_div.innerHTML = "";
                this.create_render_message_divs();
            }
        }
        input.click();

        // Scroll to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
    }
}

const gpt = new GPT();

// Get buttons
const generateButton = document.getElementById("generate");
const saveButton = document.getElementById("save");
const loadButton = document.getElementById("load");

// Bind buttons
generateButton.onclick = function () {
    // Switch between generate and stop
    if (generateButton.innerHTML === "Stop") {
        gpt.stop();
    } else {
        gpt.generate();
    }
}
saveButton.onclick = gpt.save.bind(gpt);
loadButton.onclick = gpt.load.bind(gpt);

// Bind Ctrl+Enter to generate
document.addEventListener('keydown', function (event) {
    if (event.repeat) return;
    if (event.ctrlKey && event.key === 'Enter') {
        document.activeElement.blur();
        generateButton.click();
    }
});

// Temperature slider
const temperatureInput = document.getElementById('temperature');
const temperatureValue = document.getElementById('temperature-value');

temperatureInput.addEventListener('input', () => {
    temperatureValue.textContent = temperatureInput.value;
});