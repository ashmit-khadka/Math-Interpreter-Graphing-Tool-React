'use strict'

import React, { useState, useEffect, useRef } from 'react';
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

const SketchExample = (props) => {


  const [displaycolourPicker, setDisplaycolourPicker] = useState(false)
  const [colour, setColour] = useState(props.colour)
  
  const handleClick = () => {
    setDisplaycolourPicker(!displaycolourPicker)
  };

  const handleClose = () => {
    setDisplaycolourPicker(false)
  };

  const handleChange = (colour) => {
    props.onUpdate(colour.rgb)
    setColour(colour.rgb)
  };


    const styles = reactCSS({
      'default': {
        colour: {
          width: '30px',
          height: '37px',
          borderRadius: '2px',
          background: `rgba(${ colour.r }, ${ colour.g }, ${ colour.b }, ${ colour.a })`,
        },
        swatch: {
          //padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={ styles.swatch } onClick={ handleClick }>
          <div style={ styles.colour } />
        </div>
        { displaycolourPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ handleClose }/>
          <SketchPicker color={ colour } onChange={ handleChange } />
        </div> : null }

      </div>
    )
  
}

export default SketchExample