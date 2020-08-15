import {colors} from "../colors";
import {FaRegHandPointer} from "react-icons/fa";
import React from "react";


export default () => {


  return (
    <div style={{display:'flex',flexWrap:'wrap',fontFamily:'Assistant',width:'100%'}}>
      <div style={{height:60,width:'100%',display:'flex',justifyContent:'center',
        alignItems:'center',backgroundColor:colors.darkblue,position:'relative'}}>
        <p style={{padding:'0px 20px',textAlign:'center'}}>צריך עזרה? לא מוצא את הנכס שאתה מחפש? חייג עכשיו *4567 !</p>
        <div style={{bottom: -20,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderTop: `20px solid ${colors.darkblue}`,
          position: 'absolute'}}></div>
      </div>
      <div style={{minHeight:160,padding:'30px 0px',width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',backgroundColor:'black',flexWrap:'wrap'}}>
        <div style={{color:colors.darkblue,padding:20,margin:'auto',minHeight:160,maxWidth:250,display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
          <p style={{fontSize:24}}>קצת עלינו</p>
          <p style={{fontSize:14}}>חברת תיווך ללא תיווך נוסדה בשנת 2014 ושינתה את כללי המשחק מקצה לקצה.
            מטרתנו היא להביא את החיבור הטוב ביותר בין השוכרים הפוטנציאלים לבין בעלי הנכסים.
          </p>
        </div>
        <div style={{color:colors.darkblue,margin:'auto',minWidth:350,maxWidth:800,minHeight:160,display:'flex',justifyContent:'space-around',alignItems:'center'}}>
          <div style={{minHeight:160,display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
            <p style={{fontSize:18,whiteSpace:'nowrap'}}>תפריט ראשי</p>
            <div>
              <p style={{fontSize:14}}>ראשי</p>
              <p style={{fontSize:14}}>אודות</p>
              <p style={{fontSize:14}}>אודות</p>
              <p style={{fontSize:14}}>אודות</p>
              <p style={{fontSize:14}}>אודות</p>
            </div>
          </div>
          <div style={{minHeight:160,display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
            <p style={{fontSize:18,whiteSpace:'nowrap'}}>תפריט ראשי</p>
            <div>
              <p style={{fontSize:14}}>ראשי</p>
              <p style={{fontSize:14}}>אודות</p>
              <p style={{fontSize:14}}>אודות</p>
              <p style={{fontSize:14}}>אודות</p>
              <p style={{fontSize:14}}>אודות</p>
            </div>
          </div>
          <div style={{minHeight:160,display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
            <p style={{fontSize:18,whiteSpace:'nowrap'}}>תפריט ראשי</p>
            <div>
              <p style={{fontSize:14}}>ראשי</p>
              <p style={{fontSize:14}}>אודות</p>
              <p style={{fontSize:14}}>אודות</p>
              <p style={{fontSize:14}}>אודות</p>
              <p style={{fontSize:14}}>אודות</p>
            </div>
          </div>
        </div>
        <div style={{color:colors.darkblue,padding:20,margin:'auto',display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
          <p style={{fontSize:14,paddingBottom:15}}>הרשם לקבלת נכסים חדשים המתאימים לך !</p>
          <input style={{margin:'auto'}} placeholder='שם מלא'/>
          <input style={{margin:'auto'}} placeholder='אימייל'/>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',margin:'auto',padding:15}}>
            <p>שלח</p>
            <FaRegHandPointer style={{paddingRight:10}}/>
          </div>

        </div>
      </div>
    </div>
  )
}