document.addEventListener('DOMContentLoaded', function() {
    var scene = document.querySelector('a-scene');
    var splash = document.querySelector('#splash');
    scene.addEventListener('model-loaded', function (e) {
      splash.setAttribute('class',"fade-out")
      promise()
      .then(listen())
    });
});

promise = () =>{ 
  return new Promise(function(resolve) {
  setTimeout(() => resolve(splash.style.display = 'none'),2000)}
)}

  
let webchatWidgetOpen = () => {
 // console.log('listening',WebChat.isOpen());

  let widgetLauncher = document.querySelector(".rw-launcher");
  //console.log(document.querySelectorAll('button'));
  if(!WebChat.isOpen()){ 
    console.log('listening',WebChat.isOpen());
    moveCamera([4,4,0],[-12,33,5]);
    animateAvatar([1.5,3.5,-2]);
    widgetLauncher.addEventListener('click', function (){
      console.log('listening rw launcher',WebChat.isOpen()); 
        changeColor();
        moveCamera();
        animateAvatar();
        document.querySelector("#webchat").setAttribute("onclick","webchatWidgetOpen()")
    });
    document.querySelector("#webchat").removeAttribute("onclick"); 
    listen();
  }else if(WebChat.isOpen()){
    moveCamera();
    animateAvatar();
    listen();
  }
  
    
};



changeColor =(newColor=null) => {
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'blue'];
let colorToChangeTo = (newColor == null|undefined) ? (colors[Math.floor(Math.random() * colors.length)]) : newColor ;
document.querySelector('#cube').setAttribute('material',"color:"+ colorToChangeTo +"; opacity: 0.6")
}

moveCamera = (point=[0, 3.5 ,0],rotation=[0,0,0])=>{
  let rig = document.querySelector('#rig');
  rig.setAttribute('animation',"property:position; dir: alternate; dur: 1600; loop: false; to:"+point[0]+" "+point[1]+" "+point[2]);
  rig.setAttribute('animation__2',"property:rotation;  dur: 1600; to:"+rotation[0]+" "+rotation[1]+" "+rotation[2]);
  
}

animateAvatar = (point=[-1.0, 3, -4.8]) => {
  let avatar = document.querySelector('#cube');
  avatar.setAttribute('animation__2',"property:position; dur: 1600; loop: false; to:"+point[0]+" "+point[1]+" "+point[2]);
}
scaleEntity = (entity,transform) => {
  console.log('scale',transform+" "+transform+" "+transform);
  entity.setAttribute('scale',transform+" "+transform+" "+transform);
  schedule(100)
}

const schedule = time => new Promise((resolve) => setTimeout(resolve, time));
scaleAvatarSpeech = (lengthOfAnnimationChain,transform) => {
  let entity = document.querySelector("#cube");
  schedule(100)
  .then(() => scaleEntity(entity,transform) )
  .then(schedule(500)
  .then(() => scaleEntity(entity,1))
  );
  
} 



listen = () =>  { 
  var recognition;
  if(window.chrome){
  window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  window.SpeechGrammarList = window.webitSpeechGrammarList || window.SpeechGrammarList;
  recognition = new window.SpeechRecognition();
  }else{
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition;
  }
  

    
  if (!'SpeechRecognition' in window) {
      upgrade();
      console.error('speech not supported')
    } else {
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.start();
      console.log('Ready to receive input.');
      let i = 0;

      recognition.onresult = function(event) {
        var synth = window.speechSynthesis;
        var interim_transcript,final_transcript  = '';

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
            
            if(WebChat.isOpen()){
              document.querySelector('.rw-new-message').value = final_transcript;
              document.querySelector('.rw-send').disabled = false
              console.log(document.querySelector('.rw-send'));
              document.querySelector('.rw-send').click();
            }else{
                WebChat.send(final_transcript);
            }
          } else {
            if(WebChat.isOpen()){
              console.log(event.results[i][0].transcript)
              interim_transcript += (!event.results[i][0].transcript == undefined) ? event.results[i][0].transcript : "" ;
              document.querySelector('.rw-new-message').value += (!event.results[i][0].transcript == undefined) ? event.results[i][0].transcript : "" ; ;
            }
          }
        }   
      }
    }
  }


spokenReply = (message) => {
  
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();



  var synth = window.speechSynthesis;
  synth.resume();
  var utterThis = new SpeechSynthesisUtterance(message);

  utterThis.voice = (window.chrome) ? synth.getVoices()[3] : synth.getVoices()[0];

  utterThis.addEventListener('start', function () {
    count = 0;
    for (let index = 0; index < message.length; index++) {
    
    let scaleTo = message.charCodeAt(index);
    console.log(message[index]+" "+scaleTo);
   
   // scaleAvatarSpeech(count,(scaleTo/100)*2)
    count++

   
    };
  })  
  
  console.log("message: ",message,audioContext,synth,utterThis)
  utterThis.volume = 1;
  utterThis.pitch = 1;
  utterThis.rate = 1;
  synth.speak(utterThis);
 

  utterThis.onboundary = function(event) {
    console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.');
   }


  utterThis.onend = function(event) {
    console.log('Utterance has finished being spoken after ' + event.elapsedTime + ' milliseconds.');
    listen();
  }
}

  WebChat.default.init({
    selector: "#webchat",
    initPayload: "/get_started",
    customData: {"language": "en"}, 
    socketUrl: "https://digitalinterview.nz",
    socketPath: "/socket.io/",
    title: "Digital assistant",
    subtitle: "chat",
    docViewer:false,
    
    onSocketEvent:{
      'bot_uttered': (message) => {
        spokenReply(message.text);
       // (message.text == "Awesome! i love making frontend magic!") ? frontendMagic() : null ;
        console.log(message);
        //(message == "Bye" || message == "Cioa" || message == "Tschüss") ? WebChat.
      },
      'connect': () => {
        console.log('connection established');
        WebChat.close();
        WebChat.send({"user_uttered":"utter_greet"});
        }
      
    }
    
})
 
