import { createGlobalState } from 'react-hooks-global-state';
import {constants, ListDisplays} from './components/Utilities'
import { createRef } from 'react';
import moment from "moment";

const {
    MinPrice,
    MaxPrice,
    MinRooms,
    MaxRooms,
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
        renovations:[],
        renovationActive:0,
        //free search default values
        addresses:[],
        addressesActive:0,
        address:[],
        propertyNumber:[],
        //furniture default values
        furnitureTypes:[],
        furnitureActive:0,

        //metres default values
        metresFrom:MinMetres,
        metresTo:MaxMetres,
        metresActive:0,
        //floor default values
        floorFrom:MinFloor,
        floorTo:MaxFloor,
        floorActive:0,
        //extended grid default values
        attributesActive:0,
        attributes:{
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
            parentsunit:false
        },
    },
    //filter element default values
    currentFilter:{
        currentFilterName:'',
        currentFilterElement:'',
    },
    isFavouritesView: false,
    property: null,
    //data
    agents:[],
    properties:[],
    propertiesNumbers:[],
    addresses: [],
    city:null,
    page:1,
    perPage:25,
    totalCityCount:0,
    totalFiltered:0,
    addressTree:[],
    addressMap:{},

    //elementary
    listRef: null,
    loading: false,
    device:null,
    rootRef:createRef(),
    headerHeight:118,
    listDisplay:ListDisplays.List,
    chatbotOpened: false,
    sideMenuOpened:false,

    //modals
    media:{
        images:[],
        videos:[],
        type:0,
        opened:false
    },
    map:{
        opened:false,
        lon:0,
        lat:0
    },
    lead: {
        opened: false,
        attributes:{
            actual_when: moment().format("YYYY-MM-DDTHH:mm"),
            kala_property_id: '',
        },
        user_id: '',
        subject: '',
        full_name: '',
        phone: '',
        email: '',
        comments: '',
        status_id: 3124

    },
    feedback:{
        result:'',
        message:'',
        timer:0
    }
};

export const { useGlobalState,setGlobalState } = createGlobalState(initialState)