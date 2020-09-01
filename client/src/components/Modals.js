import React, {Suspense} from "react";
import {devices} from "./Utilities";
import {ListDisplays, useGlobalState} from "../globalState";
import {PropertyModal} from "./Modals/PropertyModal";
import {LeadModal} from "./Modals/LeadModal";
import {FiltersBarContent} from "./FiltersBarContent";

const ActionFeedbackModal = React.lazy(() => import('./Modals/ActionFeedbackModal'));
const MediaModal = React.lazy(() => import('./Modals/MediaModal'));
const MapModal = React.lazy(() => import('./Modals/MapModal'));
const FiltersModal = React.lazy(() => import('./Modals/FiltersModal'));
const NewPropertyModal = React.lazy(() => import('./Modals/NewPropertyModal'));

export default () => {

  const [device] = useGlobalState('device')
  const [listDisplay] = useGlobalState('listDisplay')

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
        (device >= devices.Tablet && listDisplay == ListDisplays.List) ?
          null:
          (device > devices.Mobile && listDisplay == ListDisplays.Grid) ?
            <PropertyModal/>
            :
            <NewPropertyModal/>
      }
    </Suspense>
  )
}