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
            <Notification/>
            <div className="app__title-bar">
                <TitleBar/>
            </div>
            <div className='app__content'>  
                <div className="app__side-menu">
                    <SideMenu/> 
                </div>
                <div className="app__screen">
                    <Switch>
                        <Route path='/' component={InterpreterScreen} exact={true}/>
                        <Route path='/line' component={PolynomialScreen} exact={true}/>
                        <Route path='/regression' component={RegressionScreen} exact={true}/>
                        <Route path='/distrabution' component={DistrabutionScreen} exact={true}/>
                        <Route path='/setting' component={SettingScreen} exact={true}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default AppRouter