import { createGlobalState } from 'react-hooks-global-state';
import {constants} from './components/Utilities'
import { createRef } from 'react';

const {
    MinPrice,
    MaxPrice,
    MinRooms,
    MaxRooms,
    MinRenovation,
    MaxRenovation,
    MinFurniture,
    MaxFurniture,
    MinMetres,
    MaxMetres,
    MinFloor,
    MaxFloor
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
        propertyNumber:'',
        furnitureFrom:MinFurniture,
        furnitureTo:MaxFurniture,
        furnitureActive:0,
        propertyTypes:[],
        metresFrom:MinMetres,
        metresTo:MaxMetres,
        metresActive:0,
        floorFrom:MinFloor,
        floorTo:MaxFloor,
        floorActive:0,
        terrace:false,
        bathtub:false,
        landscape:false,
        airconditioner:false,
        parking:false,
        boiler:false,
        elevator:false,
        warehouse:false,
        garden:false,
        accessibility:false,
        saferoom:false,
        bars:false,
        nets:false,
        electricshutters:false,
        parentsunit:false,
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
        favourites: [],
        favouritesDisplayed: false
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
    sideFiltersVisible: false,
    listRef: null,
    loading: false,
    addressSearch: '',
    device:null,
    rootRef:createRef(null)
};

export const { useGlobalState,setGlobalState,getGlobalState } = createGlobalState(initialState)