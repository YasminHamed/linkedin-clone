import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
// components
import Homme from './components/Homme';
import Login from './components/Login';
import { useEffect } from 'react';
import { getUserAuth } from './actions'
import { connect } from 'react-redux';

function App(props) {

  useEffect(() =>{
    props.getUserAuth();
  }, [])

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/home" component={Homme} />
      </Switch>
    </Router>
  );
}

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);