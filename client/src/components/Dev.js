
import React, {useRef, useState} from "react";
import {changeFilters} from "../dataHandler";
import WindowedSelect from "react-windowed-select";
import {newSearchStyle} from "../styles";
import {useGlobalState} from "../globalState";

const customFilterOption = (option, rawInput) => {

  console.log(option,rawInput)
  const words = rawInput.split(' ');

  if (!Number.isInteger(parseInt(rawInput))) {
    return words.reduce(
      (acc, cur) => acc && option.data.address.toLowerCase().includes(cur.toLowerCase()),
      true,
    );
  }
  else{
    return option.data.number.toString().includes(rawInput)
  }
};

const createOptionLabel = option => `${option.address.toLowerCase()} ${option.number.toString()}`

export const Dev = () => {

  const [addressesData] = useGlobalState('addresses');
  const [inputValue,setInputValue] = useState('')
  const [propertiesNumbers] = useGlobalState('propertiesNumbers')
  const [properties] = useGlobalState('properties')
  const [filters,setFilters] = useGlobalState('filters')
  const {address} = filters


  let filteredCount = 0

  for (let property of properties){
    property.isFiltered && ++filteredCount
  }

  return (
    <div style={{width:'100%',display:'flex'}}>
      <WindowedSelect
        filterOption={customFilterOption}
        styles={newSearchStyle}
        isClearable={true}
        isRtl={true}
        closeMenuOnSelect={false}
        isMulti={false}
        menuIsOpen={!!inputValue}
        getOptionLabel={prop => createOptionLabel(prop)}
        openMenuOnFocus={false}
        openMenuOnClick={true}
        inputValue={inputValue}
        components={{ SingleValue: () => <div>{`מוצגים ${filteredCount} פריטים`}</div>}}
        onInputChange={e => setInputValue(e)}
        options={properties.map(prop => ({number:prop.custom_id,address:[prop.area, prop.neighborhood_name, prop.street_name].join(', ')}))}
        placeholder="הקש כתובת/ מספר נכס"
/*        value={filters.propertyNumber.length ? [`נכס מספר #${filters.propertyNumber[0]}`] : [filters.address[0]]}
        onChange={e => {
          console.log(e)
          if (!e)
            changeFilters({...filters,address:[],addresses:[],addressesActive:0,propertyNumber:[]})
          else if(!Number.isInteger(parseInt(e))){
            if (address.includes(e))
              changeFilters({...filters,address:address.filter(addr => addr !== e),addresses:[],addressesActive:0,propertyNumber:[]})
            else
              changeFilters({...filters,address:address.concat(e),addresses:[],addressesActive:0,propertyNumber:[]})
          }
          else{
            changeFilters({...filters,propertyNumber:e ? [e] : [],addresses:[],addressesActive:0,address:''})
          }
        }}*/
      />
    </div>
  )



}