import { createGlobalState } from 'react-hooks-global-state';
import {constants} from './components/Utilities'

const initialState = {
    filters:{
        //default values
        budgetFrom:1000,
        budgetTo:constants.MaxPrice,
        roomsFrom:1,
        roomsTo:constants.MaxRooms,
        renovationFrom:1,
        renovationTo:constants.MaxRenovation,
        addresses:[],
        furnitureFrom:1,
        furnitureTo:constants.MaxFurniture
    },
    currentFilter:{
        currentFilterName:'',
        currentFilterElement:'',
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
        dataFiltered: [],
        currentCount: 0,
        totalCount: 0,
    },
    favourites:[],
    selectedProperty: 65156 ,
    newLeadModal: {
        full_name: '',
        phone: '',
        actually_when: '',
        type: '',
        comments: ''
    },
    videoRef:null,
    allMediaModal:false,
    singleMediaModal:false,
    addresses: [],
    addressesMap: [],
    sideBarVisible: false,
    listRef: null,
    loading: false,
    addressSearch: '',
    device:null,
};

export const { useGlobalState,setGlobalState,getGlobalState } = createGlobalState(initialState)