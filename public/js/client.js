const socket=io();

var username;

var chats=document.querySelector(".chats");
var users_list=document.querySelector(".users-list");
var user_join=document.querySelector(".user-join");
var users_count=document.querySelector(".users-count");
var user_send=document.querySelector("#user-send");
var user_msg=document.querySelector("#user-msg");

do{
  username=prompt("Enter your name: ");
}while(!username);

/**It will be called when user will join */
socket.emit("new-user-joined",username);

socket.on('user-connected',(socket_name)=>{
  userJoinLeft(socket_name,'joined');
});

function userJoinLeft(name,status){
  let div=document.createElement("div");
  div.classList.add('user-join');
  let content=`<p><b>${name}</b> ${status} the chat</p>`;
  div.innerHTML=content;
  chats.appendChild(div);
  chats.scrollTop=chats.scrollHeight;
}

socket.on('user-disconnected',(socket_name)=>{
  userJoinLeft(socket_name,'left');
});

socket.on('users-list',(users)=>{
  users_list.innerHTML="";
  users_arr=Object.values(users);
  for(i=0;i<users_arr.length;i++){
    let p=document.createElement('p');
    p.innerText=users_arr[i];
    users_list.appendChild(p);
  }
  users_count.innerHTML=users_arr.length;
});


user_send.addEventListener('click',()=>{
  let data={
    user:username,
    msg: user_msg.value
  };
  if(user_msg.value!=''){
    appendMessage(data,'outgoing')
    socket.emit('message',data);
    user_msg.value='';
  }
});

function appendMessage(data,status){
  let div=document.createElement('div');
  div.classList.add('message',status);
  let content=`
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
  `;
  div.innerHTML=content;
  chats.appendChild(div);
  chats.scrollTop=chats.scrollHeight;
}

socket.on('message',(data)=>{
  appendMessage(data,'incoming');
});
