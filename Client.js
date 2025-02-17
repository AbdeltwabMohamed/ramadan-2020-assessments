function getSingleVid(element){





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
              <a class="btn btn-link">🔺</a>
              <h3>${element.votes}</h3>
              <a class="btn btn-link">🔻</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">${element.status}</span>
              &bullet; added by <strong>${element.author_name}</strong> on
              <strong>${element.submit_date}</strong>
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

            return VideoListContainer

}

document.addEventListener('DOMContentLoaded',()=>{
    // make sure the dom is loaded but not image or css

    const myform=document.getElementById('MyVideoForm');
    const VideoListContainer=document.createElement('div');
    const VideoListEle=document.getElementById('listOfRequests');

    fetch('http://localhost:7777/video-request').then((blob)=>{ return blob.json()}).then((data)=>{
        console.log(data)
        data.forEach((element) => {
            console.log(element)
           
            VideoListEle.appendChild(getSingleVid(element));
        });
    })


    myform.addEventListener('submit',(e)=>{
      e.preventDefault();
      const myFormData=new FormData(myform); // MAKE object form  using mutipart by defualt
      fetch('http://localhost:7777/video-request' ,{method:'POST', body:myFormData}).then((res)=>{
        
      })

    })


  })