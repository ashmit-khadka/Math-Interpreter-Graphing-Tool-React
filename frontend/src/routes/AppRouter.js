import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'


import Home from '../components/Home'
import CalculatorScreen from '../components/CalculatorScreen'
import TitleBar from '../components/TitleBar'
import SideMenu from '../components/SideMenu'
import GraphScreen from '../components/screens/GraphScreen'
import RegressionScreen from '../components/screens/RegressionScreen'
import DistrabutionScreen from '../components/screens/DistrabutionScreen'
import TestScreen from '../components/screens/TestScreen'
import PolynomialScreen from '../components/screens/PolynomialScreen'
import SettingScreen from '../components/screens/SettingScreen'
import InterpreterScreen from '../components/screens/InterpreterScreen'
import Graph from '../components/Graph'
import GraphB from '../components/GraphB'
import Notification from '../components/Notification'

const AppRouter = () => {

    return (
        <BrowserRouter>
            <TitleBar/>
            <SideMenu/>
            <Notification/>
            <div className='content'>
                <Switch>
                    <Route path='/' component={CalculatorScreen} exact={true}/>
                    <Route path='/calculator' component={InterpreterScreen} exact={true}/>
                    <Route path='/graph' component={PolynomialScreen} exact={true}/>
                    <Route path='/regression' component={RegressionScreen} exact={true}/>
                    <Route path='/distrabution' component={DistrabutionScreen} exact={true}/>
                    <Route path='/test' component={GraphScreen} exact={true}/>
                    <Route path='/setting' component={SettingScreen} exact={true}/>
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default AppRouter