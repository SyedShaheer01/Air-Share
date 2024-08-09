 "use client"
// import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

function MyDropzone({textElement ,onDrop}) {
  
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
  
  return (
    
      <div>

    <div {...getRootProps()} >
      <input {...getInputProps()}  />
      <div>

      
    {
      textElement
    }
      </div>

      
    </div>
      
          
          </div>
  )
}
export default MyDropzone