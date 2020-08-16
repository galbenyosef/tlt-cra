import React, {useEffect, useRef} from 'react'
import { Modal, Button } from '@material-ui/core'
import { useGlobalState, setGlobalState } from '../../globalState'
import DatePicker from "react-datetime-picker"
import {createLeadKala, validateEmail} from "../../dataHandler";
import moment from "moment-timezone";

export const LeadModal = () => {

  const [leadModalData,setLeadModalData] = useGlobalState('lead')
  const dateRef = useRef(0)

  let {
    opened,
    user_id,
    subject,
    full_name,
    phone,
    email,
    comments,
    attributes:{
      actual_when,
      kala_property_id,
      agentName,
      agentPhone,
      propertyName,
    }
  } = leadModalData


  if (!opened)
    return null

  console.log('rendered lead modal')
  console.log(leadModalData)

  const setModalProp = (prop,value) => setLeadModalData(data => ({...data,[prop]:value}))

  const fixedActualWhen = dateRef.current && moment(dateRef.current.value).format("DD-MM-YYYY HH:mm")

  return (
    <Modal open={opened} style={{direction:'rtl',maxHeight:'calc(100vh)'}} onBackdropClick={() => setLeadModalData(data => ({...data,opened:false}))}>
      <div style={{
        right: '50%',
        maxWidth: '90%',
        top: '50%',
        transform: 'translate(50%, -50%)',
        position: 'absolute',
        display:'flex',
      }} >
        <div style={{backgroundColor:'white'}}>
          <div style={{padding:30}}>
            <form style={{display:'flex',flexDirection:'column'}}>
              <label htmlFor='nameInput'>
                שם מלא (חובה)
              </label>
              <input  style={{border:'0.5px solid black',marginBottom:20}} id='nameInput' type='text' value={full_name} onChange={e => setModalProp('full_name',e.currentTarget.value)}/>
              <label htmlFor='phoneInput'>
                טלפון (חובה)
              </label>
              <input type="tel" style={{border:'0.5px solid black',marginBottom:20}} id='phoneInput' type='text' value={phone} onChange={e => setModalProp('phone',e.currentTarget.value)}/>
              <label htmlFor='mailInput'>
                מייל
              </label>
              <input type="email" style={{border:'0.5px solid black',marginBottom:20}} id='mailInput' type='text' value={email} onChange={e => setModalProp('email',e.currentTarget.value)}/>
              <p>בחר תאריך ושעה</p>
              <input style={{marginBottom:20,border: '1px solid black'}} min={actual_when} max={'2021-01-01T00:00'} defaultValue={actual_when} type='datetime-local' ref={dateRef}/>
              <label htmlFor='commentInput'>
                הערות
              </label>
              <textarea style={{border:'0.5px solid black',marginBottom:20}} id='commentInput' type='text' value={comments} onChange={e => setModalProp('comments',e.currentTarget.value)}/>
           {/*   <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                <label htmlFor='commentInput'>
                  אני לא רובוט
                </label>
                <input type='checkbox'/>
              </div>*/}
              <Button style={{border:'1px solid blue'}} color='primary' onClick={() => {
                if (full_name && full_name.length > 2 && phone.replace('-', '').length === 10 && (email ? validateEmail(email) : true) )
                {
                  let subject = [
                    `${full_name}, (${phone})`,
                    `${agentName} (${agentPhone})`,
                    `${propertyName}`
                  ].join(', ')
                  createLeadKala({...leadModalData,subject,attributes:{...leadModalData.attributes,actual_when:fixedActualWhen}})
                }
                else{
                  alert('התגלתה שגיאה באחד מן השדות')
                }
              }}>שלח</Button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  )
}