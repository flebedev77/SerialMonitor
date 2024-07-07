const output = document.getElementById("output");

document.getElementById("start-button").addEventListener("click", () => {
    listenForSerialDevice();
})
        
async function listenForSerialDevice() {
    var port, textEncoder, writableStreamClosed, writer, historyIndex = -1;
    const lineHistory = [];
    async function connectSerial() {
        try {
            // Prompt user to select any serial port.
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 115200 });
            let settings = {};

            textEncoder = new TextEncoderStream();
            writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
            writer = textEncoder.writable.getWriter();
            await listenToPort();
        } catch (e) {
            alert("Serial Connection Failed" + e);
        }
    }
    async function listenToPort() {
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();

        // Listen to data coming from the serial device.
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                // Allow the serial port to be closed later.
                console.log('[readLoop] DONE', done);
                reader.releaseLock();
                break;
            }
            // value is a string.
            parseData(value);
        }
    }
    await connectSerial();
}

function parseData(value) {
    output.innerText += "\n " + value;
}