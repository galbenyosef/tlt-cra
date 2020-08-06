import ImageGallery from "react-image-gallery";
import React, {useRef} from "react";
import {Modal} from "@material-ui/core";
import {MediaModalTypes, useGlobalState} from "../../globalState";

export const MediaModal = () => {

  const [mediaModal,setMediaModal] = useGlobalState('media')

  let items = []

  if (mediaModal.type == MediaModalTypes.Images)
    items = mediaModal.images
  else if (mediaModal.type == MediaModalTypes.Videos)
    items = mediaModal.videos

  console.log(items)
  return(
      <Modal open={!!mediaModal.type} style={{direction:'rtl',maxHeight:'calc(100vh)'}} onBackdropClick={() => setMediaModal({type:0,images:[],videos:[]})}>
        <div style={{
          right: '50%',
          maxWidth:'900px',
          overflow:'auto',
          top: '50%',
          backgroundColor:'white',
          transform: 'translate(50%, -50%)',
          position: 'absolute'}}>
          <ImageGallery style={{width:300}} showThumbnails={true} showIndex showBullets isRTL items={items} />
        </div>

      </Modal>
    )

}