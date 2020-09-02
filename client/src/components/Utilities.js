
const range = (min, max , step = 1) => {

  const arr = []
  const totalSteps = Math.floor((max - min)/step)

  for (let i = 0; i <= totalSteps; i++ ) { 
    arr.push(i * step + min) 
  }

  return arr;
}

const devices = {
  Mobile:1,
  Tablet:2,
  Desktop:3
}

const constants = {
  MinPrice: 1000,
  MaxPrice: 10000,
  MinRooms: 1,
  MaxRooms: 6,
  MinRenovation:1,
  MaxRenovation:4,
  MinMetres:1,
  MaxMetres:100,
  MinFloor:0,
  MaxFloor:10,
}

const switchFilters = {
  airconditioner:'מיזוג',
  terrace:'מרפסת',
  shower:'מקלחת',
  bathtub:'אמבטיה',
  landscape:'נוף',
  parking:'חניה',
  boiler:'דוד שמש/חשמלי',
  elevator:'מעלית',
  warehouse:'מחסן',
  garden:'גינה',
  accessibility:'נגישות לנכים',
  saferoom:'ממ"ד',
  bars:'סורגים',
  nets:'חלונות מרושתים',
  parentsunit:'יחידת הורים',
  electricshutters:'תריס חשמלי',
}

const renovationTypes = {
  1:'שמורה',
  2:'משופצת',
  3:'חדשה מקבלן',
  4:'משופצת ברמה גבוהה'
}

const renovationDescription = {
  1:'לא שופצה אך מצבה טוב',
  2:'שופצה ב-5 שנים האחרונות',
  3:'לא גרו בה מעולם',
  4:'נבנתה ב-5 שנים האחרונות'
}

const FurnitureTypes = {
  1: 'ללא ריהוט',
  2: 'ריהוט חלקי',
  3: 'ריהוט מלא',
}

/*const propertyTypes = {
  Apartment:'דירה',
  Unit:'יחידת דיור',
  Garden:'דירת גן',
  Dou:'דו משפחתי',
  Penthouse:'דירה',
  Villa:'דירה',
}*/

export const getValueByDevice = (desktop,tablet,mobile) => {
  if (window.innerWidth < 560)
      return mobile
  if (window.innerWidth < 1200)
      return tablet
  return desktop
}

const LeadTypes = {
  MeetingRequest:1,
  WannaHearMore:2,
}

export {constants,renovationTypes,range,FurnitureTypes,devices,LeadTypes,switchFilters,renovationDescription}