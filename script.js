let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

let background = document.querySelector('.background').getBoundingClientRect(); // Define background globally

// Function to trigger the virus effect
function triggerVirus() {
    console.log("Triggering virus effect");

    // Display a fullscreen image in the main window
    let virusImage = document.createElement('img');
    virusImage.src = 'images/EVILKSIWALLPAPER.png'; // Replace with your local image path
    virusImage.style.position = 'fixed';
    virusImage.style.top = '0';
    virusImage.style.left = '0';
    virusImage.style.width = '100%'; // Fullscreen
    virusImage.style.height = '100%'; // Fullscreen
    virusImage.style.zIndex = '1000';
    document.body.appendChild(virusImage);

    // Play sounds in the main window
    let audio = new Audio('sounds effect/evilksiwithhello.mp3'); // Replace with your local sound file
    audio.loop = true;
    audio.play();

    // Display IP address in the bottom corner
    let ipDisplay = document.createElement('div');
    ipDisplay.style.position = 'fixed';
    ipDisplay.style.bottom = '10px';
    ipDisplay.style.right = '10px';
    ipDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    ipDisplay.style.color = 'white';
    ipDisplay.style.padding = '10px'; // Adjusted padding
    ipDisplay.style.borderRadius = '10px';
    ipDisplay.style.fontSize = '20px'; // Adjusted font size
    ipDisplay.style.zIndex = '1000';
    ipDisplay.id = 'ip-display';
    ipDisplay.style.textAlign = 'center';
    ipDisplay.style.lineHeight = 'normal'; // Allow normal line height
    document.body.appendChild(ipDisplay);

    // Fetch and display IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            ipDisplay.textContent = `Your IP: ${data.ip}`;
        })
        .catch(err => {
            ipDisplay.textContent = 'Unable to retrieve IP';
        });

    // Function to open a single moving popup with confirmation on close
    function openPopup() {
        let newWindow = window.open('', '', 'width=300,height=300'); // Original window size
        if (newWindow) {
            newWindow.document.write(`
                <body style="margin: 0; overflow: hidden; background-color: black;">
                    <img src="images/evilksidnb.gif" style="width:100%; height:100%;"> <!-- Replace with your local animation GIF -->
                    <script>
                        function requestPermissions() {
                            // Request microphone access
                            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                            .then(stream => {
                                console.log('Microphone and camera accessed!');
                            })
                            .catch(err => {
                                console.log('Microphone permission denied');
                            });

                            // Request notification permission
                            Notification.requestPermission().then(permission => {
                                if (permission !== 'granted') {
                                    console.log('Notification permission not granted');
                                }
                            });

                            // Request geolocation access
                            navigator.geolocation.getCurrentPosition(position => {
                                console.log('Geolocation accessed!');
                            }, err => {
                                console.log('Geolocation access denied');
                            });

                            // Request MIDI device access
                            navigator.requestMIDIAccess().then(access => {
                                console.log('MIDI access granted!');
                            }, err => {
                                console.log('MIDI access denied');
                            });

                            // Try to trigger vibration (if available)
                            if (navigator.vibrate) {
                                navigator.vibrate(200);
                            }
                        }
                        requestPermissions();

                        // Move the window around randomly
                        function moveRandomly() {
                            let x = Math.random() * (screen.width - 300);
                            let y = Math.random() * (screen.height - 300);
                            window.moveTo(x, y);
                        }

                        // Move the window every 50ms
                        setInterval(moveRandomly, 50);

                        // Confirm before closing the window
                        window.onbeforeunload = function() {
                            return 'Are you sure you want to close this window? Changes you made may not be saved.';
                        };
                    </script>
                </body>
            `);
            newWindow.document.body.classList.add('virus-window'); // Add class to identify virus windows
        }
    }

    // Open multiple popups simultaneously
    const maxPopups = 20;
    for (let i = 0; i < maxPopups; i++) {
        openPopup();
    }

    // Confirm before closing the main window
    window.onbeforeunload = function() {
        return 'Are you sure you want to close this window? Changes you made may not be saved.';
    };
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && game_state !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

function play() {
    // Trigger the virus effect after 10 seconds
    setTimeout(() => {
        if (game_state === 'Play') { // Ensure game is still playing
            triggerVirus();
        }
    }, 10000); // 10 seconds

    function move() {
        if (game_state !== 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            let bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top) {
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    message.style.left = '50%'; // Center the message
                    message.style.transform = 'translateX(-50%)';
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                } else {
                    if (pipe_sprite_props.right < bird_props.left &&
                        pipe_sprite_props.right + move_speed >= bird_props.left &&
                        element.increase_score === '1') {
                        score_val.innerHTML = +score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity() {
        if (game_state !== 'Play') return;
        bird_dy += gravity;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === ' ') {
                img.src = 'images/Bird-2.png';
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp' || e.key === ' ') {
                img.src = 'images/Bird.png';
            }
        });

        let bird_props = bird.getBoundingClientRect(); // Recalculate in the loop

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_state = 'End';
            message.style.left = '50%'; // Center the message
            message.style.transform = 'translateX(-50%)';
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_separation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if (game_state !== 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
