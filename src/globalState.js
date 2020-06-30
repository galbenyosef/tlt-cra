import { createGlobalState } from 'react-hooks-global-state';
import {constants} from './components/Utilities'

const {
    MinPrice,
    MaxPrice,
    MinRooms,
    MaxRooms,
    MinRenovation,
    MaxRenovation,
    MinFurniture,
    MaxFurniture,
} = constants

const initialState = {
    filters:{
        //default values
        budgetFrom:MinPrice,
        budgetTo:MaxPrice,
        budgetActive:0,
        roomsFrom:MinRooms,
        roomsTo:MaxRooms,
        roomsActive:0,
        renovationFrom:MinRenovation,
        renovationTo:MaxRenovation,
        renovationActive:0,
        addresses:[],
        addressesActive:0,
        address:'',
        furnitureFrom:MinFurniture,
        furnitureTo:MaxFurniture,
        furnitureActive:0,
    },
    currentFilter:{
        currentFilterName:'',
        currentFilterElement:'',
    },
    properties: {
        data: [],
        dataFiltered: [],
        currentCount: 0,
        totalCount: 0,
    },
    selectedProperty: '' ,
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