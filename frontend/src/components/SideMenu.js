import React from 'react'
import { NavLink } from 'react-router-dom'
import { Node, Context } from 'react-mathjax'
import { ReactComponent as IconHome} from '../assets/icons/home.svg'
import { ReactComponent as IconTest} from '../assets/icons/test.svg'
import { ReactComponent as IconCalculator} from '../assets/icons/calculator.svg'
import { ReactComponent as IconRegression} from '../assets/icons/regression.svg'
import { ReactComponent as IconGaussian} from '../assets/icons/gaussian-function.svg'
import { ReactComponent as IconChart} from '../assets/icons/line-chart.svg'

import { useSelector } from 'react-redux';

const SideMenu = () => {

    const LineItems = useSelector(state => state.LineItemReducer) 

    function Formula(props) {
        return (
          <Context input="tex">
            <Node inline>{props.tex}</Node>
          </Context>
        );
      }
      
    let LineItemsCount = LineItems.length ? <div>{LineItems.length}</div> : ''
    return (
        <ul className='side-menu'>
            <NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/" exact={true} ><li><IconHome/></li></NavLink>
            <NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/calculator" exact={true} ><li><IconCalculator/></li></NavLink>
            <NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/graph" exact={true}><li><IconChart/></li>{LineItemsCount}</NavLink>
            <NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/regression" exact={true}><li><IconRegression/></li></NavLink>
            <NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/distrabution" exact={true}><li><IconGaussian/></li></NavLink>
            <NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/test" exact={true}><li><IconTest/></li></NavLink>
        </ul>
    )
}

export default SideMenu