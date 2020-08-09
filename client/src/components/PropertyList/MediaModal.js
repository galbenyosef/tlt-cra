import ImageGallery from "react-image-gallery";
import React, {useRef} from "react";
import {Modal} from "@material-ui/core";
import {MediaModalTypes, useGlobalState} from "../../globalState";
import {devices} from "../Utilities";



export const MediaModal = () => {

  const [mediaModal,setMediaModal] = useGlobalState('media')
  const setMediaModalType = type => setMediaModal(data => ({...data,type}))
  const handleClick = () => {
    if (mediaModal.type == MediaModalTypes.Images)
      setMediaModalType(MediaModalTypes.Videos)
    else
      setMediaModalType(MediaModalTypes.Images)
  }
  let isVideos = mediaModal.type == MediaModalTypes.Videos

  const _renderCustomControls = () => {
    if (mediaModal.videos.length)
      return <a style={{backgroundColor:'white',position:'absolute',left:0,padding:20,zIndex:5}} onClick={handleClick}>{isVideos? 'תמונות':'וידאו'}</a>
  }

  const [device] = useGlobalState('device')
  let items = []

  if (mediaModal.type == MediaModalTypes.Images)
    items = mediaModal.images
  else if (mediaModal.type == MediaModalTypes.Videos)
    items = mediaModal.videos


  console.log(items)
  return(
      <Modal open={!!mediaModal.type} style={{direction:'rtl',maxHeight:'calc(100vh)'}} onBackdropClick={() => setMediaModal({type:0,images:[],videos:[]})}>
        <div style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'absolute'}}>
          <div style={{display:'flex',justifyContent:'center',width:'100vw',maxWidth:660}}>
            <ImageGallery renderCustomControls={_renderCustomControls}
                          indexSeparator={' מתוך '}
                          thumbnailPosition={isVideos? 'bottom' : device === devices.Desktop ? 'right' : 'bottom'}
                          showPlayButton={false}
                          showThumbnails={isVideos ? false :true}
                          showIndex={isVideos ? false : true}
                          showBullets={isVideos?false:true}
                          isRTL
                          showFullscreenButton={isVideos ? false :true}
                          items={items} />
          </div>
        </div>

      </Modal>
    )

}