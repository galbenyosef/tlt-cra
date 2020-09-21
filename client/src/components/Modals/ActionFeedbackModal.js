import React, {useEffect} from 'react'
import {useGlobalState} from "../../globalState";
import {setFeedback} from "../../dataHandler";

const decreaseFeedbackTimer = () => setFeedback(feedback => ({...feedback,timer:feedback.timer - 1}))

export default () => {

    const [feedback] = useGlobalState('feedback')
    const {result,message,timer} = feedback

    useEffect(() => {
        let kak

        if (timer){
            kak = setTimeout(decreaseFeedbackTimer,1000)
        }

        return () => clearTimeout(kak)

    },[timer])

    if (!timer)
        return null
    if (timer) {

        return (
          <div style={{
            backgroundColor: result? 'lime':'red',
            zIndex: 1301,
            display: 'flex',
            alignItems: 'center',
            fontFamily:'Rubik',
            position: 'fixed',
            height:60,
            justifyContent:'center',
            bottom: 20,
            right: 20,
            color: result? 'black':'white'
          }}>
              <div>
                  {`${message}, ${timer}...`}
              </div>
          </div>
        )
    }
}