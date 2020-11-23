import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'


import Home from '../components/Home'
import CalculatorScreen from '../components/CalculatorScreen'
import TitleBar from '../components/TitleBar'
import SideMenu from '../components/SideMenu'
import GraphScreen from '../components/screens/GraphScreen'
import RegressionScreen from '../components/screens/RegressionScreen'
import TestScreen from '../components/screens/TestScreen'
import Graph from '../components/Graph'
import GraphB from '../components/GraphB'

const AppRouter = () => {

    return (
        <BrowserRouter>
            <TitleBar/>
            <SideMenu/>
            <div className='content'>
                <Switch>
                    <Route path='/' component={Home} exact={true}/>
                    <Route path='/calculator' component={CalculatorScreen} exact={true}/>
                    <Route path='/graph' component={GraphScreen} exact={true}/>
                    <Route path='/regression' component={RegressionScreen} exact={true}/>
                    <Route path='/test' component={TestScreen} exact={true}/>
                </Switch>
            </div>

        </BrowserRouter>
    )
}

export default AppRouter