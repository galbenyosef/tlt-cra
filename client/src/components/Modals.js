import React from "react";
import {devices, ListDisplays} from "./Utilities";
import { useGlobalState} from "../globalState";
import {PropertyModal} from "./Modals/PropertyModal";
import {LeadModal} from "./Modals/LeadModal";
import {FiltersBarContent} from "./FiltersBarContent";

import ActionFeedbackModal from './Modals/ActionFeedbackModal';
import MediaModal from './Modals/MediaModal';
import MapModal from './Modals/MapModal';
import FiltersModal from './Modals/FiltersModal';
import NewPropertyModal from './Modals/NewPropertyModal';

export default () => {

  const [device] = useGlobalState('device')
  const [listDisplay] = useGlobalState('listDisplay')

  return (
    <>
      <ActionFeedbackModal/>
      <FiltersBarContent/>
      <MediaModal/>
      <MapModal/>
      <LeadModal/>
      {
        device !== devices.Desktop &&
        <FiltersModal/>
      }
      {
        (device >= devices.Tablet && listDisplay === ListDisplays.List) ?
          null:
          (device > devices.Mobile && listDisplay === ListDisplays.Grid) ?
            <PropertyModal/>
            :
            <NewPropertyModal/>
      }
    </>
  )
}