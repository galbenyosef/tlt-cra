import React from 'react'
import {useGlobalState} from '../globalState';
import { Checkbox } from '@material-ui/core';





export const NeighborhoodsFilterView = () => {

    const [addressesMap, setAddressesMap] = useGlobalState('addressesMap');
    const [addressSearch, setAddressSearch] = useGlobalState('addressSearch');
    const [filters, setFilters] = useGlobalState('filters');

    console.log('NeighborhoodsFilterView rendered',addressesMap)
    let data = []

    let neighborhoodsExists = Object.keys(addressesMap).filter(neighborhood => neighborhood.match(addressSearch)).length

    if (neighborhoodsExists)
        data = Object.keys(addressesMap).filter(neighborhood => neighborhood.match(addressSearch))
    else 
        data = Object.keys(addressesMap)

    return (
        <div style={{display:'flex',flexDirection:'column',width:'100%',overflow:'auto',flexWrap:'wrap',height:'150px'}}>

            {
                data.map(neighbor => 
                    <div key={neighbor} style={{display:'flex',flexDirection:'row',width:'45%',padding:10,alignItems:'center'}}>
                        <Checkbox checked={filters.addresses.includes(neighbor)} onChange={() => {
                        let newAddresses = [...filters.addresses]
                        if (filters.addresses.includes(neighbor)){
                            newAddresses.splice(filters.addresses.indexOf(neighbor),1)
                            setFilters({...filters,addresses:newAddresses})
                        }
                        else{
                            newAddresses.push(neighbor)
                            setFilters({...filters,addresses:newAddresses})
                        }
                        }}/>
                        {
                            neighbor
                        }
                    </div>
                )
            }
        </div>

        )

}