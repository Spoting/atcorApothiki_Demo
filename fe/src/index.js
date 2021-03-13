import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import Items from './views/items';
import Tasks from './views/tasks';
import Invoices from './views/invoice';
import TaskMvts from './views/taskMvts';
import TaskCheckout from './views/taskCheckout';
import * as serviceWorker from './serviceWorker';

/** react-router-dom */
//1.Without <exact> both App and CompX will be rendered cause both paths contains '/'
//2.
const routing = (
    <Router>
        <div>
            
            <Route path='/' component={App} />
            <Route path='/items' component={Items} />
            <Route path='/tasks' component={Tasks} />
            <Route path='/invoices' component={Invoices} />
            <Route path='/taskMvt/:id' component={TaskMvts} />
            <Route path='/taskCheckout/:id' component={TaskCheckout} />
            <Route path='/' component={App} />
        </div>
    </Router>
)
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
