document.addEventListener('DOMContentLoaded', initLamps);

async function initLamps() {
    try {
        // Replace with your API endpoint
        const response = await fetch('http://localhost:1337/api/tower-monitors');
        const respJson = await response.json();
        const monitors = respJson.data[0].values;
        if(Array.isArray(monitors)){
            monitors.forEach(v => {
                const { id, status, voltage, current } = v;

                // Update lamp status (change color based on status)
                const lampElement = document.getElementById(`lamp-${id}`);
                if (lampElement) {
                    lampElement.className = status === 'on' ? 'bg-yellow-400 h-full w-full' : 'bg-gray-400 h-full w-full';
                }

                // Update voltage
                const voltageElement = document.getElementById(`lamp-${id}-v`);
                if (voltageElement) {
                    voltageElement.textContent = `${voltage} V`;
                }

                // Update current
                const currentElement = document.getElementById(`lamp-${id}-a`);
                if (currentElement) {
                    currentElement.textContent = `${current} A`;
                }
            });
        }
    } catch (error) {
      console.error('Error initializing table data:', error);
      alert('Failed to load initial table data. Please try again later.');
    }
  }

// Connect to the WebSocket server
const ws = new WebSocket('ws://localhost:1337'); // Adjust URL if needed

// Log connection status
ws.onopen = () => console.log('Connected to WebSocket server');
ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
    turnOffLamps();
};
ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    turnOffLamps();
}

// Display messages from the server
ws.onmessage = (event) => {
    // Parse the received JSON
    const data = JSON.parse(event.data);
    if(data.time){
        console.log(event.data);
    }else{
        if(data.type === "controlInfo"){
            const {values} = data;
            if(Array.isArray(values)){
                values.forEach(v => {
                    const { id, status, voltage, current } = v;
        
                    // Update lamp status (change color based on status)
                    const lampElement = document.getElementById(`lamp-${id}`);
                    if (lampElement) {
                        lampElement.className = status === 'on' ? 'bg-yellow-400 h-full w-full' : 'bg-gray-400 h-full w-full';
                    }
        
                    // Update voltage
                    const voltageElement = document.getElementById(`lamp-${id}-v`);
                    if (voltageElement) {
                        voltageElement.textContent = `${voltage} V`;
                    }
        
                    // Update current
                    const currentElement = document.getElementById(`lamp-${id}-a`);
                    if (currentElement) {
                        currentElement.textContent = `${current} A`;
                    }
                });
            }
        }
    }
};

window.ws = ws;


const turnOffLamps = () => {
    [1,2,3,4].forEach(id => {
        // Update lamp status (change color based on status)
        const lampElement = document.getElementById(`lamp-${id}`);
        if (lampElement) {
            lampElement.className = 'bg-gray-400 h-full w-full';
        }

        // Update voltage
        const voltageElement = document.getElementById(`lamp-${id}-v`);
        if (voltageElement) {
            voltageElement.textContent = "0 V";
        }

        // Update current
        const currentElement = document.getElementById(`lamp-${id}-a`);
        if (currentElement) {
            currentElement.textContent = "0 A";
        }
    });
}