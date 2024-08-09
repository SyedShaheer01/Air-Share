"use client"

import React, { useEffect, useState } from 'react'
import '../home/page.css'
import TextArea from '../textInput/page'
import MyDropzone from '../fileInput/page'
import Btn from '../button/page'
import FileList from '../FileList/page'
import { FiDownload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
// import FeedBack from '../feedBack/page'
import { db,ref,set, onValue, remove,  storageRef,storage,  uploadBytesResumable, getDownloadURL } from '../fireBase/configs'
// import { data } from 'autoprefixer'
import ClipLoader from 'react-spinners/ClipLoader'
// import { data } from 'autoprefixer'
import "react-toggle/style.css"
// import Toggle from 'react-toggle'
// import { all } from 'axios'
// import { IoMoonOutline } from "react-icons/io5";
import  MaterialUISwitch  from '../switch/page.js'
// import { light } from '@mui/material/styles/createPalette'
import JSZip from 'jszip'
// import FileSaver from 'file-saver'
import { saveAs } from 'file-saver'








function Home() {

  
  
  const [type, setType] = useState("text")
  const [textValue, setTextValue] = useState("")
  const [myFile, setMyFile] = useState([])
  const [tempFile, setTempFile] = useState([])
  // const [feed, setFeed] = useState("")
  const [loading, setLoading] = useState(true)
  const [spinner, setSpinner] = useState(true)
  const [copy, setCopy] = useState(true)
  const [mode, setMode] = useState("light")
  
  const onDrop =async acceptedFiles => {
    

    
    setTempFile([...tempFile, ...acceptedFiles])
    const arr=[]
    for (let i = 0; i < acceptedFiles.length; i++) {
      
      arr.push(uploadFile(acceptedFiles[i],myFile.length+i))
    }
    const AllFile = await Promise.all(arr)
    // console.log("allfile", AllFile)
    setMyFile([...myFile,...AllFile])
    // console.log(acceptedFiles)
    await set(ref(db, 'file-sharing'), {
      file:[...myFile,...AllFile]
    });
    setTempFile([])

  }
  const uploadFile=(file, i)=>{

    return new Promise((resolve,reject)=>{

      
      const fileRef = storageRef(storage, `files/file-${i}`);
      
const uploadTask = uploadBytesResumable(fileRef, file);




uploadTask.on('state_changed', 
  (snapshot) => {

     
     
      
      
      
      const progress = ( snapshot.bytesTransferred /  snapshot.totalBytes)*100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
          case 'running':
            console.log('Upload is running');
            break;
          }
          setLoading(false)
        }, 
        (error) => {
          reject(error)
        }, 
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve( {url:downloadURL, type:file.type,name:file.name});
          });
        }
        );
      
})
  
  
}
  
  const text = () => {
    setType("text")
  }
  const file = () => {
    setType("file")
  }
  
  const deleteFile=()=>{
    remove(ref(db, 'file-sharing'))
    setMyFile([])
  }
  // const myFeed =()=>{
  //   // document.getElementById("feed").style.color="red"

  //   if(feed==="home"){
  //     document.getElementById("feed").style.color="black"
  //     setFeed("feedback")

  //   }
  //   else{
  //     document.getElementById("feed").style.color="red"
  //         setFeed("home")



  //   }
  //   setFeed("feedback")

    
    

  // }

  const  SaveChanges= async ()=>{
   
      await set(ref(db, 'sharing'), {
        text:textValue
      });
      // setCopy(false)

  }

  const handleChange=()=>{
    if(mode === 'light'){
      document.body.style.background="#03032A"
      setMode('dark')
    }
    else{
      document.body.style.background="white"
      setMode('light')


    }

  }

  const textCopy=()=>{

    navigator.clipboard.writeText(textValue)
  }
  const clear= async()=>{

    await remove(ref(db, 'sharing'))
    setTextValue("")
  }

  
 const downloadAll=()=>{

  let filename = "All-Files";
    const zip = new JSZip()
    const folder = zip.folder('project')
    myFile.forEach((file)=> {
   const blobPromise =  fetch(file.url)    
.then(function (response) {  
  console.log({response})             
    if (response.status === 200 || response.status === 0) {
        return Promise.resolve(response.blob());
    } else {
        return Promise.reject(new Error(response.statusText));
    }
})                          
 const name = file.name
        folder.file(name, blobPromise)
    })

    zip.generateAsync({type:"blob"})
        .then(blob => saveAs(blob, filename))
        .catch(e => console.log(e));


 }
    
    

  
  
  useEffect(()=>{
    try {
      
      const starCountRef = ref(db, 'sharing');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setCopy(false)
        {data &&
          setTextValue(data.text)
          setLoading(false)
        }
      
          
        
        
        
      });
      
      const star = ref(db, 'file-sharing');
      onValue(star, (snapshot) => {
        const data = snapshot.val();
        // setCopy(false)
        {data &&
          setMyFile(data.file)
          setSpinner(false)
          // setTimeout(() => {
            
            // }, 3000);
          }
          
          
          
          
        });
        
        // <BounceLoader size={50} color="#864bff" cssOverride={{margin:"0px auto"}} />
      } 
      
      catch (error) {
        console.log(error)
        
      }

},[])
  
  return (
    
    <div className='parent'>
      <div className=' container'>
        <div className='logo'>



          <svg xmlns="http://www.w3.org/2000/svg" width="107" height="51" viewBox="0 0 107 51">
            <defs>
              <linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="101.259%">
                <stop offset="0%" stop-color="#864BFF" />
                <stop offset="100%" stop-color="#5082FF" />
              </linearGradient>
            </defs>
            <path fill="url(#a)" fill-rule="evenodd" d="M277.8 80.292h-.056a3.95 3.95 0 0 1-1.862 1.568 6.4 6.4 0 0 1-2.45.476 6.317 6.317 0 0 1-1.834-.266 4.628 4.628 0 0 1-1.554-.798 3.854 3.854 0 0 1-1.064-1.316c-.262-.523-.392-1.13-.392-1.82 0-.784.144-1.447.434-1.988.289-.541.68-.99 1.176-1.344a5.84 5.84 0 0 1 1.694-.826c.634-.196 1.292-.34 1.974-.434.68-.093 1.362-.15 2.044-.168a69.356 69.356 0 0 1 1.89-.028c0-.747-.266-1.34-.798-1.778-.532-.439-1.162-.658-1.89-.658-.691 0-1.321.145-1.89.434-.57.29-1.078.686-1.526 1.19l-2.24-2.296a7.707 7.707 0 0 1 2.744-1.638 9.807 9.807 0 0 1 3.248-.546c1.232 0 2.244.154 3.038.462.793.308 1.428.76 1.904 1.358.476.597.807 1.33.994 2.198.186.868.28 1.871.28 3.01V82H277.8v-1.708zm-1.036-4.256c-.318 0-.714.014-1.19.042a6.03 6.03 0 0 0-1.372.238c-.44.13-.812.327-1.12.588-.308.261-.462.625-.462 1.092 0 .504.214.877.644 1.12.429.243.877.364 1.344.364.41 0 .807-.056 1.19-.168.382-.112.723-.27 1.022-.476a2.3 2.3 0 0 0 .714-.784c.177-.317.266-.69.266-1.12v-.896h-1.036zm5.867-7.644h4.2V82h-4.2V68.392zm-.336-4.284c0-.672.238-1.246.714-1.722a2.347 2.347 0 0 1 1.722-.714c.672 0 1.246.238 1.722.714s.714 1.05.714 1.722c0 .672-.238 1.246-.714 1.722a2.347 2.347 0 0 1-1.722.714 2.347 2.347 0 0 1-1.722-.714 2.347 2.347 0 0 1-.714-1.722zm5.84 4.284h4.2v2.184h.055c.448-.84.98-1.47 1.596-1.89.616-.42 1.391-.63 2.324-.63.243 0 .486.01.728.028.243.019.467.056.672.112v3.836a5.711 5.711 0 0 0-1.792-.28c-.802 0-1.437.112-1.904.336a2.528 2.528 0 0 0-1.078.938c-.252.401-.415.882-.49 1.442-.074.56-.112 1.176-.112 1.848V82h-4.2V68.392zm11.13 3.36h-2.771v-3.36h2.772v-2.408c0-.747.065-1.451.196-2.114.13-.663.382-1.246.756-1.75.373-.504.91-.9 1.61-1.19.7-.29 1.62-.434 2.758-.434.43 0 .85.019 1.26.056.41.037.812.103 1.204.196l-.196 3.556a4.938 4.938 0 0 0-.672-.21 3.172 3.172 0 0 0-.7-.07c-.672 0-1.176.145-1.512.434-.336.29-.504.882-.504 1.778v2.156h3.108v3.36h-3.108V82h-4.2V71.752zm6.68 3.444c0-1.083.196-2.063.588-2.94a6.768 6.768 0 0 1 1.61-2.254 7.11 7.11 0 0 1 2.408-1.442 8.577 8.577 0 0 1 2.954-.504c1.046 0 2.03.168 2.954.504a7.11 7.11 0 0 1 2.408 1.442 6.768 6.768 0 0 1 1.61 2.254c.392.877.588 1.857.588 2.94s-.196 2.063-.588 2.94a6.768 6.768 0 0 1-1.61 2.254 7.11 7.11 0 0 1-2.408 1.442 8.577 8.577 0 0 1-2.954.504 8.577 8.577 0 0 1-2.954-.504 7.11 7.11 0 0 1-2.408-1.442 6.768 6.768 0 0 1-1.61-2.254c-.392-.877-.588-1.857-.588-2.94zm4.2 0c0 1.027.294 1.857.882 2.492.588.635 1.414.952 2.478.952 1.064 0 1.89-.317 2.478-.952.588-.635.882-1.465.882-2.492s-.294-1.857-.882-2.492c-.588-.635-1.414-.952-2.478-.952-1.064 0-1.89.317-2.478.952-.588.635-.882 1.465-.882 2.492zm11.664-6.804h4.2v2.184h.056c.448-.84.98-1.47 1.596-1.89.616-.42 1.39-.63 2.324-.63.242 0 .485.01.728.028.242.019.466.056.672.112v3.836a5.711 5.711 0 0 0-1.792-.28c-.803 0-1.438.112-1.904.336a2.528 2.528 0 0 0-1.078.938c-.252.401-.416.882-.49 1.442-.075.56-.112 1.176-.112 1.848V82h-4.2V68.392zm-80.451 26.173c-.81-1.23-2.04-1.845-3.69-1.845-.57 0-1.14.135-1.71.405-.57.27-.9.735-.99 1.395-.09.54.135.937.675 1.193.54.255 1.215.48 2.025.675.81.195 1.687.404 2.632.63a8.78 8.78 0 0 1 2.588 1.057 4.982 4.982 0 0 1 1.822 1.957c.435.826.563 1.928.383 3.308-.18 1.41-.645 2.572-1.395 3.487a8.822 8.822 0 0 1-2.678 2.206 11.53 11.53 0 0 1-3.397 1.17c-1.23.225-2.43.337-3.6.337-1.53 0-3.045-.217-4.545-.653-1.5-.435-2.715-1.207-3.645-2.317l4.725-4.545c.54.78 1.162 1.372 1.867 1.777.705.406 1.568.608 2.588.608.78 0 1.5-.112 2.16-.337.66-.226 1.035-.638 1.125-1.238.09-.57-.128-.997-.653-1.282-.525-.286-1.2-.525-2.025-.72l-2.655-.63a9.942 9.942 0 0 1-2.61-1.013 4.776 4.776 0 0 1-1.867-1.912c-.45-.826-.57-1.928-.36-3.308.18-1.29.6-2.4 1.26-3.33a8.549 8.549 0 0 1 2.407-2.295c.945-.6 1.988-1.042 3.128-1.328 1.14-.285 2.28-.427 3.42-.427 1.44 0 2.865.21 4.275.63 1.41.42 2.55 1.17 3.42 2.25l-4.68 4.095zm16.1-18.585l-2.116 15.12h.09c.21-.42.518-.84.923-1.26.405-.42.885-.795 1.44-1.125.555-.33 1.192-.6 1.912-.81a8.158 8.158 0 0 1 2.295-.315c1.71 0 3.06.262 4.05.787.99.526 1.71 1.253 2.16 2.183.45.93.69 2.025.72 3.285.03 1.26-.06 2.625-.27 4.095L266.997 110h-6.75l1.485-10.71c.09-.63.165-1.282.225-1.958a5.418 5.418 0 0 0-.135-1.867 2.688 2.688 0 0 0-.855-1.395c-.42-.36-1.065-.54-1.935-.54-.87 0-1.597.157-2.182.472a3.97 3.97 0 0 0-1.418 1.26 5.826 5.826 0 0 0-.81 1.778c-.18.66-.315 1.35-.405 2.07l-1.53 10.89h-6.75l4.77-34.02h6.75zm26.674 31.275h-.09c-.9 1.17-2.01 2.01-3.33 2.52-1.32.51-2.67.765-4.05.765-1.02 0-1.98-.142-2.88-.428-.9-.285-1.673-.712-2.318-1.282a5.027 5.027 0 0 1-1.417-2.115c-.3-.84-.375-1.815-.225-2.925.27-1.89.982-3.352 2.137-4.388 1.155-1.035 2.52-1.8 4.095-2.294a19.9 19.9 0 0 1 4.95-.878 90.944 90.944 0 0 1 4.703-.135c.15-1.2-.15-2.152-.9-2.858-.75-.705-1.71-1.057-2.88-1.057-1.11 0-2.153.232-3.128.697a10.316 10.316 0 0 0-2.722 1.913l-3.06-3.69a14.596 14.596 0 0 1 4.747-2.632 16.763 16.763 0 0 1 5.333-.878c1.98 0 3.577.247 4.792.742 1.215.496 2.138 1.223 2.768 2.183.63.96.997 2.137 1.102 3.532.105 1.396.023 3.008-.247 4.838L289.982 110h-6.21l.36-2.745zm-.72-6.84c-.51 0-1.148.022-1.913.067-.765.046-1.515.173-2.25.383-.735.21-1.38.525-1.935.945-.555.42-.877 1.005-.967 1.755-.06.42-.015.772.135 1.058.15.285.36.532.63.742.27.21.592.36.967.45.375.09.743.135 1.103.135.66 0 1.312-.09 1.957-.27a6.62 6.62 0 0 0 1.755-.765 4.62 4.62 0 0 0 1.328-1.26c.36-.51.585-1.11.675-1.8l.18-1.44h-1.665zm12.14-12.285h6.75l-.496 3.51h.09c.9-1.35 1.89-2.362 2.97-3.037 1.08-.676 2.37-1.013 3.87-1.013.39 0 .78.015 1.17.045.39.03.75.09 1.08.18l-.855 6.165c-.48-.15-.945-.262-1.395-.338a8.761 8.761 0 0 0-1.44-.112c-1.29 0-2.34.18-3.15.54-.81.36-1.455.862-1.935 1.508-.48.645-.847 1.417-1.102 2.317-.255.9-.458 1.89-.608 2.97l-1.26 9.135h-6.75l3.06-21.87zm33.919 18.09a12.922 12.922 0 0 1-4.523 3.195c-1.755.75-3.517 1.125-5.287 1.125-1.68 0-3.225-.27-4.635-.81-1.41-.54-2.588-1.312-3.533-2.318-.945-1.005-1.635-2.212-2.07-3.622-.435-1.41-.532-2.985-.292-4.725.24-1.74.772-3.315 1.597-4.725a13.316 13.316 0 0 1 3.083-3.623 13.567 13.567 0 0 1 4.185-2.317c1.56-.54 3.18-.81 4.86-.81 1.56 0 2.94.27 4.14.81 1.2.54 2.175 1.312 2.925 2.317.75 1.006 1.267 2.213 1.552 3.623.285 1.41.308 2.985.068 4.725l-.315 2.115h-15.66c.09 1.29.532 2.317 1.327 3.082.795.766 1.853 1.148 3.173 1.148 1.11 0 2.077-.247 2.902-.742a9.695 9.695 0 0 0 2.273-1.913l4.23 3.465zm-4.365-9.63c.18-1.14-.06-2.115-.72-2.925-.66-.81-1.605-1.215-2.835-1.215-.75 0-1.425.12-2.025.36-.6.24-1.125.547-1.575.922a5.19 5.19 0 0 0-1.125 1.305c-.3.496-.51 1.013-.63 1.553h8.91z" transform="translate(-225 -60)" />
          </svg>

        </div>

        <div className='list'>
          <ul style={{color:mode=== "dark" ? "white":"black"}}>
            <li>How its Work</li>
            <li> download</li>
            <li>upgrade</li>
            <li>feed back</li>
            <li className='login'>login/register</li>
           <MaterialUISwitch onChange={handleChange}/>
          </ul>


        </div>


      </div>

        
      
        <div className='mob-bar' style={{ display: 'flex', marginTop: '20px', backgroundColor:mode==="light"? 'white':"#E5E5EB", boxShadow:" 0 21px 33px 0 rgba(0, 0, 0, .1);",width:"100%" }}>
        <div className='mob-bar-flex' style={{ padding:"15px", backgroundColor:mode==="light"?"#f8f8f8":"#BABABD",paddingBottom:"200px"  }}>
          {type === "text" ?
          
          <div>


              <svg className='svg-img' onClick={text} xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32">
                <path fill="#765CFF" fill-rule="evenodd" d="M26.276 18.246H1.116a1.07 1.07 0 0 0-.781.335 1.121 1.121 0 0 0-.335.825v2.275c0 .327.112.602.335.826.223.223.483.334.78.334h25.161c.298 0 .558-.111.78-.334.224-.224.335-.499.335-.826v-2.275c0-.327-.111-.602-.334-.825a1.07 1.07 0 0 0-.78-.335zm0-9.1H1.116a1.07 1.07 0 0 0-.781.334 1.07 1.07 0 0 0-.335.78v2.276c0 .327.112.602.335.825.223.223.483.335.78.335h25.161c.298 0 .558-.112.78-.335.224-.223.335-.498.335-.825V10.26a1.07 1.07 0 0 0-.334-.781 1.07 1.07 0 0 0-.78-.335zM14.856 27.39H1.116a1.07 1.07 0 0 0-.781.335 1.121 1.121 0 0 0-.335.825v2.276c0 .327.112.602.335.825.223.223.483.334.78.334h13.74c.298 0 .558-.111.781-.334.223-.223.335-.498.335-.825V28.55c0-.327-.112-.602-.335-.825a1.07 1.07 0 0 0-.78-.335zM26.276 0H1.116a1.07 1.07 0 0 0-.781.335 1.07 1.07 0 0 0-.335.78v2.32c0 .297.112.558.335.78.223.224.483.335.78.335h25.161c.298 0 .558-.111.78-.334a1.07 1.07 0 0 0 .335-.78v-2.32a1.07 1.07 0 0 0-.334-.781 1.07 1.07 0 0 0-.78-.335z" />
              </svg>

            </div>

            : <div>
            
              <img onClick={text} className='svg-img' src='https://airforshare.com/assets/img/text-grey.svg' />
            </div>
          }





          {type === "file" ?
            <div>

              <svg style={{ marginLeft: '15px', cursor:'pointer' }} onClick={file} xmlns="http://www.w3.org/2000/svg" width="27" height="32" viewBox="0 0 27 32">
                <defs>

                  <linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="101.259%">
                    <stop offset="0%" stop-color="#864BFF" />
                    <stop offset="100%" stop-color="#5082FF" />
                  </linearGradient>
                </defs>
                <path fill="url(#a)" fill-rule="evenodd" d="M43.867 124l-15.873.345v4.395H24v26.436h20.975l.078-3.188h5.81v-19.96L43.868 124zm-18.78 29.99v-23.993h2.786v21.991h15.994v2.002h-18.78zm19.373-23.087c-.396-2.596-.593-4.22-.593-4.873l4.997 5.967-4.404-1.094zm-11.613 12.205v1.782H45.89v-1.782H32.847zm0-4.361v1.782H45.89v-1.782H32.847z" transform="translate(-24 -124)" />
              </svg>


            </div>




: <div>

              <svg style={{ marginLeft: '15px', cursor:'pointer' }} onClick={file} xmlns="http://www.w3.org/2000/svg" width="27" height="32" viewBox="0 0 27 32">
                <path fill="#4A4A4A" fill-rule="evenodd" d="M19.867 0L3.994.345V4.74H0v26.436h20.975l.078-3.188h5.81V8.028L19.868 0zM1.087 29.99V5.997h2.786v21.991h15.994v2.002H1.087zm23.777-4.001H5.873V1.999h11.994c0 .764.401 3.028 1.203 6.794 3.224.802 5.156 1.203 5.794 1.203v15.993zM20.46 6.903c-.396-2.596-.593-4.22-.593-4.873l4.997 5.967-4.404-1.094zM8.847 19.108v1.782H21.89v-1.782H8.847zm0-4.361v1.782H21.89v-1.782H8.847z" opacity=".65" />

              </svg>
            </div>


          }
        </div>
        <div  style={{ width:"100%",  marginLeft: '20px', marginBottom:"30px", marginRight:"30px"}}>
          {type === "file" ?
           <div >
            <div className='file-section'>
            <div>
            <h1 className='my-text'> Files</h1>
            
            
              
            
            </div>
            
              {myFile.length ?
                <div className='both-icons' >
                
                <div className='download'>
                <FiDownload className='svg-dow' />
                
                <span onClick={downloadAll}>download</span>
                
                </div>
                <div className='delete'>
                <MdDelete className='svg-del' />
                
                
                <span onClick={deleteFile}>delete</span>
                
                </div>
                </div>
                :null
            }
              </div>


              
              
          { tempFile.length || myFile.length ? 
            <div>
            
           
      
         
         <FileList tempFile={tempFile} onDrop={onDrop} myFile={myFile}/>
       
            
            </div>
            
            
            
              :
              <div>
                {spinner  ? 

<ClipLoader size={50} color="#864bff" className='spinner' />
:
              
<MyDropzone  onDrop={onDrop} textElement={
  <div className='file-input'>
  <p className='one'>Drag and drop any files up to 2 files, 5Mbs each or<span> Browse </span> </p> 
  <p> <span> Upgrade </span> to get more space</p>  

  </div>  

    }/>
}
    </div>

  }

  </div>

  :

            <div>
              <h1 className='my-text'>Text</h1>
              <div style={{width:"100%"}}>
              { loading  ? 
              
              <ClipLoader size={50} color="#864bff" className='loading' />
              :
              
            <TextArea mode={mode}  value={textValue} onChange={(e)=>{
              setTextValue(e.target.value)
              setCopy(true)
            }}/>
            } 
              </div>
              {copy ?
              <div  className='btn-wrapper'>
              <p onClick={clear} style={{cursor:"pointer"}}>Clear</p>
              <Btn className="save-btn" id='btn' title={"Save"} onClick={SaveChanges} disabled={!textValue}  />
              </div>
              :<div className='btn-wrapper2'>
              
              <p onClick={clear} style={{cursor:"pointer"}}>Clear</p>
              <Btn className="save-btn" onClick={textCopy}  title={'Copy'}  disabled={!textValue} />
              </div>
               


            }
            </div>
          }
          

        </div>
      </div>
      
       
    
    </div>
  )
  }


export default Home
