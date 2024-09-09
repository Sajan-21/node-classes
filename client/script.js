async function addUser (event) {

    event.preventDefault();

    // validation

    let warning = '';

    let name = document.getElementById('name').value;
    console.log('name : ',name);
    let regExpName = /^[a-z]+[a-z]$/i;
    let resultName = regExpName.test(name);
    if(resultName === false){
        console.log("enter valid name");
        warning = "Enter valid name !"
        document.getElementById('namelabel').innerHTML = warning;
    }

    let email = document.getElementById('email').value;
    console.log('email : ',email);
    let regExpemail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    let resultemail = regExpemail.test(email);
    if(resultemail === false){
        console.log("enter valid email");
        warning = "Enter valid email !"
        document.getElementById('emaillabel').innerHTML = warning;
    }

    let password = document.getElementById('password').value;
    console.log('password : ',password);

    if(resultName === true && resultemail === true){

        let datas = {
            name : name,
            email : email,
            password : password
        }
    
        let json_data = JSON.stringify(datas);
        console.log(json_data);
    
        let response = await fetch ('/submit',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : json_data
        });
        
        if(response.status === 400){
            warning = "email already exists";
            document.getElementById('warningMessage').innerHTML = warning;
        }
        

    }
    else{

        let warning = "invalid data please retry !";
        document.getElementById('warningMessage').innerHTML = warning;
        
    }

}

async function viewData() {
    try {
        let response = await fetch('/submit');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let viewDatas = await response.json();

        console.log("viewDatas : ", viewDatas);
        if (viewDatas.length > 0) {
            console.log("viewDatas[0]._id : ", viewDatas[0]._id);
        }

        let rows = '';

        for (let i = 0; i < viewDatas.length; i++) {
            let id = viewDatas[i]._id;
            console.log("id : ", id);

            rows += `
                <div class="bg-light d-flex justify-content-between border-secondary shadow-lg p-4 mb-5 bg-body rounded-pill p-3">
                    <div class="d-flex align-items-center">
                    <img src="">
                    <div>${viewDatas[i].name}</div>
                    </div>
                    <div class="d-flex gap-5 align-items-center">
                    <div><button onclick="viewUser('${id}')" class="btn bg-primary text-light rounded-pill">view details</button></div>
                    <div><button onclick="deleteUser('${id}')" class="btn bg-danger text-light rounded-pill">delete user</button></div>
                    </div>
                </div>
            `;
        }

        document.getElementById('dataContainer').innerHTML = rows;

    } catch (error) {
        console.log("error : ", error);
    }
}

function viewUser(id) {
    console.log("id", id);
    window.location = `single.html?id=${id}`;
}

async function viewOne() {

    document.getElementById('editUser').style.display = "none";

    let location = window.location;
    console.log("location : ", location);

    let querystring = location.search;
    console.log("querystring : ", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url : ", urlParams);

    let id = urlParams.get('id');
    console.log("id : ", id);

    try {

        let response = await fetch(`/user?id=${id}`);
        let userData = await response.json();

        console.log("userData : ",userData," typeof(userData) : ",typeof(userData));
        let struser = JSON.stringify(userData);
        console.log("struser : ",struser);

        let rows = `
                <div class="fs-4">name : ${userData.name}</div>
                <div class="fs-4">email : ${userData.email}</div>
                <div class="fs-4">passord : ${userData.password}</div>
                <div><button data-user='${struser}' onclick="editUser(this)" class="btn bg-primary text-light rounded-pill px-5 fs-4">edit profile</button></div>
                
        `;

        document.getElementById('singleUser').innerHTML = rows;
        
    } catch (error) {

        console.log("error : ",error);
        
    }
}

function editUser(buttonElement) {
    let struser = buttonElement.getAttribute('data-user');
    let userData = JSON.parse(struser);
    console.log("userData : ",userData);

    console.log("button clicked...");
    let editUserElement = document.getElementById('editUser');
    editUserElement.style.display = "block";

    console.log("name : ", userData.name);
    console.log("email : ", userData.email);
    console.log("password : ", userData.password);

    document.getElementById('newname').value = userData.name;
    document.getElementById('newemail').value = userData.email;
    document.getElementById('newpassword').value = userData.password;

}

async function updateUser (event) {

    event.preventDefault();

    let location = window.location;
    console.log("location : ", location);

    let querystring = location.search;
    console.log("querystring : ", querystring);

    let urlParams = new URLSearchParams(querystring);
    console.log("url : ", urlParams);

    let id = urlParams.get('id');
    console.log("id : ", id);

    let name = document.getElementById('newname').value;
    let regExpName = /^[a-z]+[a-z]$/i;
    let resultName = regExpName.test(name);
    if(resultName === false){
        console.log("enter valid name");
        warning = "Enter valid name !"
        document.getElementById('namelabel').innerHTML = warning;
    }

    let email = document.getElementById('newemail').value;
    let regExpemail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    let resultemail = regExpemail.test(email);
    if(resultemail === false){
        console.log("enter valid email");
        warning = "Enter valid email !"
        document.getElementById('emaillabel').innerHTML = warning;
    }

    let password = document.getElementById('newpassword').value;

    if(resultName === true && resultemail === true){
        
        let updateduserdata = {
            name : name,
            email,
            password
        }

        let editeddata = JSON.stringify(updateduserdata);
        console.log("editeddata : ",editeddata);

        let response = await fetch(`/user?id=${id}`,{
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : editeddata
        });

        if(response.status === 400){
            warning = "email already exists";
            document.getElementById('editwarningMessage').innerHTML = warning;
        }

    }

}

async function deleteUser (id) {

    console.log("delete button clicked...");

    await fetch(`/user?id=${id}`,{
        method : 'DELETE'
    })

}


