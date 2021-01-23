import React from 'react'
import { NavLink } from 'react-router-dom'
//import { Node, Context } from 'react-mathjax'
import { ReactComponent as IconHome} from '../assets/icons/home.svg'
import { ReactComponent as IconCalculator} from '../assets/icons/calculator.svg'
import { ReactComponent as IconRegression} from '../assets/icons/regression.svg'
import { ReactComponent as IconGaussian} from '../assets/icons/gaussian-function.svg'
import { ReactComponent as IconChart} from '../assets/icons/line-chart.svg'
import { ReactComponent as IconSettings} from '../assets/icons/settings.svg'

import { useSelector } from 'react-redux';

const SideMenu = () => {

	
	const entities = useSelector(state => state.EntityReducer)
	const lineEntities = entities.filter(entity => entity.type === 'polynomial').length
	const regressionEntities = entities.filter(entity => entity.type === 'regression').length
	const distributionEntities = entities.filter(entity => entity.type === 'distribution').length
	
	return (
		<ul className='side-menu'>
			<NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/" exact={true} ><li><IconHome/></li></NavLink>
			<NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/calculator" exact={true} ><li><IconCalculator/></li></NavLink>
			<NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/line" exact={true}><li><IconChart/><div>{lineEntities}</div></li></NavLink>
			<NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/regression" exact={true}><li><IconRegression/><div>{regressionEntities}</div></li></NavLink>
			<NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/distrabution" exact={true}><li><IconGaussian/><div>{distributionEntities}</div></li></NavLink>
			<NavLink className="side-menu__icon" activeClassName="side-menu__icon--active" to="/setting" exact={true}><li><IconSettings/></li></NavLink>
		</ul>
	)
}

export default SideMenu