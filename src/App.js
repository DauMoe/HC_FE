import { BrowserRouter as Router, Switch, Route, Link, NavLink, Redirect } from "react-router-dom";
import Header from "./components/header";
import Login from "./components/login";
import NotFound from "./components/NotFound";
import ShowEx from "./components/Excercises/showEx";


function App() {
    return(
        <Router>
            <Switch>
                <Route exact path="/">
                    {(localStorage.getItem("token") ? <Redirect to="/exercise"/> : <Login/>)}
                </Route>
                <Route exact path="/exercise" component={ShowEx}/>
                <Route component={NotFound}/>
            </Switch>
        </Router>
    );
}

export default App;