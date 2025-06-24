import './styles/App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DashboardContent from './features/dashboard/DashboardContent/DashboardContent';
import SignIn from './features/auth/SignIn/SignIn';
import SignUp from './features/auth/SignUp/SignUp';
import Lost from './features/Lost/Lost';

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
          <Route exact path="/dashboard">
            <DashboardContent />
          </Route>
          <Route path="*">
            <Lost />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
