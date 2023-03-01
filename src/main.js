import { scene, camera, renderer } from './scene.js';

// Initializing variables for recording
let isRecording = false;
let recordedBlobs = [];
let mediaRecorder;
let chunks = [];

// Setting up MediaRecorder to record the scene and microphone
const stream = renderer.domElement.captureStream(25);
const audioStream = navigator.mediaDevices.getUserMedia({ audio: true });
Promise.all([stream, audioStream])
	.then(([videoStream, audioStream]) => {
/** Creating an AudioContext and connecting the audioStream to it **/
		const audioContext = new AudioContext();
		const source = audioContext.createMediaStreamSource(audioStream);
		const audioDestination = audioContext.createMediaStreamDestination();
		source.connect(audioDestination);

		// Adding the audio track to the video stream
		videoStream.addTrack(audioDestination.stream.getAudioTracks()[0]);

		// Initializing the MediaRecorder with the video and audio stream
		mediaRecorder = new MediaRecorder(videoStream, { mimeType: 'video/webm' });
		mediaRecorder.ondataavailable = handleDataAvailable;
		mediaRecorder.onstop = handleStop;
	});

// Callback function to handle the data available event from MediaRecorder
function handleDataAvailable(event) {
	if (event.data && event.data.size > 0) {
		recordedBlobs.push(event.data);
	}
}

// Callback function to handle the stop event from MediaRecorder
function handleStop(event) {
	console.log('Recorded Blobs: ', recordedBlobs);
// Downloading the recorded video
	download();
}

// Function to start recording
function startRecording() {
	isRecording = true;
	recordedBlobs = [];
	mediaRecorder.start();
	console.log('MediaRecorder started', mediaRecorder);
}

// Function to stop recording
function stopRecording() {
	isRecording = false;
	mediaRecorder.stop();
}

// Function to download the recorded video
function download() {
	const blob = new Blob(recordedBlobs, { type: 'video/webm' });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	a.download = 'scene.mp4';
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 100);
}

// Adding event listeners to the start and stop buttons
document.getElementById('startButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);