import React, { useState } from 'react'
import { Input, InputAdornment } from '@material-ui/core';
import {useGlobalState, setGlobalState} from '../globalState';
import StyledMenu from './Main/StyledMenu'
import {Range} from 'rc-slider';
import {constants, renovationTypes} from './Utilities'
import { NeighborhoodsFilterView } from './Main/NeighborhoodFilterView';
import 'rc-slider/assets/index.css';
import {filterBoxStyle} from '../styles';
import {changeFilters, handleCloseFilter} from "../dataHandler";
import {colors} from "../colors";

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

export const FiltersBarContent = () => {

  const [addressesData] = useGlobalState('addresses');
  const [addressSearch, setAddressSearch] = useGlobalState('addressSearch');
  const [filters, setFilters] = useGlobalState('filters');
  const [neighborhoodSelected,setNeighborhoodSelected] = useState([])

  const [currentFilter, setCurrentFilter] = useGlobalState('currentFilter');

  if (!addressesData.length){
    return null
  }

  console.log('render filter bar content')

  const {currentFilterName} = currentFilter
  const {currentFilterElement} = currentFilter

  return (
    <StyledMenu
      anchorEl={currentFilterElement}
      open={Boolean(currentFilterElement)}
      onClose={() => handleCloseFilter()}
    >
      {
        currentFilterName === 'budget' ?
          <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,outline:'none'}}>
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
                     style={{width:60,backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                       color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                <div onClick={() => handleCloseFilter() }
                     style={{width:60,fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                       borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
              </div>
            </div>
          </div>:
          currentFilterName === 'rooms' ?
            /*<div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
              <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                <div style={{padding:20}}>
                  <Range
                    step={.5}
                    min={MinRooms}
                    max={MaxRooms}
                    onChange={(newVal) => setFilters({...filters,roomsFrom:newVal[0],roomsTo:newVal[1]})}
                    value={[filters.roomsFrom,filters.roomsTo]}
                    reverse
                    allowCross={false}
                  />
                </div>

                <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',padding:'0px 20px 0px 20px'}}>
                  <Input
                    onChange={(event) => setFilters({...filters,roomsFrom:parseFloat(event.currentTarget.value)})}
                    margin="dense"
                    inputProps={{
                      step: .5,
                      min: MinRooms,
                      max: MaxRooms,
                      type: 'number',
                    }}
                    value={filters.roomsFrom}
                    startAdornment={<InputAdornment position="end">מ</InputAdornment>}
                  />
                  <Input
                    onChange={(event) => setFilters({...filters,roomsTo:parseFloat(event.currentTarget.value)})}
                    margin="dense"
                    inputProps={{
                      step: .5,
                      min: MinRooms,
                      max: MaxRooms,
                      type: 'number',
                    }}
                    value={filters.roomsTo}
                    startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                  />
                </div>
                <div style={filterBoxStyle}>
                  <div onClick={() => {changeFilters({roomsActive:filters.roomsActive+1});handleCloseFilter()}}
                       style={{width:60,backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                         color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                  <div onClick={() => handleCloseFilter() }
                       style={{width:60,fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                         borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                </div>
              </div>
            </div>*/
            <div style={{direction:'rtl',display:'flex',paddingLeft:20,paddingRight:20,justifyContent:'center',alignItems:'center',flexDirection:'column',outline:'none',width:300}}>
              <div style={{display:'flex',padding:20,justifyContent:'space-between',alignItems:'center'}}>
                <span style={{width:18}}>מ</span>
                  <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                  {
                    [1,2,3,4,5,6].map(num =>
                      <div key={num} onClick={() => setFilters({...filters,roomsFrom:num})}
                           style={{backgroundColor:filters.roomsFrom == num ? colors.darkblue: '',display:'flex',width:30,height:30,justifyContent:'center',alignItems:'center',border:'1px solid black',borderRadius:100,cursor:'pointer'}}>
                        {num != 6 ? num: '6+'}
                      </div>
                    )
                  }
                  </div>
                <span>חדרים</span>
              </div>
              <div style={{display:'flex',padding:20,justifyContent:'space-between',alignItems:'center'}}>
                <span style={{width:18}}>עד</span>
                  <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
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
                <div onClick={() => {changeFilters({roomsActive:filters.roomsActive+1});handleCloseFilter()}}
                     style={{width:60,backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                       color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור
                </div>
                <div onClick={() => handleCloseFilter() }
                     style={{width:60,fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                       borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור
                </div>
              </div>
            </div>:
            currentFilterName === "renovation" ?
              <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,outline:'none'}}>
                <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                  <div style={{padding:20}}>
                    <Range
                      step={1}
                      min={MinRenovation}
                      max={MaxRenovation}
                      onChange={(newVal) => setFilters({...filters,renovationFrom:newVal[0],renovationTo:newVal[1]})}
                      value={[filters.renovationFrom,filters.renovationTo]}
                      reverse
                      tipFormatter={val => val}
                      dots={true}
                      marks={renovationTypes}
                      allowCross={false}
                    />
                  </div>

                  <div style={filterBoxStyle}>
                    <div onClick={() => {changeFilters({renovationActive:filters.renovationActive+1});handleCloseFilter()}}
                         style={{width:60,backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                           color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                    <div onClick={() => handleCloseFilter() }
                         style={{width:60,fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                           borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                  </div>
                </div>
              </div>:
                currentFilterName === "furniture" ?
                  <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,outline:'none'}}>
                    <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                      <div style={{padding:20}}>
                        <Range
                          step={1}
                          min={1}
                          max={3}
                          onChange={(newVal) => setFilters({...filters,furnitureFrom:newVal[0],furnitureTo:newVal[1]})}
                          value={[filters.furnitureFrom,filters.furnitureTo]}
                          reverse
                          tipFormatter={val => val}
                          dots={true}
                          marks={{
                            1: 'ללא ריהוט',
                            2: 'ריהוט חלקי',
                            3: 'ריהוט מלא',
                          }}
                          allowCross={true}
                        />
                      </div>

                      <div style={filterBoxStyle}>
                        <div onClick={() => {changeFilters({furnitureActive:filters.furnitureActive+1});handleCloseFilter()}}
                             style={{width:60,backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                               color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                        <div onClick={() => handleCloseFilter() }
                             style={{width:60,fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                               borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                      </div>
                    </div>
                  </div>:
                  currentFilterName === 'metres' ?
                    <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,outline:'none'}}>
                      <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                        <div style={{padding:20}}>
                          <Range
                            step={1}
                            min={MinMetres}
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
                              min: MinMetres,
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
                              min: MinMetres,
                              max: MaxMetres,
                              type: 'number',
                            }}
                            value={filters.metresTo}
                            startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                          />
                        </div>
                        <div style={filterBoxStyle}>
                          <div onClick={() => {
                            changeFilters({metresActive:filters.metresActive+1});
                            handleCloseFilter()}
                          }
                               style={{width:60,backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                 color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                          <div onClick={() => handleCloseFilter() }
                               style={{width:60,fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                 borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                        </div>
                      </div>
                    </div>:
                    currentFilterName === 'floor' ?
                      <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,outline:'none'}}>
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
                            />
                          </div>
                          <div style={filterBoxStyle}>
                            <div onClick={() => {
                              changeFilters({floorActive:filters.floorActive+1});
                              handleCloseFilter()}
                            }
                                 style={{width:60,backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                   color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                            <div onClick={() => handleCloseFilter() }
                                 style={{width:60,fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                   borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                          </div>
                        </div>
                      </div>:
                      null
      }
    </StyledMenu>
  )
}
