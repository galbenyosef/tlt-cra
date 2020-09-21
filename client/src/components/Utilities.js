
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

export const MediaModalTypes = {
  Images: 1,
  Videos: 2,
}

export const ListDisplays = {
  List:1,
  Grid:2,
}

const constants = {
  MinPrice: 1000,
  MaxPrice: 25000,
  MinRooms: 1,
  MaxRooms: 6,
  MinRenovation:1,
  MaxRenovation:4,
  MinMetres:0,
  MaxMetres:300,
  MinFloor:0,
  MaxFloor:50,
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
  2:'דירה משופצת במצב מצוין',
  3:'בניין חדש',
  4:'מושקעת ומשודרגת מהרגיל'
}

const FurnitureTypes = {
  NONE: 'ללא ריהוט',
  PARTIAL: 'ריהוט חלקי',
  FULL: 'ריהוט מלא',
}

export const getValueByDevice = (desktop,tablet,mobile) => {
  if (window.innerWidth < 600)
      return mobile
  if (window.innerWidth < 1280)
      return tablet
  return desktop
}

const LeadTypes = {
  MeetingRequest:1,
  WannaHearMore:2,
}

export {constants,renovationTypes,range,FurnitureTypes,devices,LeadTypes,switchFilters,renovationDescription}