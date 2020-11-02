import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'


import Home from '../components/Home'
import TitleBar from '../components/TitleBar'
import SideMenu from '../components/SideMenu'
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
                    <Route path='/graph' component={Graph} exact={true}/>
                </Switch>
            </div>

        </BrowserRouter>
    )
}

export default AppRouter