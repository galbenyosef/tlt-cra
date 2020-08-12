import { createGlobalState } from 'react-hooks-global-state';
import {constants} from './components/Utilities'
import { createRef } from 'react';

export const MediaModalTypes = {
    Images: 1,
    Videos: 2,
}

export const ListDisplays = {
    List:1,
    Grid:2,
}

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
        modalOpened:false,
        //budget default values
        budgetFrom:MinPrice,
        budgetTo:MaxPrice,
        budgetActive:0,
        //rooms default values
        roomsFrom:MinRooms,
        roomsTo:MaxRooms,
        roomsActive:0,
        //renovation default values
        renovationFrom:MinRenovation,
        renovationTo:MaxRenovation,
        renovationActive:0,
        //free search default values
        addresses:[],
        addressesActive:0,
        address:'',
        propertyNumber:'',
        //furniture default values
        furnitureFrom:MinFurniture,
        furnitureTo:MaxFurniture,
        furnitureActive:0,

        propertyTypes:[],
        //metres default values
        metresFrom:MinMetres,
        metresTo:MaxMetres,
        metresActive:0,
        //floor default values
        floorFrom:MinFloor,
        floorTo:MaxFloor,
        floorActive:0,
        //extended grid default values
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
    //filter element default values
    currentFilter:{
        currentFilterName:'',
        currentFilterElement:'',
    },
    isFavouritesView: false,
    property: null,
    //data
    properties:[],
    propertiesNumbers:[],
    addresses: [],
    neighborhoods: [],
    city:null,

    //elementary
    sideFiltersVisible: false,
    listRef: null,
    loading: false,
    addressSearch: '',
    device:null,
    rootRef:createRef(),
    headerHeight:118,
    listDisplay:ListDisplays.List,

    //modals
    media:{
        images:[],
        videos:[],
        type:0,
        opened:false
    },
    map:{
        lon:0,
        lat:0
    },
    lead: {
        opened: false,
        attributes:{
            actual_when: '',
            kala_property_id: '',
        },
        user_id: '',
        subject: '',
        full_name: '',
        phone: '',
        email: '',
        comments: '',

    },
};

export const { useGlobalState,setGlobalState,getGlobalState } = createGlobalState(initialState)