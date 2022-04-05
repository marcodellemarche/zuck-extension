// content.js

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            let times = Array(3).fill(null).map((_, i) => i).map(i => {
                let res = '';
                document.querySelectorAll('iframe[id*=".jsp"]').forEach(iframe => {
                    const timeDivs = iframe.contentDocument.querySelectorAll('span.timestamp');
                    if (!!timeDivs && timeDivs.length > 0) res = timeDivs[i].innerText;
                })
                return res;
            });

            // times = [ '03:37', '13:11', '13:29' ];
            console.log(times)
            changeTimeLeft(times)

            chrome.runtime.sendMessage({ "message": "open_new_tab", "times": times });
        }
    }
);

function changeTimeLeft(times) {
    let [exitTime, minutesLeft] = computeExit(times);
    const prettyTime = `${exitTime.getHours()}:${exitTime.getMinutes() < 10 ? '0' + exitTime.getMinutes() : exitTime.getMinutes()}`;

    if (!document.getElementById('timeLeft')) {
        const header = document.querySelector('.gsfr_header_private_portlet');

        const newcontent = document.createElement('div');
        newcontent.innerHTML =
            '<span id="timeLeft" style="position: absolute; top: 5px; left: 0; right: 0; text-align: center; font-size: 2rem; font-family: Proxima Nova;"></span>';

        while (newcontent.firstChild) {
            header.appendChild(newcontent.firstChild);
        }
    }

    let text = '';
    let color = 'unset';
    if (minutesLeft < 0) {
        text = `Dai zio esci! Sono passate le ${prettyTime}`;
        color = 'green';
    } else if (minutesLeft < 10) {
        text = `${prettyTime} - mancano ${minutesLeft} minuti`;
        color = 'red';
    }
    else {
        text = `${prettyTime} - mancano ${minutesLeft} minuti`;
    }
    document.getElementById('timeLeft').innerText = text;
    document.getElementById('timeLeft').style.color = color;
}
