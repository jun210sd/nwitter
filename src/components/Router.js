import React, {useState} from "react";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";
import { Redirect } from "react-router-dom";

const AppRouter = ({isLoggedIn, userObj}) => {
    
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Switch>
                {isLoggedIn ? (
                <>
                <Route exact path = "/">
                    <Home userObj={userObj}/>
                </Route>
                
                <Route exact path = "/profile">                    
                    <Profile userObj={userObj}/>                    
                </Route>                
                </>
                 ) :(
                <>
                <Route exact path = "/">
                    <Auth />
                </Route>                    
                </>
                )}
            </Switch>
        </Router>
    );
};

export default AppRouter;