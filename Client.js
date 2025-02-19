// "use strict";
(() => {

})();


item = "HELL WORLD";
function getSingleVid(element){


  const VideoListEle=document.getElementById('listOfRequests');



const VideoRequestTemplate=`<div class="card mb-3">
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3>Dummy ${element.topic_title}</h3>
              <p class="text-muted mb-2">${element.topic_details}</p>
              <p class="mb-0 text-muted">
                <strong>Expected results:</strong> ${element.expected_result}
              </p>
            </div>
            <div class="d-flex flex-column text-center">
              <a id="up${element._id}"class="btn btn-link">🔺</a>
              <h3 id="vote${element._id}">${element.votes.ups - element.votes.downs}</h3>
              <a id="down" class="btn btn-link">🔻</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">${element.status.toUpperCase()}</span>
              &bullet; added by <strong>${element.author_name}</strong> on
              <strong>${new Date(element.submit_date).toLocaleDateString()}</strong>
            </div>
            <div
              class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
              <div class="badge badge-success">
                ${element.target_level}
              </div>
            </div>
          </div>`

          const VideoListContainer=document.createElement('div');

            VideoListContainer.innerHTML=VideoRequestTemplate;
            VideoListEle.appendChild(VideoListContainer);
            

              const up=document.getElementById(`up${element._id}`);
              const votevalue=document.getElementById(`vote${element._id}`);
              console.log('up is ',up)
              const down=document.getElementById('down');
              up.addEventListener("click" ,(e)=>{
                
                fetch('http://localhost:7777/video-request/vote',
                {headers: {
                  'Content-Type': 'application/json'
                },
                body:JSON.stringify({id:element._id, vote_type:'ups'}),method:'PUT'})
                .then((data)=>data.json()).then((data)=>{
                  VideoListEle.removeChild();
                  fetch('http://localhost:7777/video-request').then((blob)=>{ return blob.json()}).then((data)=>{
                    console.log(data)
                    data.forEach((element) => {
                        console.log(element)
                       
                        getSingleVid(element)
                       
                    
                    });
                })
                 
                })
              })
            
              return VideoListContainer

}


document.addEventListener('DOMContentLoaded',()=>{
    // make sure the dom is loaded but not image or css

    const myform=document.getElementById('MyVideoForm');
   
    
    const VideoListEle=document.getElementById('listOfRequests');

    fetch('http://localhost:7777/video-request').then((blob)=>{ return blob.json()}).then((data)=>{
        console.log(data)
        data.forEach((element) => {
            console.log(element)
           
            getSingleVid(element)
           
        
        });
    })


    myform.addEventListener('submit',(e)=>{
      e.preventDefault();
      const myFormData=new FormData(myform); // MAKE object form  using mutipart by defualt
      fetch('http://localhost:7777/video-request' ,{method:'POST', body:myFormData}).then((res)=>{
        VideoListEle.prepend(getSingleVid(res));

    })

  })


})

