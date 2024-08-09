"use client"

// import React from 'react'
import { useEffect, useRef } from 'react'

function TextArea({onChange, value,mode}) {

  useEffect(()=>{
    textResize()

  },[])
    const textref=useRef()
    const textResize=(event)=>{
        textref.current.style.height="24px"
        textref.current.style.height=textref.current.scrollHeight + 12 + "px"

    }
  return (
    <div>
      <textarea style={{backgroundColor:mode==="light"? 'white':"#E5E5EB"}} value={value} onChange={onChange} ref={textref} onInput={textResize} className='text-area' placeholder='type somthing...'></textarea>
    </div>
  )
}

export default TextArea
