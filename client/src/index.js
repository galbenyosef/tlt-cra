import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './components/Main/Main';
import * as serviceWorker from './serviceWorker';
import {useRoutes} from 'hookrouter';
import {validateId} from "./dataHandler";

const NotFound = () => (
  <div>
    <h1>404 - Not Found!</h1>
    <a href="/">
      Go Home
    </a>
  </div>
);

const routes = {
  '/': () => <Main />,
  '/:id': ({id}) => (validateId((id)) ? <Main id={id}/> : <NotFound/>)
};

const Root = () => {
  const routeResult = useRoutes(routes);

  return routeResult || <NotFound />;
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
