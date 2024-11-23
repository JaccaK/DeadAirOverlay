// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
//const { contextBridge, ipcRenderer} = require("electron")

window.addEventListener('DOMContentLoaded', () => {
	const TIMER = document.getElementById("timer");

	setInterval(updateTimer, 100)
	var counter = 0
	var seconds = 0
	async function updateTimer() {
		updateColor()
		TIMER.innerText = `🎙️${seconds}`
		if (counter++ >= 10){
			seconds++
			counter = 0
		}
	}
	async function updateColor(){
		TIMER.style.color = 'green'
		if (seconds >= 5) {
			TIMER.style.color = "yellow"
		}
		if (seconds >= 15) {
			TIMER.style.color = 'red'
		}
	}
	async function resetTimer(){
		counter = 0
		seconds = 0
		updateColor()
	}
	
	// Original code taken from https://stackoverflow.com/a/46781986 by user Kaiido
	// Modified because we don't care about minimum time. May modify again for console args for min_decibels.
	function detectSilence(
		stream,
		onSoundEnd = _=>{},
		onSoundStart = _=>{},
		min_decibels = -100
		) {
		const ctx = new AudioContext();
		const analyser = ctx.createAnalyser();
		const streamNode = ctx.createMediaStreamSource(stream);
		streamNode.connect(analyser);
		analyser.minDecibels = min_decibels;
	  
		const data = new Uint8Array(analyser.frequencyBinCount); // will hold our data
		let triggered = false; // trigger only once per silence event
	  
		function loop(time) {
		  requestAnimationFrame(loop); // we'll loop every 60th of a second to check
		  analyser.getByteFrequencyData(data); // get current data
		  if (data.some(v => v)) { // if there is data above the given db limit
			if(triggered){
			  triggered = false;
			  onSoundStart();
			  }
		  }
		  if (!triggered) {
			onSoundEnd();
			triggered = true;
		  }
		}
		loop();
	  }
	  
	  function onSilence() {
		//console.log('silence');
		
	  }
	  function onSpeak() {
		//console.log('speaking');
		resetTimer()
	  }
	  
	  navigator.mediaDevices.getUserMedia({
		  audio: true
		})
		.then(stream => {
		  detectSilence(stream, onSilence, onSpeak);
		  // do something else with the stream
		})
		.catch(console.error);
})