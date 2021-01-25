import React from 'react'
import { ReactComponent as IconCross} from '../assets/icons/cross.svg'
import { ReactComponent as IconSquare} from '../assets/icons/square.svg'
import { ReactComponent as IconMinus} from '../assets/icons/minus.svg'
import { ReactComponent as IconSave} from '../assets/icons/save.svg'
import { ReactComponent as IconFile} from '../assets/icons/open-file.svg'
import { ReactComponent as IconCapture} from '../assets/icons/focus.svg'
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


    function read_Element(ParentNode, OrigData){

        var ContainerElements = ["svg","g"];
        var RelevantStyles = {"svg":["hieght","width","margin-left"],"rect":["fill","stroke","stroke-width"],"path":["fill","stroke","stroke-width"],"circle":["fill","stroke","stroke-width"],"line":["stroke","stroke-width"],"text":["fill","font-size","text-anchor"],"polygon":["stroke","fill"]};

        var Children = ParentNode.childNodes;
        var OrigChildDat = OrigData.childNodes;     
    
        for (var cd = 0; cd < Children.length; cd++){
            var Child = Children[cd];
    
            var TagName = Child.tagName;
            if (ContainerElements.indexOf(TagName) != -1){
                read_Element(Child, OrigChildDat[cd])
            } else if (TagName in RelevantStyles){
                var StyleDef = window.getComputedStyle(OrigChildDat[cd]);
    
                var StyleString = "";
                for (var st = 0; st < RelevantStyles[TagName].length; st++){
                    StyleString += RelevantStyles[TagName][st] + ":" + StyleDef.getPropertyValue(RelevantStyles[TagName][st]) + "; ";
                }
    
                Child.setAttribute("style",StyleString);
            }
        }
    
    }

    const test = () => {
        const graph = document.getElementById("graph-svg-wrapper")
        var oDOM = graph.cloneNode(true)


        function copyNodeStyle(sourceNode, targetNode) {
            const computedStyle = window.getComputedStyle(sourceNode);
            Array.from(computedStyle).forEach(key => targetNode.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)))

        }
        if (oDOM.childNodes.length) {
            oDOM.childNodes.forEach(child => {
                console.log(child)
            })
        }
        copyNodeStyle(graph,oDOM)
        console.log(oDOM.childNodes)

    }
    

    const saveGraph = () => {
        const graph = document.getElementById("graph-svg-wrapper")
        if (graph && graph.outerHTML) {
            //let data = graph.outerHTML
            //get svg source.
            var oDOM = graph.cloneNode(true)


            function copyNodeStyle(sourceNode, targetNode) {
                const computedStyle = window.getComputedStyle(sourceNode);
                Array.from(computedStyle).forEach(key => targetNode.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)))
            }
            
            copyNodeStyle(graph,oDOM)
    
            
            var serializer = new XMLSerializer();
            var source = serializer.serializeToString(oDOM);

            //add name spaces.
            if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
                source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            //add xml declaration
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;



            const dialog = window.require("electron").remote.dialog
            dialog.showSaveDialog({ 
                title: 'Select the File Path to save', 
                buttonLabel: 'Save', 
                filters: [{name: 'Scalable Vector Graphics', extensions: ['svg']},], 
                properties: [] 
            }).then((response) => {
                if (!response.canceled) {      
                    const fs = window.require('fs');
                    fs.writeFileSync(response.filePath.toString(), source, (err,data) => {
                        console.log(data)
                        if (err){
                            console.error("error: " + err);
                        }
                    })    
                } else {
                }
            })
            
    
        }
    }


    return (
        <div className='title-bar'>
            <div className='title-bar__menu'>       
                <button onClick={saveSystemState}>Save</button>         
                <button onClick={loadSystemState}>Open</button>
                <button onClick={saveGraph}>Capture</button>
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

/*
  <div className='title-bar__drop'>
                    <button className="title-bar__drop--active" id='dropdown-parent-file' onClick={() => showDropDown('dropdown-file', 'dropdown-parent-file')}>File</button>
                    <div id='dropdown-file' className='title-bar__drop__children title-bar__drop__children--hide'>
                        <button onClick={() => {loadSystemState() ; showDropDown('dropdown-file', 'dropdown-parent-file')}}><IconFile/>Open</button>
                        <button onClick={() => {saveSystemState() ; showDropDown('dropdown-file', 'dropdown-parent-file')}}><IconSave/>Save</button>
                    </div>
                </div>
                */