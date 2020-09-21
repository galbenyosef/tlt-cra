import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './components/Main/Main';
import * as serviceWorker from './serviceWorker';
import {validateId} from "./dataHandler";
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
            <CityView/>
          </Route>
          <Route path="/קריות">
            <CityView/>
          </Route>
          <Route path="/טירת הכרמל">
            <CityView/>
          </Route>
          <Route path="/נשר">
            <CityView/>
          </Route>
          <Route path="/:id">
            <CityView/>
          </Route>
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
