var wss_protocol = window.location.protocol == "https:" ? "wss://" : "ws://";
var chatSocket = new WebSocket(
  wss_protocol + window.location.host + "/ws/chat/"
);
var messages = [];

  function create_message_container(message, source, message_id){

      var id = `${source}-${message_id}`
      var animation_div = `
         <div class="flex justify-center" id=${id}>
              <span class="circle animate-loader"></span>
              <span class="circle animate-loader animation-delay-200"></span>
              <span class="circle animate-loader animation-delay-400"></span>
          </div>
      `

      if (source == 'bot'){
          var start_end_val = 'justify-start'
          var color = 'text-gray-700 bg-white border border-gray-200'
          var separator = ''
          var correction = ''
          var message_div = animation_div

      } else if (source == 'user') {
          var start_end_val = 'justify-end'
          var color = "bg-blue-600 text-white"
          var separator = '<div class="line_separator"></div>'
          var correction = `<div id=${source}-${message-id} className="block font-normal">place holder</div>`
          var message_div = `<div id=${id} className="block font-normal">${message}</div>`
          //var correction = `<span className="block font-normal">${msg.correction}</span>`
      }

      const container = 
          `<li class="flex ${start_end_val}"> 
          <div class="relative max-w-xl px-4 py-2 rounded-lg shadow-md ${color}">
          ${message_div}
          ${separator}
          ${correction}
          </div></li>`

      return container
  }

  function create_user_message(message, message_id){
      var id = `user-${message_id}`
      // only for correction
      var animation_div = `
         <div class="flex justify-center" id=correction-${message_id}>
              <span class="circle animate-loader"></span>
              <span class="circle animate-loader animation-delay-200"></span>
              <span class="circle animate-loader animation-delay-400"></span>
          </div>
      `
      container =
          `<li class="flex justify-end"> 
              <div class="relative max-w-xl px-4 py-2 rounded-lg shadow-md bg-blue-600 text-white">
              <div id=${id} className="block font-normal">${message}</div>
              <div class="line_separator"></div>
              ${animation_div}
          </div></li>`

      // add message to frontend
      document.querySelector("#chat-log").innerHTML += container
      
  }

  function create_response_message(message_id){
      if (message_id == 0){
          var message_div = `
             <div id=bot-${message_id}>Hi! I'm Fin, your fluent friend. Speak to me in any language and lets have a conversation.</div>
          `

      } else {
          var message_div = `
             <div class="flex justify-center" id=bot-${message_id}>
                  <span class="circle animate-loader"></span>
                  <span class="circle animate-loader animation-delay-200"></span>
                  <span class="circle animate-loader animation-delay-400"></span>
              </div>
          `
      }
      const container = 
          `<li class="flex justify-start"> 
              <div class="relative max-w-xl px-4 py-2 rounded-lg shadow-md text-gray-700 bg-white border border-gray-200">
                  ${message_div}
              </div>
          </li>`

      // add to message list
      document.querySelector("#chat-log").innerHTML += container;
  }

  function update_gpt_message(message, source, message_id){
      var id = `${source}-${message_id}`
      var message_div = `
         <div>${message}</div>
      `
      message_element = document.getElementById(id)
      message_element.textContent = message
  }

chatSocket.onopen = function (e) {
  document.querySelector("#chat-header").innerHTML =
    "Meet Fin, your fluent friend!";

  create_response_message(message_id = 0);
};

  message_history = []
chatSocket.onmessage = function (e) {
  var data = JSON.parse(e.data);
  var message = data["message"];
  var id = `${data['source']}-${data['message_id']}`

  message_history += [data]
  // on user message greate it and empty response
  if (data['source'] == 'user'){
      create_user_message(data['message'], data['message_id'])        
      // create empty response message
      create_response_message(data['message_id'])
  // not a user message so update correction or response
  } else {
      update_gpt_message(data['message'], data['source'], data['message_id'])
  }

  // scroll down to bot message
  document.getElementById(`bot-${data['message_id']}`).scrollIntoView()

};

chatSocket.onclose = function (e) {
  //alert("Socket closed unexpectedly, please reload the page.");
};

document.querySelector("#chat-message-input").focus();
document.querySelector("#chat-message-input").onkeyup = function (e) {
  if (e.keyCode === 13) {
    // enter, return
    document.querySelector("#chat-message-submit").click();
  }
};

  // define how many messages sent for ids
  var message_count = 0
document.querySelector("#chat-message-submit").onclick = function (e) {
  var messageInputDom = document.querySelector("#chat-message-input");
  message_count += 1
  var message = messageInputDom.value;
  chatSocket.send(
    JSON.stringify({
      message: message,
      message_id: message_count
    })
  );

  messageInputDom.value = "";
};
