import React from 'react'
// import TextArea from '../textInput/page'



function Btn({disabled, onClick,title }) {
  return (
    <div style={{paddingTop:"-10%"}}>
        <button  onClick={onClick} disabled={disabled} className='btn'>{title}</button>
      
    </div>
  )
}

export default Btn
