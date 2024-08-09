// "use client"

import React from 'react'
import { IoLogoHtml5 } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import MyDropzone from '../fileInput/page';
import { SiCss3 } from "react-icons/si";
import { CiFileOn } from "react-icons/ci";
import ClipLoader from 'react-spinners/ClipLoader';






function FileList({onDrop, myFile,tempFile}) {
  // console.log('file', myFile)
  
  return (
      <div className='icon-container'>


      { 
        myFile && myFile.map((v,i)=>{
        
        let icon;

        switch (v.type) {
          case 'text/html':
            icon= <IoLogoHtml5 className='icon-image' size={30}  />
            
            break;
            case 'text/css':
              icon=<SiCss3 className='icon-image' size={30}/>
              break;
              
        
          default:
            icon=<CiFileOn className='icon-image' size={30} />
            break;
        }
        
        
        return(


          
          <div key={i} className='icon'>
            
            {v.type.indexOf("image") !== -1 ?
            <img src={v.url}/>
            :
            <div>

            {icon}
            
            <h6>{v.name.slice(0,10)}{v.name.slice(v.name.lastIndexOf('.'))}</h6>
            
            </div>
            }
            
            </div>
              )
          
          
        }
      
      )}
        
      {tempFile && tempFile.map((v,i)=>{
        
        let icon;

        switch (v.type) {
          case 'text/html':
            icon= <IoLogoHtml5 className='icon-image' size={30}  />
            
            break;
            case 'text/css':
              icon=<SiCss3 className='icon-image' size={30}/>
              break;
              
        
          default:
            icon=<CiFileOn className='icon-image' size={30} />
            break;
        }
        
        
        return(


          
          <div key={i} className='icon' id='temp-file'>
            
            {v.type.indexOf("image") !== -1 ?
            <img src={URL.createObjectURL(v)}/>
            :
            <div>

            {icon}
            
            <h6>{v.name.slice(0,10)}{v.name.slice(v.name.lastIndexOf('.'))}</h6>
            
            </div>
            }
          <ClipLoader size={20} color="#fff" className='loader' />

            
            </div>
              )
          
          
        }
      
      )}
        


      
      <div>
        <MyDropzone  onDrop={onDrop} textElement={
        <div className='add'>
      <FaPlus className='plus' size={18} />
      <br/>
        <span>Add File</span>
        <p>(up to 5Mb)</p>


      </div>}/>
      </div>
    </div>
  )
}

export default FileList;
