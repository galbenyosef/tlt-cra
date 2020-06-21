import { createGlobalState } from 'react-hooks-global-state';
import {constants} from './components/Utilities'

const initialState = {
    filters:{
        //what to render
        currentPressedName:'',
        //where to render
        currentPressedElement:null,
        //default values
        budgetFrom:1500,
        budgetTo:constants.MaxPrice,
        roomsFrom:1,
        roomsTo:constants.MaxRooms,
        renovationFrom:1,
        renovationTo:constants.MaxRenovation,
        addresses:[],
        furnitureFrom:1,
        furnitureTo:constants.MaxFurniture
    },
    urlOptionsJson: {
        price: [],
        rooms: [],
        renovation: [],
        addresses: [],
        furniture: []
    },
    properties: {
        data: [],
        currentCount: 0,
        totalCount: 0,
    },
    favourites:[],
    selectedProperty: 65156,
    addresses: [],
    addressesMap: [],
    sideBarVisible: false,
    isDesktop: true,
    listRef: null,
    loading: false,
    addressSearch: '',
};

export const { useGlobalState,setGlobalState,getGlobalState } = createGlobalState(initialState)