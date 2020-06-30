
const range = (min, max , step = 1) => {

  const arr = []
  const totalSteps = Math.floor((max - min)/step)

  for (let i = 0; i <= totalSteps; i++ ) { 
    arr.push(i * step + min) 
  }

  return arr;
}

const devices = {
  Desktop:1,
  Mobile:2
}

const constants = {
  MinPrice: 1000,
  MaxPrice: 20000,
  MinRooms: 1,
  MaxRooms: 10,
  MinRenovation:1,
  MaxRenovation:4,
  MinFurniture:1,
  MaxFurniture:3,
}

const renovationTypes = {
  1:'לא משופצת',
  2:'שמורה',
  3:'משופצת',
  4:'משופצת ברמה גבוהה'
}

const furnitureTypes = {
  1: 'ללא ריהוט',
  2: 'ריהוט חלקי',
  3: 'ריהוט מלא',
}

export const getValueByDevice = (desktop,mobile) => {
  if (window.innerWidth < 960)
      return mobile
  else
      return desktop
}

const LeadTypes = {
  MeetingRequest:1,
  WannaHearMore:2,
}

export {constants,renovationTypes,range,furnitureTypes,devices,LeadTypes}