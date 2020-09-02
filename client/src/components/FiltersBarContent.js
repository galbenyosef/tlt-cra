import React from 'react'
import {Grid, Input, InputAdornment} from '@material-ui/core';
import {useGlobalState, setGlobalState} from '../globalState';
import StyledMenu from './Main/StyledMenu'
import {Range} from 'rc-slider';
import {constants, FurnitureTypes, renovationDescription, renovationTypes, switchFilters} from './Utilities'
import 'rc-slider/assets/index.css';
import {filterBoxStyle} from '../styles';
import {changeFilters, handleCloseFilter} from "../dataHandler";
import {colors} from "../colors";
import Checkbox from "@material-ui/core/Checkbox";
import {PropertyAttributesFilter} from "./PropertyAttributesFilter";

const {
  MinPrice,
  MaxPrice,
  MinMetres,
  MaxMetres,
  MinFloor,
  MaxFloor
} = constants

const acceptButtonStyle = {
  width:60,height:40,backgroundColor:colors.darkblue,cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
  color:'black',display:'flex',justifyContent:'center',alignItems:'center'
}

const cancelButtonStyle = {
  width:60,height:40,fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
  borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'
}

export const FiltersBarContent = ({mobile}) => {

  const [addressesData] = useGlobalState('addresses');
  const [filters, setFilters] = useGlobalState('filters');

  const [currentFilter, setCurrentFilter] = useGlobalState('currentFilter');

  let {
    renovations,
    furnitureTypes
  } = filters

  if (!addressesData.length){
    return null
  }

  console.log('render filter bar content')

  const {currentFilterName} = currentFilter
  const {currentFilterElement} = currentFilter

  const Content = React.forwardRef(() =>
    currentFilterName === 'budget' ?
      <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',outline:'none'}}>
        <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
          <div style={{padding:20}}>
            <Range
              step={250}
              min={0}
              max={MaxPrice}
              onChange={(newVal) => setFilters({...filters,budgetFrom:newVal[0],budgetTo:newVal[1]})}
              value={[filters.budgetFrom,filters.budgetTo]}
              reverse
              allowCross={false}
            />
          </div>

          <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',padding:'0px 20px 0px 20px'}}>
            <Input
              onChange={(event) => setFilters({...filters,budgetFrom:parseInt(event.currentTarget.value)})}
              margin="dense"
              inputProps={{
                min: MinPrice,
                max: MaxPrice,
                type: 'number',
              }}
              value={filters.budgetFrom}
              startAdornment={<InputAdornment position="end">מ</InputAdornment>}
            />
            <Input
              onChange={(event) => setFilters({...filters,budgetTo:parseInt(event.currentTarget.value)})}
              margin="dense"
              inputProps={{
                min: MinPrice,
                max: MaxPrice,
                type: 'number',
              }}
              style={{position:'relative'}}
              value={filters.budgetTo}
              startAdornment={<InputAdornment position="end">עד</InputAdornment>}
              endAdornment={filters.budgetTo == constants.MaxPrice && <InputAdornment position="start">+</InputAdornment>}
            />
          </div>
          <div style={filterBoxStyle}>
            <div onClick={() => {
              changeFilters({budgetActive:filters.budgetActive+1});
              handleCloseFilter()}
            }
                 style={acceptButtonStyle}>אישור</div>
            <div onClick={() => handleCloseFilter() }
                 style={cancelButtonStyle}>סגור</div>
          </div>
        </div>
      </div>:
      currentFilterName === 'rooms' ?
        <div style={{direction:'rtl',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',outline:'none',width:300}}>
          <div style={{display:'flex',padding:20,justifyContent:'space-between',alignItems:'center',flexDirection:'column',width:'100%'}}>
            <span style={{width:18}}>מ</span>
            <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',width:'100%'}}>
              {
                [1,2,3,4,5,6].map(num =>
                  <div key={num} onClick={() => setFilters({...filters,roomsFrom:num})}
                       style={{backgroundColor:filters.roomsFrom == num ? colors.darkblue: '',display:'flex',width:30,height:30,justifyContent:'center',alignItems:'center',border:'1px solid black',borderRadius:100,cursor:'pointer'}}>
                    {num != 6 ? num: '6+'}
                  </div>
                )
              }
            </div>
          </div>
          <div style={{display:'flex',padding:20,justifyContent:'space-between',alignItems:'center',flexDirection:'column',width:'100%'}}>
            <span style={{width:18}}>עד</span>
            <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',width:'100%'}}>
              {
                [1,2,3,4,5,6].map(num =>
                  <div key={num} onClick={() => setFilters({...filters,roomsTo:num})}
                       style={{backgroundColor:filters.roomsTo == num ? colors.darkblue: '',display:'flex',width:30,height:30,justifyContent:'center',alignItems:'center',border:'1px solid black',borderRadius:100,cursor:'pointer'}}>
                    {num != 6 ? num: '6+'}
                  </div>
                )
              }
            </div>
            <span>חדרים</span>
          </div>
          <div style={filterBoxStyle}>
            <div onClick={() => {
              changeFilters({roomsActive:filters.roomsActive+1});
              handleCloseFilter()}
            }
                 style={acceptButtonStyle}>אישור</div>
            <div onClick={() => handleCloseFilter() }
                 style={cancelButtonStyle}>סגור</div>
          </div>
        </div>:
        currentFilterName === "renovation" ?
          <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',outline:'none'}}>
            <div style={{width:'300px',display:'flex',flexDirection:'column'}}>
              <div style={{padding:20,display:'flex',flexDirection:'column-reverse',justifyContent:'space-around',height:300}}>
                {
                  Object.keys(renovationTypes).map(
                    type =>
                      <div key={renovationTypes[type]}>
                        <div style={{display:'flex',alignItems:'center'}}>
                          <Checkbox style={{paddingBottom:0,paddingTop:0}} onChange={() => {
                            if (renovations.includes(type))
                              renovations.splice(renovations.indexOf(type),1)
                            else
                              renovations = renovations.concat(type)
                            setFilters({...filters,renovations})
                          }} checked={renovations.includes(type)}/>
                          <span >{renovationTypes[type]}</span>
                        </div>
                        <span style={{fontSize:12,color:'grey',paddingRight:42}}>{renovationDescription[type]}</span>
                      </div>
                  )
                }
              </div>
              <div style={filterBoxStyle}>
                <div onClick={() => {
                  changeFilters({renovationActive:filters.renovationActive+1});
                  handleCloseFilter()}
                }
                     style={acceptButtonStyle}>אישור</div>
                <div onClick={() => handleCloseFilter() }
                     style={cancelButtonStyle}>סגור</div>
              </div>
            </div>
          </div>:
          currentFilterName === "furniture" ?
            <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',outline:'none'}}>
              <div style={{width:'300px',display:'flex',flexDirection:'column'}}>
                <div style={{padding:20,display:'flex',flexDirection:'column-reverse',justifyContent:'space-around',height:170}}>
                  {
                    Object.keys(FurnitureTypes).map(
                      type =>
                        <div key={FurnitureTypes[type]}>
                          <div style={{display:'flex',alignItems:'center'}}>
                            <Checkbox style={{paddingBottom:0,paddingTop:0}} onChange={() => {
                              if (furnitureTypes.includes(type))
                                furnitureTypes.splice(furnitureTypes.indexOf(type),1)
                              else
                                furnitureTypes = furnitureTypes.concat(type)
                              setFilters({...filters,furnitureTypes})
                            }} checked={furnitureTypes.includes(type)}/>
                            <span >{FurnitureTypes[type]}</span>
                          </div>
                        </div>
                    )
                  }
                </div>
                <div style={filterBoxStyle}>
                  <div onClick={() => {
                    changeFilters({furnitureActive:filters.furnitureActive+1});
                    handleCloseFilter()}
                  }
                       style={acceptButtonStyle}>אישור</div>
                  <div onClick={() => handleCloseFilter() }
                       style={cancelButtonStyle}>סגור</div>
                </div>
              </div>
            </div>:
            currentFilterName === 'metres' ?
              <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',outline:'none'}}>
                <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                  <div style={{padding:20}}>
                    <Range
                      step={5}
                      min={0}
                      max={MaxMetres}
                      onChange={(newVal) => setFilters({...filters,metresFrom:newVal[0],metresTo:newVal[1]})}
                      value={[filters.metresFrom,filters.metresTo]}
                      reverse
                      allowCross={false}
                    />
                  </div>

                  <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',padding:'0px 20px 0px 20px'}}>
                    <Input
                      onChange={(event) => setFilters({...filters,metresFrom:parseInt(event.currentTarget.value)})}
                      margin="dense"
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: MaxMetres,
                        type: 'number',
                      }}
                      value={filters.metresFrom}
                      startAdornment={<InputAdornment position="end">מ</InputAdornment>}
                    />
                    <Input
                      onChange={(event) => setFilters({...filters,metresTo:parseInt(event.currentTarget.value)})}
                      margin="dense"
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: MaxMetres,
                        type: 'number',
                      }}
                      value={filters.metresTo}
                      startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                      endAdornment={filters.metresTo == constants.MaxMetres && <InputAdornment position="start">+</InputAdornment>}
                    />
                  </div>
                  <div style={filterBoxStyle}>
                    <div onClick={() => {
                      changeFilters({metresActive:filters.metresActive+1});
                      handleCloseFilter()}
                    }
                         style={acceptButtonStyle}>אישור</div>
                    <div onClick={() => handleCloseFilter() }
                         style={cancelButtonStyle}>סגור</div>
                  </div>
                </div>
              </div>:
              currentFilterName === 'floor' ?
                <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',outline:'none'}}>
                  <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                    <div style={{padding:20}}>
                      <Range
                        step={1}
                        min={MinFloor}
                        max={MaxFloor}
                        onChange={(newVal) => setFilters({...filters,floorFrom:newVal[0],floorTo:newVal[1]})}
                        value={[filters.floorFrom,filters.floorTo]}
                        reverse
                        allowCross={false}
                      />
                    </div>

                    <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',padding:'0px 20px 0px 20px'}}>
                      <Input
                        onChange={(event) => setFilters({...filters,floorFrom:parseInt(event.currentTarget.value)})}
                        margin="dense"
                        inputProps={{
                          step: 1,
                          min: MinFloor,
                          max: MaxFloor,
                          type: 'number',
                        }}
                        value={filters.floorFrom}
                        startAdornment={<InputAdornment position="end">מ</InputAdornment>}
                      />
                      <Input
                        onChange={(event) => setFilters({...filters,floorTo:parseInt(event.currentTarget.value)})}
                        margin="dense"
                        inputProps={{
                          step: 1,
                          min: MinFloor,
                          max: MaxFloor,
                          type: 'number',
                        }}
                        value={filters.floorTo}
                        startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                        endAdornment={filters.floorTo == constants.MaxFloor && <InputAdornment position="start">+</InputAdornment>}
                      />
                    </div>
                    <div style={filterBoxStyle}>
                      <div onClick={() => {
                        changeFilters({floorActive:filters.floorActive+1});
                        handleCloseFilter()}
                      }
                           style={acceptButtonStyle}>אישור</div>
                      <div onClick={() => handleCloseFilter() }
                           style={cancelButtonStyle}>סגור</div>
                    </div>
                  </div>
                </div>:
                currentFilterName == 'attributes' ?
                  <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',outline:'none'}}>
                    <div style={{display:'flex',flexDirection:'column'}}>

                      <PropertyAttributesFilter/>
                      <div style={filterBoxStyle}>
                        <div onClick={() => {
                          changeFilters({attributesActive:filters.attributesActive+1});
                          handleCloseFilter()}
                        }
                             style={acceptButtonStyle}>אישור</div>
                        <div onClick={() => handleCloseFilter() }
                             style={cancelButtonStyle}>סגור</div>
                      </div>
                    </div>
                  </div>:

                  null)


  return (
    mobile ?
      <Content/>
      :
      <StyledMenu
        anchorEl={currentFilterElement}
        open={Boolean(currentFilterElement)}
        onClose={() => handleCloseFilter()}
      >
        <Content/>
      </StyledMenu>
  )
}
