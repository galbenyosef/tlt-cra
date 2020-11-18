import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './components/Main/Main';
import * as serviceWorker from './serviceWorker';
import {initProperty, validateId} from "./dataHandler";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Layout from "./components/Layout";
import Footer from "./components/Footer";
import Modals from "./components/Modals";
import CityView from "./components/CityView";
import ScrollResizeHandler from "./components/ScrollResizeHandler";
import ChatBot from "./components/ChatBot";
import SideMenu from "./components/SideMenu";
import whyDidYouRender from '@welldone-software/why-did-you-render'
/*whyDidYouRender(React, {
  trackAllPureComponents: true,
});*/

const NotFound = () => {
  console.log(useLocation())
  return(
    <div style={{width:'100%',display:'flex',flexGrow:1,flexDirection:'column',justifyContent:'space-evenly',position:'relative'}}>
      <h1 style={{margin:'auto'}}>404 - העמוד לא קיים !</h1>
    </div>
  )};


const Root = () => {

  return (
    <Layout>
      <Router>
        <ScrollResizeHandler/>
        <ChatBot/>
        <SideMenu/>
        <Header/>
        <Modals/>
        <Switch>
          <Route path="/חיפה">
            <CityView city={"חיפה"}/>
          </Route>
          <Route path="/קריות">
            <CityView city={"קריות"}/>
          </Route>
          <Route path="/טירת הכרמל">
            <CityView city={"טירת הכרמל"}/>
          </Route>
          <Route path="/נשר">
            <CityView city={"נשר"}/>
          </Route>
          <Route path="/:id" render={({match:{params:{id}}}) => <CityView id={id}/>}/>
          <Route path="/">
            <Main/>
          </Route>
        </Switch>
        <Footer/>
      </Router>
    </Layout>
  );
}


ReactDOM.render(
  <Root />
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
