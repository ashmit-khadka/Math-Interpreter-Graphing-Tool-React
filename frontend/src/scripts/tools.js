import { useDispatch } from 'react-redux';
import { setNotification } from '../redux/actions/NotificationActions'


export const randomRGBA = () => {
    return {
        r: Math.floor(Math.random() * 255) + 50,
        g: Math.floor(Math.random() * 255) + 50,
        b: Math.floor(Math.random() * 255) + 50, 
        a: 1 
    }
}


export const copyToClipboard = (e) => {
    console.log(e.target.innerText)
    
    e.select();
    document.execCommand("copy");
}

export const round = (number) => {
    if (number)
        return Number.parseFloat(number).toPrecision(4);
    return '-'
}

export default randomRGBA