
import React from "react";
import {useGlobalState} from "../globalState";
import DropdownTreeSelect from 'react-dropdown-tree-select'
import './dropdownTree.css'
import {changeFilters} from "../dataHandler";


let TheTree = React.memo(() => {
  const [addressTree] = useGlobalState('addressTree')
  const [addressMap] = useGlobalState('addressMap')

/*
  const onFocus = () => {

        setTimeout(() => {
          let dropdownContent = document.getElementsByClassName('dropdown-content').item(0)
          if (dropdownContent) {
            setDropdownHeight(dropdownContent.offsetHeight)
          }
        },0)
  }
*/

/*  const onBlur = () => {

    setDropdownHeight(0)
  }*/
  const searchPredicate = (node, searchTerm) => {

    //number search
    if (parseInt(searchTerm)){
      let node_id = node.id.toString()
      return node_id.indexOf(searchTerm) >= 0
    }

    return node.id.toString().indexOf(searchTerm) >= 0
  }

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

    return node_children;
  }

  return (
    <DropdownTreeSelect
      keepTreeOnSearch
      showPartiallySelected
      keepOpenOnSelect
      data={addressTree}
      searchPredicate={searchPredicate}
      onChange={(a,b) => {
        changeFilters({propertyIds:getLeafNodes(b),addresses:[],addressesActive:0,address:''})
      }}
      texts={{
        placeholder:'חיפוש חופשי',
        noMatches:'לא נמצאו תוצאות'
      }}
      className="mdl-demo" />
  )
},() => true)

export default () => {

  return (
    <TheTree/>
  )

}