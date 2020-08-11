import React from 'react'
import {Modal} from "@material-ui/core";
import {useGlobalState} from "../globalState";


export const FiltersModal = () => {

  const [filters, setFilters] = useGlobalState('filters');
  const {modalOpened} = filters
  const setModalOpened = val => setFilters({...filters,modalOpened: val})

  return (
    <Modal
      hideBackdrop
      BackdropProps={{style:{top:150}}}
      open={modalOpened} style={{direction:'rtl',maxHeight:'calc(100vh - 150px)',backgroundColor:'white',top:150}} onBackdropClick={() => setModalOpened(false)}>
      <div>
        <span>Hello Im Filters Modal</span>
      </div>
    </Modal>
  )
}