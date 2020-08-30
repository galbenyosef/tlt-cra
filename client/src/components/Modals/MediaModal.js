import ImageGallery from "react-image-gallery";
import React from "react";
import {Modal} from "@material-ui/core";
import {MediaModalTypes, useGlobalState} from "../../globalState";
import {devices} from "../Utilities";
import "../image-gallery.css";



export default () => {

  const [mediaModal,setMediaModal] = useGlobalState('media')
  const setMediaModalType = type => setMediaModal(data => ({...data,type}))
  const [device] = useGlobalState('device')
  const {opened,images,videos} = mediaModal

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

  let items = []

  if (mediaModal.type === MediaModalTypes.Images)
    items = images
  else if (mediaModal.type === MediaModalTypes.Videos)
    items = videos

  if (!opened)
    return null

  console.log('render Media modal')
  return(
      <Modal open={opened} style={{direction:'rtl',maxHeight:'calc(100vh)'}} onBackdropClick={() => setMediaModal({type:0,images:[],videos:[],opened:false})}>
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
                          showThumbnails={!isVideos}
                          showIndex={!isVideos}
                          showBullets={!isVideos}
                          isRTL
                          showFullscreenButton={!isVideos}
                          items={items} />
          </div>
        </div>

      </Modal>
    )

}