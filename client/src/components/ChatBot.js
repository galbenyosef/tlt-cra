import React, {useState} from 'react'
import ChatBot from "react-simple-chatbot";
import {colors} from "../colors";
import {ThemeProvider} from "styled-components";
import {useGlobalState} from "../globalState";

const theme = {
  background: '#f5f8fb',
  fontFamily: 'Assistant',
  headerBgColor: colors.darkblue,
  headerFontColor: 'black',
  headerFontSize: '15px',
  botBubbleColor: colors.darkblue,
  botFontColor: 'rgb(0,0,255)',
  userBubbleColor: 'white',
  userFontColor: 'black',
};

export default () => {

  const [chatbotOpened,setChatbotOpened] = useGlobalState('chatbotOpened')
  const [chatbotKey,setChatbotKey] = useState(Math.random() + '')

  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        key={chatbotKey}
        placeholder={'טקסט חופשי'}
        opened={chatbotOpened}
        toggleFloating={setChatbotOpened}
        floating
        bubbleOptionStyle={{background:'white',cursor:'pointer'}}
        headerComponent={
          <div style={{
            alignItems: 'center',
            display: 'flex',
            background:colors.darkblue,
            height: 56,
            justifyContent: 'space-between',
            padding: '0 10px',
          }}>
            <h2>בוט</h2>
            <div style={{display:'flex'}}>
              <button onClick={() => setChatbotKey(Math.random() + '')} style={{cursor:'pointer',display:'flex',}}>
                ​<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.944 12.979c-.489 4.509-4.306 8.021-8.944 8.021-2.698 0-5.112-1.194-6.763-3.075l1.245-1.633c1.283 1.645 3.276 2.708 5.518 2.708 3.526 0 6.444-2.624 6.923-6.021h-2.923l4-5.25 4 5.25h-3.056zm-15.864-1.979c.487-3.387 3.4-6 6.92-6 2.237 0 4.228 1.059 5.51 2.698l1.244-1.632c-1.65-1.876-4.061-3.066-6.754-3.066-4.632 0-8.443 3.501-8.941 8h-3.059l4 5.25 4-5.25h-2.92z"/></svg>              </button>
              <button onClick={() => setChatbotOpened(false)} style={{cursor:'pointer',display:'flex',}}>
                <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  <path d="M0 0h24v24H0z" fill="none"></path>
                </svg>
              </button>
            </div>

          </div>
        }
        steps={[
          {
            id: 'hello-world',
            message: 'שלום, מעוניין בעזרה?',
            trigger: '2',
          },
          {
            id: '2',
            options: [
              { value: 1, label: 'מעוניין לשכור דירה', trigger: '3' },
              { value: 2, label: 'לא תודה', trigger: '4' },
            ],
          },
          {
            id: '3',
            message: 'בקרוב...',
            end:true
          },
          {
            id: '4',
            message: 'שלום ולהתראות',
            end:true
          },
        ]}
      />
    </ThemeProvider>
  )
}