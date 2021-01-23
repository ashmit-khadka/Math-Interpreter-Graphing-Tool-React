import React from 'react'
import { ReactComponent as IconCross} from '../assets/icons/cross.svg'
import { ReactComponent as IconSquare} from '../assets/icons/square.svg'
import { ReactComponent as IconMinus} from '../assets/icons/minus.svg'
import { ReactComponent as IconSave} from '../assets/icons/save.svg'
import { ReactComponent as IconFile} from '../assets/icons/file.svg'
import { useSelector, useDispatch } from 'react-redux';
import { SystemFileWritter, SystemFileReader } from '../scripts/fileReader'
import { loadEntities } from '../redux/actions/EntityActions'


const TitleBar = () => {

    const entities = useSelector(state => state.EntityReducer)
    const dispatch = useDispatch()

    const getWindow = () => {
        const remote = (window.require) ? window.require("electron").remote : null;
        return remote.getCurrentWindow();
    }

    const formControlClose = () => {    
        getWindow().close();
    }

    const formControlMinimise = () => {
        getWindow().minimize();
    }

    const formControlMaximise = () => {
        getWindow().maximize();
    }

    const saveSystemState = () => {
        SystemFileWritter(JSON.stringify(entities))
    }

    const loadSystemState = () => {
        SystemFileReader().then(response => {
            dispatch(loadEntities(response))
        })
    }

    const showDropDown = (id, parentId) => {
        const item = document.getElementById(id)
        const parent = document.getElementById(parentId)
        
        if (item.classList.contains('title-bar__drop__children--hide')) {
            item.classList.remove('title-bar__drop__children--hide')
            parent.classList.add('title-bar__drop--active')
        }
        else {
            item.classList.add('title-bar__drop__children--hide')
            parent.classList.remove('title-bar__drop--active')

        }
    }

    const saveGraph = () => {
        const graph = document.getElementById("graph-svg")
        if (graph && graph.outerHTML) {
            //let data = graph.outerHTML
            //get svg source.
            var serializer = new XMLSerializer();
            var source = serializer.serializeToString(graph);

            //add name spaces.
            if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
                source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            //add xml declaration
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

            console.log(source)
        }
    }


    return (
        <div className='title-bar'>
            <div className='title-bar__menu'>
                <div className='title-bar__drop'>
                    <button className="title-bar__drop--active" id='dropdown-parent-file' onClick={() => showDropDown('dropdown-file', 'dropdown-parent-file')}>File</button>
                    <div id='dropdown-file' className='title-bar__drop__children title-bar__drop__children--hide'>
                        <button onClick={() => {loadSystemState() ; showDropDown('dropdown-file', 'dropdown-parent-file')}}><IconFile/>Open</button>
                        <button onClick={() => {saveSystemState() ; showDropDown('dropdown-file', 'dropdown-parent-file')}}><IconSave/>Save</button>
                    </div>
                </div>  
                <button className="title-bar__drop--active" onClick={saveGraph}>Save</button>
              
            </div>
            <div className='title-bar__action'>
                <div className='title-bar__controll' onClick={formControlMinimise}>
                    <IconMinus className='title-bar__icon-controll'/>
                </div>
                <div className='title-bar__controll' onClick={formControlMaximise}>
                    <IconSquare className='title-bar__icon-controll'/>
                </div>
                <div className='title-bar__controll title-bar__controll--close' onClick={formControlClose}>
                    <IconCross className='title-bar__icon-controll'/>
                </div>
            </div>
        </div>
    )
}

export default TitleBar