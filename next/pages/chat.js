import '../src/asset/css/index.css';
import '../src/asset/css/markdown.css';

import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {Button, CssBaseline, Paper, Snackbar} from "@mui/material";

import {ChatLogic} from "../src/logic/ChatLogic";
import ChatConversationAutocomplete from "../app/components/chat/ChatConversationAutocomplete";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import ChatSettings from "../app/components/chat/ChatSettings";
import useThemeHandler from "../app/hooks/useThemeHandler";
import ChatInformation from "../app/components/chat/ChatInformation";
import ChatGenerate from "../app/components/chat/ChatGenerate";
import ChatMessages from "../app/components/chat/ChatMessages";
import ChatStates from "../app/components/chat/ChatStates";

function Chat() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const title = "AI Chat";
  useEffect(() => {
    document.title = title;
  }, []);

  const chatLogic = new ChatLogic();

  // Chat Parameters
  const [messages, setMessages] = useState(chatLogic.initMessages);
  const [apiType, setApiType] = useState(chatLogic.defaultApiType);
  const [model, setModel] = useState(chatLogic.defaultApiModels);
  const [temperature, setTemperature] = useState(0);
  const [stream, setStream] = useState(true);

  // States
  const [editable, setEditable] = useState(true);
  const [sanitize, setSanitize] = useState(true);

  const handleClear = () => {
    setMessages(chatLogic.initMessages);
  };

  useEffect(() => {
    const contentEditableValue = editable ? 'plaintext-only' : 'false';
    const contentEditableElements = document.querySelectorAll('[contenteditable]');

    contentEditableElements.forEach(element => {
      element.setAttribute('contenteditable', contentEditableValue);
    });
  }, [editable]);

  const onConversationOptionClick = async (conversation) => {
    setMessages(conversation.conversation);
  };

  return (
    <>
    {muiTheme &&
      <ThemeProvider theme={muiTheme}>
        <CssBaseline enableColorScheme />
        <HeaderAppBar
          title={title}
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <ChatInformation
          messages={messages}
        />
        <ChatSettings
          apiType={apiType}
          setApiType={setApiType}
          model={model}
          setModel={setModel}
          temperature={temperature}
          setTemperature={setTemperature}
          stream={stream}
          setStream={setStream}
        />

        <Paper elevation={1} className="m-2 p-4 rounded-lg">
          <ChatMessages
            messages={messages}
            setMessages={setMessages}
            sanitize={sanitize}
          />
          <div className="flex-center">
            <ChatGenerate
              messages={messages}
              setMessages={setMessages}
              apiType={apiType}
              model={model}
              temperature={temperature}
              stream={stream}
              setAlertMessage={setAlertMessage}
              setAlertOpen={setAlertOpen}
            />
            <div className="m-2">
              <Button variant="contained" color="secondary" onClick={handleClear}>Clear</Button>
            </div>
          </div>
        </Paper>
        <div className="flex-around m-1">
          <ChatStates
            editable={editable}
            setEditable={setEditable}
            sanitize={sanitize}
            setSanitize={setSanitize}
          />
          <ChatConversationAutocomplete
            conversation={messages}
            onConversationClick={onConversationOptionClick}
          />
        </div>
        <Snackbar
          open={alertOpen}
          autoHideDuration={6000}
          onClose={() => setAlertOpen(false)}
          message={alertMessage}
        />
      </ThemeProvider>
    }
    </>
  )
}

export default Chat;