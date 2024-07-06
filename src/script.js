const output = document.getElementById("output");

document.getElementById("start-button").addEventListener("click", () => {
    const usbVendorId = 0xabcd;
    navigator.serial
        .requestPort({ filters: [{ usbVendorId }] })
        .then(port => {
            readPort(port);
        }).catch(e => {
            alert("You need to select a port");
        })
})

async function readPort(port) {
    while (port.readable) {
        const reader = port.readable.getReader();
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    // |reader| has been canceled.
                    break;
                }

                output.innerText += "\n" + value;
            }
        } catch (error) {
            console.error(error);
        } finally {
            reader.releaseLock();
        }
    }


}