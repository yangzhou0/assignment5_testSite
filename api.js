// Credits to Larry
// wrap in IIFE to control scope
(function(){
  const baseURL = 'http://167.99.14.231:3000';
  //Utility function for all request methods below: GET, PUT, POST, DELETE
  async function callAPI(method, uri, params, body){
    jsonMimeType = {
      'Content-type':'application/json'
    }
    try{
      /*  Set up our fetch.
       *   'body' to be included only when method is POST
       *   If 'PUT', we need to be sure the mimetype is set to json
       *      (so bodyparser.json() will deal with it) and the body
       *      will need to be stringified.
       *   '...' syntax is the ES6 spread operator.
       *      It assigns new properties to an object, and in this case
       *      lets us use a conditional to create, or not create, a property
       *      on the object. (an empty 'body' property will cause an error
       *      on a GET request!)
       */
      var response = await fetch(baseURL + uri, {
        method: method, // GET, POST, PUT, DELETE, etc.
        ...(method=='POST' ? {body: body} : {}),
        ...(method=='PUT' ?  {headers: jsonMimeType, body:JSON.stringify(body)} : {})
      });
      return response.json(); // parses response to JSON
    }catch(err){
      console.error(err);
      return err.message;
    }
  }

// Display all photos in DB
function listAPI(){
  callAPI('GET', '/api/photos')
    .then((photos)=>{
      console.log('\n***************************\n Start testing API List:\n***************************\n');
      console.log('------List photos------:');
      console.log(photos);
      console.log('***************************\n Finish testing API List:\n***************************\n');
    })
}

// Afer validating that there's a file selected, create a new entry in DB and display it
function createAPI(){
  let input = document.querySelector('input[type="file"]');
  if (input.value){
    let data = new FormData();
    data.append('image', input.files[0]);
    data.append('description','This is an AJAX API test for description');
    data.append('hashtag','This is an AJAX API test for hashtag');
    callAPI('POST', '/api/photos', null, data)
      .then((photo)=>{
        photoId = photo._id;
        savedPhoto = photo;  // keep a handle to the created photo object
        console.log('\n***************************\n Start testing API create:\n***************************\n');
        console.log('------Created photo------:');
        console.log(photo);
        console.log('***************************\n Finish testing API create:\n***************************\n');

      })
  }else{
    alert("please select an image file first");
  }
}

// Display one photo based on given ID
function readAPI(){
  //prompt user to enter info
  let photoId = prompt('Enter the id of photo');
  try{callAPI('GET',`/api/photos/${photoId}`, null, null)
    .then((photo)=>{
      console.log('\n***************************\n Start testing API Read:\n***************************\n');
      console.log('------Found photo------:');
      console.log(photo);
      console.log('***************************\n Finish testing API Read:\n***************************\n');
  })}catch{
    alert('wrong ID')
  }
}

// Update one photo with given ID and display updated photo
function updateAPI(){
  //prompt user to enter info
  let photoId = prompt('Enter the id of photo');
  let description = prompt('Enter your description of the photo');
  let data = {'description':description};
  callAPI('PUT',`/api/photos/${photoId}`, null, data)
  .then((photo)=>{
    console.log('\n***************************\n Start testing API Update:\n***************************\n');
    console.log('------Updated photo------:');
    console.log(photo);
    console.log('***************************\n Finish testing API Update:\n***************************\n');
  })
}

// Delete one photo with given ID and return result
function deleteAPI(){
  //prompt user to enter info
  let photoId = prompt('Enter the id of photo');
  callAPI('DELETE', `/api/photos/${photoId}`, null, null)
    .then((result)=>{
      console.log('\n***************************\n Start testing API Delete:\n***************************\n');
      console.log('------Result------:');
      console.log(result);
      console.log('***************************\n Finish testing API Delete:\n***************************\n');
  })
}
// Delete all photos and return result
function deleteAllAPI(){
  callAPI('DELETE', '/api/photos', null, null)
    .then((result)=>{
      console.log('\n***************************\n Start testing API DeleteAll:\n***************************\n');
      console.log('------Result------:');
      console.log(result);
      console.log('***************************\n Finish testing API DeleteAll:\n***************************\n');
  })
}

//Register all event listeners for clicking the button:
// Test API List after clicking the Test List button
document.querySelector('#testList').addEventListener("click", ()=>{
  listAPI();
});

// Test API Create after clicking the Test Create button
document.querySelector('#testCreate').addEventListener("click", ()=>{
  createAPI();
});

// Test API Read after clicking the Test Read button
document.querySelector('#testRead').addEventListener("click", ()=>{
  readAPI();
})

// Test API Update after clicking the Test Update button
document.querySelector('#testUpdate').addEventListener("click", ()=>{
  updateAPI();
});

// Test API Delete after clicking the Test Delete button
document.querySelector('#testDelete').addEventListener("click", ()=>{
  deleteAPI();
});

// Test API DeleteAll after clicking the Test DeleteAll button
document.querySelector('#testDeleteAll').addEventListener("click", ()=>{
  deleteAllAPI();
});


})();
