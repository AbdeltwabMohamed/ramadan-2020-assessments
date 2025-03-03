// "use strict";
(() => {

})();


item = "HELL WORLD";
function getSingleVid(element){


  const VideoListEle=document.getElementById('listOfRequests');



const VideoRequestTemplate=`<div class="card mb-3">
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3> ${element.topic_title}</h3>
              <p class="text-muted mb-2">${element.topic_details}</p>
              <p class="mb-0 text-muted">
                <strong>Expected results:</strong> ${element.expected_result}
              </p>
            </div>
            <div class="d-flex flex-column text-center">
              <a id="up${element._id}"class="btn btn-link">🔺</a>
              <h3 id="vote${element._id}">${element.votes?.ups - element.votes?.downs}</h3>
              <a id="down${element._id}" class="btn btn-link">🔻</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">${element.status}</span>
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
            

          
            
              return VideoListContainer

}


document.addEventListener('DOMContentLoaded',()=>{
    // make sure the dom is loaded but not image or css

    const myform=document.getElementById('MyVideoForm');
   

    
    const VideoListEle=document.getElementById('listOfRequests');
    const voteOptions=document.getElementById('voteOptions');
    const SearchText= document.getElementById('searchText');
    const button= document.getElementById('submitButton');
    const LoginForm=document.getElementById('LoginForm');
    const Pagebody=document.getElementById('Pagebody');
  if(window.location.search){
    const userid=(new URLSearchParams(window.location.search).get('id'))
    if(userid){
      console.log('siasdljas')
      Pagebody.classList.remove('d-none')
      LoginForm.classList.add('d-none')
    }
  }

    LoginForm.addEventListener('submit',(e)=>{
      let myData=new FormData(LoginForm);
      e.preventDefault();
      fetch('http://localhost:7777/users/login',{method:'POST',body:myData}).then((data=>{
        window.history.pushState({}, '', data.url);
        LoginForm.classList.add("d-none");
        Pagebody.classList.remove("d-none")
        Pagebody.style.display = "block"; 
        Pagebody.style.visibility = "visible"; 
        Pagebody.style.opacity = "1"; 

      }))
    })



  let orderBy='';
  let Serach='';
    SearchText.addEventListener('keyup',debouns((e=>{
      Serach=e.target.value
      getAll(orderBy,e.target.value)
    }),300))

    voteOptions.addEventListener("change",(e)=>{
      if(e.target.value=='top'){
        orderBy='top'
        getAll('top',Serach)
      }
      else{
orderBy='new'
        getAll('new',Serach)
      } 

    })


    getAll()

    button.addEventListener('click',(e)=>{
      e.preventDefault();
      const myFormData=new FormData(myform); 
      let isValid=true;
      
      const elements = myform.querySelectorAll("[required]");

      let invalidCounter=0;
      let firstInvalidElement=null
for (let index = 0; index < elements.length; index++) {
  
    let el = elements[index];
    console.log('sss',el.value)

    if (el.value==='') {
      invalidCounter++;
        el.classList.add("is-invalid");
       
        if(!firstInvalidElement)
          firstInvalidElement=el;
      } 

      el.addEventListener("input",(e)=>{
        el.classList.remove('is-invalid')
      })

    // Check if it's the last iteration and break
    if (index === elements.length - 1) {

      if (firstInvalidElement) {
        firstInvalidElement.focus();
    }
    firstInvalidElement=null
       
    }
}

  if(invalidCounter=== - elements.length)

      fetch('http://localhost:7777/video-request' ,{method:'POST', body:myFormData }).then(e=>e.json()).then((res)=>{
        VideoListEle.prepend(getSingleVid(res));
        const up=document.getElementById(`up${res._id}`);
        const votevalue=document.getElementById(`vote${res._id}`);
        const down=document.getElementById(`down${res._id}`);
        up.addEventListener("click" ,(e)=>{
          
          fetch('http://localhost:7777/video-request/vote',
          {headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({id:res._id, vote_type:'ups'}),method:'PUT'})
          .then((data)=>data.json()).then((data)=>{
          
            votevalue.innerText=data.votes.ups-data.votes.downs
           
          })
        })
        down.addEventListener("click" ,(e)=>{
          
          fetch('http://localhost:7777/video-request/vote',
          {headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({id:res._id, vote_type:'downs'}),method:'PUT'})
          .then((data)=>data.json()).then((data)=>{
          
            votevalue.innerText=data.votes.ups-data.votes.downs
           
          })
        })
    
        

      
           
    })

    invalidCounter=0
    

  })


})

function getAll(orderBy='new',serach=''){
  const VideoListEle=document.getElementById('listOfRequests');

  fetch(`http://localhost:7777/video-request?orderBy=${orderBy}&search=${serach}`).then((blob)=>{ return blob.json()}).then((data)=>{
    VideoListEle.innerHTML = '';
    data.forEach((element) => {

        getSingleVid(element)
       
        const up=document.getElementById(`up${element._id}`);
        const votevalue=document.getElementById(`vote${element._id}`);
        const down=document.getElementById(`down${element._id}`);
        up.addEventListener("click" ,(e)=>{
          
          fetch('http://localhost:7777/video-request/vote',
          {headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({id:element._id, vote_type:'ups'}),method:'PUT'})
          .then((data)=>data.json()).then((data)=>{
          
            votevalue.innerText=data.votes.ups-data.votes.downs
           
          })
        })
        down.addEventListener("click" ,(e)=>{
          
          fetch('http://localhost:7777/video-request/vote',
          {headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({id:element._id, vote_type:'downs'}),method:'PUT'})
          .then((data)=>data.json()).then((data)=>{
          
            votevalue.innerText=data.votes.ups-data.votes.downs
           
          })
        })
    
    });
})


  }

  function debouns (fn,time){
   let timeout 
    return function (...args){
      console.log(args)
      clearTimeout(timeout)
      timeout=setTimeout(()=>fn.apply(this,args),time)
    }
  }