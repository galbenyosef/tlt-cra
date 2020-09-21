import {useEffect} from 'react'
import {resize, setHeaderHeight} from "../dataHandler";
import {useLocation} from "react-router-dom";


export default () => {

  const handleScroll = (e) => setHeaderHeight(118 - (e.currentTarget.scrollY > 36 ? 36 : e.currentTarget.scrollY))
  useEffect(() => {
    window.addEventListener("resize",resize);
    window.addEventListener('scroll',handleScroll)

 /*   if (id)
      showSingleProperty(id)*/

    resize()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
    }
  },[])

  let location = useLocation()
  let pathname = location.pathname

  useEffect(() => {
    window.scrollTo(0, 0)
  },[pathname])


  return null

}