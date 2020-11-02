import React from 'react'
import { NavLink } from 'react-router-dom'
import { Fraction, toTex} from 'algebra'
import { Node, Context } from 'react-mathjax'
import { ReactComponent as IconHome} from '../assets/icons/home.svg'
import { ReactComponent as IconPlus} from '../assets/icons/plus.svg'
import { ReactComponent as IconChart} from '../assets/icons/line-chart.svg'

const SideMenu = () => {


    function Formula(props) {
        return (
          <Context input="tex">
            <Node inline>{props.tex}</Node>
          </Context>
        );
      }
      

    return (
        <ul className='side-menu'>
            <NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/" exact="true" ><li><IconHome/></li></NavLink>
            <NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/graph" exact="true"><li><IconChart/></li></NavLink>
        </ul>
    )
}

export default SideMenu