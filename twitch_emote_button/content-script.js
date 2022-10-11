let nowURL = window.location.href;
let timer;

// URL 바뀌었는지 체크하는 interval
function interval() {
    setInterval(()=>{
        if (nowURL != window.location.href) {
            for (let i=0; i<=timer; i++) {
                clearTimeout(i)
            }
            nowURL = window.location.href
            timer = setTimeout(() => {
                main()
            }, 6000)
            interval()
        }
    }, 1000)
}

// window.onload 후 6초 후 실행 -> 이모티콘 로딩 되면 알아서 실행되게 변경 필요
window.onload =  function() {
    interval()
    timer = setTimeout(() => {
        main()
    }, 6000)
}

// storage에서 선택한 이모티콘 리스트 가져오고 표시
function main() {
    const emotelist = []
    new Promise((resolve, reject)=>{
        chrome.storage.sync.get(['selected_emotes_list'], function(result){
            for (let emote of result.selected_emotes_list) {
                emotelist.push(emote)
            }
            resolve()
        })
    }).then(()=> {
        const chatdiv = document.querySelector(".chat-room__content")
        const chatinputdiv = document.querySelector(".chat-input")
        const emotediv = document.createElement('div')
        if (emotelist.length % 9 == 0) {
            emotediv.style.height = `${parseInt(emotelist.length / 9)  * 36.6}px`
        } else {
            emotediv.style.height = `${(parseInt(emotelist.length / 9) + 1) * 36.6}px`
        }
        emotediv.style.width = '340px'
        emotediv.style.paddingLeft = '5px'
        emotediv.style.paddingRight = '5px'
        emotediv.style.borderTop = '1px rgb(229, 229, 229) solid'
        emotediv.style.display = 'flex'
        emotediv.style.flexWrap = 'wrap'
        chatdiv.insertBefore(emotediv, chatinputdiv)
    
        const emote_popup_button = document.querySelector("[data-a-target='emote-picker-button']")
        emote_popup_button.click()
        emote_popup_button.click()
    
        for (let emote_name of emotelist) {
            let emote_button = document.querySelector(`[name="${emote_name}"]`)
            if (emote_button){
                let copy = emote_button.cloneNode(true)
                copy.addEventListener('click', function() {
                    emote_button.click()
                })
                copy.style.width = '36.6px'
                copy.style.height = '36.6px'
                emotediv.appendChild(copy)
            }
        }
    })
};