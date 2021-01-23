import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import CalculatorScreen from '../components/CalculatorScreen'
import TitleBar from '../components/TitleBar'
import SideMenu from '../components/SideMenu'
import RegressionScreen from '../components/screens/RegressionScreen'
import DistrabutionScreen from '../components/screens/DistrabutionScreen'
import PolynomialScreen from '../components/screens/PolynomialScreen'
import SettingScreen from '../components/screens/SettingScreen'
import InterpreterScreen from '../components/screens/InterpreterScreen'
import Notification from '../components/Notification'



const AppRouter = () => {

    //const app = window.require('electron').remote.app

    return (
        <BrowserRouter>
            <TitleBar/>
            <Notification/>
            <SideMenu/>
            <div className='content'>
                <Switch>
                    <Route path='/' component={CalculatorScreen} exact={true}/>
                    <Route path='/calculator' component={InterpreterScreen} exact={true}/>
                    <Route path='/line' component={PolynomialScreen} exact={true}/>
                    <Route path='/regression' component={RegressionScreen} exact={true}/>
                    <Route path='/distrabution' component={DistrabutionScreen} exact={true}/>
                    <Route path='/setting' component={SettingScreen} exact={true}/>
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default AppRouter