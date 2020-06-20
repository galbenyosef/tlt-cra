
const range = (min, max , step = 1) => {

  const arr = []
  const totalSteps = Math.floor((max - min)/step)

  for (let i = 0; i <= totalSteps; i++ ) { 
    arr.push(i * step + min) 
  }

  return arr;
}

const constants = {
  MaxPrice: 18000,
  MaxRooms: 10,
  MaxRenovation:4,
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

export {constants,renovationTypes,range,furnitureTypes}