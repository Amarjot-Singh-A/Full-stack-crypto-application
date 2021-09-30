import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DashboardContent from "./components/DashboardContent/DashboardContent";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <SignIn />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/dashboard">
            <DashboardContent />
          </Route>
          <SignIn />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
