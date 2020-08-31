
import React from "react";
import {useGlobalState} from "../globalState";
import DropdownTreeSelect from 'react-dropdown-tree-select'
import './dropdownTree.css'
import {changeFilters} from "../dataHandler";

function searchPredicate(node, searchTerm) {

  if (Number.isInteger(parseInt(searchTerm))){
    console.log(searchTerm)
    let node_id = node.id.toString()
    return node_id.indexOf(searchTerm) >= 0
  }
  if (Number.isInteger(parseInt(node.id)))
    return false
  return node.id.indexOf(searchTerm) >= 0
}

export const Dev = React.memo(() => {

  const [addressTree] = useGlobalState('addressTree')
  const [addressMap] = useGlobalState('addressMap')


  function getLeafNodes(nodes){

      let node_children = []

      for (let node of nodes) {
        //is Area
        if (!node.parent_id) {
          let area = node.id
          let itsNeighborhoods = Object.keys(addressMap[area])
          for (let neighborhood of itsNeighborhoods) {
            let streets = Object.keys(addressMap[area][neighborhood])
            for (let street of streets) {
              node_children = node_children.concat(addressMap[area][neighborhood][street])
            }
          }
        }
        //is Custom_id
        else if (Number.isInteger(node.id)) {
          node_children.push(node.id)
        }
        //is street
        else if(node.neighborhood_name){
          let street = node.id
          let neighborhood = node.neighborhood_name
          let area = node.area
          node_children = node_children.concat(addressMap[area][neighborhood][street])
          continue
        }
        //is neighborhood
        else {
          let neighborhood = node.id
          let area = node.area
          let streets = Object.keys(addressMap[area][neighborhood])
          for (let street of streets) {
            node_children = node_children.concat(addressMap[area][neighborhood][street])
          }
        }
      }


    console.log(node_children)

    return node_children;
  }

  return (
    <div style={{height:23}}>
    <DropdownTreeSelect
      keepTreeOnSearch
      showPartiallySelected
      clearSearchOnChange
      keepOpenOnSelect
      data={addressTree}
      searchPredicate={searchPredicate}
      onChange={(a,b) => {
        changeFilters({propertyNumber:getLeafNodes(b),addresses:[],addressesActive:0,address:''})
      }}
      texts={{
        placeholder:'הקש אזור/שכונה/רחוב/מספר נכס',
        noMatches:'לא נמצאו תוצאות'
      }}
      className="mdl-demo" />
    </div>
  )



},() => true)