
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

/**
 * Takes a screenshot from video.
 * @param videoEl {Element} Video element
 * @param scale {Number} Screenshot scale (default = 1)
 * @returns {Element} Screenshot image element
 */
export function getScreenshot(videoEl, scale) {
  scale = scale || 1;

  const canvas = document.createElement("canvas");
  canvas.width = videoEl.clientWidth * scale;
  canvas.height = videoEl.clientHeight * scale;
  canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);

  const image = new Image()
  image.src = canvas.toDataURL();
  return image;
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