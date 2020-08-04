import {colors} from "./colors";

export const searchStyle = {
    option: (provided, state) => { return({
      ...provided,
      direction:'rtl',
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 10,
      fontSize: state.value?.includes(',') ? 14:18,
      fontWeight: state.value?.includes(',') ? null:'bolder'
    })},
    control: (provided, state) => ({
        ...provided,
        // none of react-select's styles are passed to <Control />
        borderRadius: 0,
        borderBottom:`2px solid ${colors.darkblue}`,
        borderTop:0,
        borderLeft:0,
        borderRight:0,
        color:'black',
        fontFamily:'Assistant',
        fontWeight:'bold'
    }),
    indicatorSeparator: () => ({
        display:'none'
    }),
    dropdownIndicator:  (provided, state)  => ({
        ...provided,
        color:'rgba(29,31,60,.7)',
    }),
    placeholder: (provided, state) => ({
        ...provided,
        color:'black',
    }),
    menu: (provided, state) => ({
        ...provided,
        zIndex:2
    }),
}

export const clearFilterStyle = {
    fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
    borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
    borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'
}

export const filterBoxStyle = {flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}

