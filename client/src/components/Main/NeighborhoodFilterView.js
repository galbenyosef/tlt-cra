import React, { useEffect } from 'react'
import {useGlobalState, getGlobalState} from '../../globalState';
import { Checkbox } from '@material-ui/core';





export const NeighborhoodsFilterView = ({neighborhoodSelected,setNeighborhoodSelected}) => {

    const [addressesMap] = useGlobalState('neighborhoods');
    const [addressSearch] = useGlobalState('addressSearch');
    const filters = getGlobalState('filters')

    useEffect(() => {
        setNeighborhoodSelected(filters.addresses.filter(v => !v.includes(',')))
    },[])

    let data = []

    let neighborhoodsExists = addressesMap.filter(neighborhood => neighborhood.match(addressSearch)).length

    if (neighborhoodsExists)
        data = addressesMap.filter(neighborhood => neighborhood.match(addressSearch))
    else 
        data = addressesMap

    return (
        <div style={{display:'flex',flexDirection:'column',width:'100%',overflow:'auto',flexWrap:'wrap',height:'150px'}}>

            {
                data.map(neighbor => 
                    <div key={neighbor} style={{display:'flex',flexDirection:'row',width:'45%',padding:10,alignItems:'center'}}>
                        <Checkbox checked={neighborhoodSelected.includes(neighbor)} onChange={() => {
                            if (neighborhoodSelected.includes(neighbor)){
                                setNeighborhoodSelected(_neighborhoodSelected => _neighborhoodSelected.filter(n => n !== neighbor))
                            }
                            else{
                                setNeighborhoodSelected(_neighborhoodSelected => _neighborhoodSelected.concat(neighbor))
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