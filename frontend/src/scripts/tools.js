import { useSelector, useDispatch } from 'react-redux';
import { setNotification } from '../redux/actions/NotificationActions'


export const randomRGBA = () => {
    return {
        r: Math.floor(Math.random() * 150) + 50,
        g: Math.floor(Math.random() * 150) + 50,
        b: Math.floor(Math.random() * 150) + 50, 
        a: 1 
    }
}


export const copyToClipboard = (e) => {
    console.log(e.target.innerText)
    
    e.select();
    document.execCommand("copy");
}

export const round = (dp, number) => {
    if (number)
        return +Number.parseFloat(number).toFixed(dp);
    return '-'
}

export const getActiveEnitiyIndex = (reducer) => {
    let activeEnitiyIndex = reducer.findIndex(item => {
        return item.active === true
    })
    if (activeEnitiyIndex < 0) { activeEnitiyIndex = 0 }
    return activeEnitiyIndex;
}

export const templateLineEntity = () => {
    return {
        'id': null,
        'type':'polynomial',
        'title': null,
        'colour': randomRGBA(),
        'data': [],
        'analysis': {
            'parsed': false,
            'expression': null,
            'function':null,
            'variables':null
        },
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },        
        'active':true,
        'visible':true,
        'analysed':false
    }
}

export default randomRGBA