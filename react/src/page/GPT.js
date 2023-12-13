import React, {useState, useEffect} from 'react';
import AuthDiv from '../component/AuthDiv';
import ThemeSelect from '../component/ThemeSelect';
import MessageDiv from "../component/MessageDiv";
import axios from 'axios';

function GPT() {
  return (
    <div>
      <div className="Flex-space-around">
        <AuthDiv/>
        <ThemeSelect/>
      </div>
    </div>
  )
}

export default GPT;