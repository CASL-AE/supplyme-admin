/* eslint new-cap: 0 */

import React from 'react';
// using ES6 modules
import { Route, Switch, Redirect } from 'react-router-dom';

/* Public Containers */
import App from './containers/App';
import NotFoundView from './containers/Global/NotFoundView';
import LoginView from './containers/NotAuth/Register/LoginView';
import RegisterView from './containers/NotAuth/Register/RegisterView';
import ValorListView from './containers/NotAuth/Valor/ValorListView';
import ValorCreateView from './containers/NotAuth/Valor/ValorCreateView';
import PublicRequestMapView from './containers/Xupply/Request/PublicRequestMapView';

/* Determine Containers */
import VerifyEmailView from './containers/NotAuth/Register/VerifyEmailView';

/* Private Containers */
import DashboardView from './containers/Xupply/Dashboard/DashboardView';
import EmployeeListView from './containers/Xupply/Employee/EmployeeListView';
import EmployeeDetailView from './containers/Xupply/Employee/EmployeeDetailView';
import EmployeeCreateView from './containers/Xupply/Employee/EmployeeCreateView';
import EmployeeCodeListView from './containers/Xupply/Employee/EmployeeCodeListView';
import EmployeeCodeCreateView from './containers/Xupply/Employee/EmployeeCodeCreateView';
import LocationListView from './containers/Xupply/Location/LocationListView';
import LocationDetailView from './containers/Xupply/Location/LocationDetailView';
import LocationCreateView from './containers/Xupply/Location/LocationCreateView';
import RequestListView from './containers/Xupply/Request/RequestListView';
import PublicRequestListView from './containers/Xupply/Request/PublicRequestListView';

/* For Beta */
import RequestCreateBetaView from './containers/Xupply/Beta/RequestCreateBetaView';
import OrderCreateBetaView from './containers/Xupply/Beta/OrderCreateBetaView';
import MenuItemCreateBetaView from './containers/Xupply/Beta/MenuItemCreateBetaView';

import RequestCreateView from './containers/Xupply/Request/RequestCreateView';
import RequestDetailView from './containers/Xupply/Request/RequestDetailView';
import MenuItemListView from './containers/Xupply/MenuItem/MenuItemListView';
import MenuItemDetailView from './containers/Xupply/MenuItem/MenuItemDetailView';
import MenuItemCreateView from './containers/Xupply/MenuItem/MenuItemCreateView';
import OrderListView from './containers/Xupply/Order/OrderListView';
import OrderDetailView from './containers/Xupply/Order/OrderDetailView';


/* Public Components */
import { requireNoAuthentication } from './components/NotAuthenticatedComponent';
import { determineAuth } from './components/DetermineAuthComponent';
import { requireAuthentication } from './components/AuthenticatedComponent';

export default (
    <App>
        <Switch>
            // NOT Auth Views
            <Route exact path="/register" component={requireNoAuthentication(RegisterView)} />
            <Route exact path="/login" component={requireNoAuthentication(LoginView)} />

            // Determine Auth Views
            <Route exact path="/verify/email" component={requireNoAuthentication(VerifyEmailView)} />

            // Auth Views
            <Route exact path="/" component={requireAuthentication(DashboardView)} />
            <Route exact path="/accounts/:id/dashboard" component={requireAuthentication(DashboardView)} />
            <Route exact path="/accounts/:id/employees" component={requireAuthentication(EmployeeListView)} />
            <Route exact path="/accounts/:id/employees/codes" component={requireAuthentication(EmployeeCodeListView)} />
            <Route exact path="/accounts/:id/employees/:id" component={requireAuthentication(EmployeeDetailView)} />
            <Route exact path="/accounts/:id/employees/:id/edit" component={requireAuthentication(EmployeeCreateView)} />
            <Route exact path="/accounts/:id/employees/codes/create" component={requireAuthentication(EmployeeCodeCreateView)} />
            <Route exact path="/accounts/:id/locations" component={requireAuthentication(LocationListView)} />
            <Route exact path="/accounts/:id/locations/create" component={requireAuthentication(LocationCreateView)} />
            <Route exact path="/accounts/:id/locations/:id" component={requireAuthentication(LocationDetailView)} />
            <Route exact path="/accounts/:id/locations/:id/edit" component={requireAuthentication(LocationCreateView)} />
            <Route exact path="/accounts/:id/requests" component={requireAuthentication(RequestListView)} />
            <Route exact path="/accounts/:id/requests/search" component={requireAuthentication(PublicRequestListView)} />
            <Route exact path="/accounts/:id/requests/create" component={requireAuthentication(RequestCreateView)} />
            <Route exact path="/accounts/:id/requests/create/beta" component={requireAuthentication(RequestCreateBetaView)} />
            <Route exact path="/accounts/:id/requests/:id" component={requireAuthentication(RequestDetailView)} />
            <Route exact path="/accounts/:id/menuItems" component={requireAuthentication(MenuItemListView)} />
            <Route exact path="/accounts/:id/menuItems/create" component={requireAuthentication(MenuItemCreateView)} />
            <Route exact path="/accounts/:id/menuItems/create/beta" component={requireAuthentication(MenuItemCreateBetaView)} />
            <Route exact path="/accounts/:id/menuItems/:id" component={requireAuthentication(MenuItemDetailView)} />
            <Route exact path="/accounts/:id/menuItems/:id/edit" component={requireAuthentication(MenuItemCreateView)} />
            <Route exact path="/accounts/:id/orders" component={requireAuthentication(OrderListView)} />
            <Route exact path="/accounts/:id/orders/create/requests/:id" component={requireAuthentication(OrderCreateBetaView)} />
            <Route exact path="/accounts/:id/orders/:id" component={requireAuthentication(OrderDetailView)} />

            <Route exact path="/map" component={requireNoAuthentication(PublicRequestMapView)} />
            <Route exact path="/valor" component={requireNoAuthentication(ValorListView)} />
            <Route exact path="/valor/create" component={requireNoAuthentication(ValorCreateView)} />
            <Route component={NotFoundView} />
        </Switch>
    </App>
);
