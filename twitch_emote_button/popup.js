import {woowakgood, vo_ine, jingburger, lilpaaaaaa, cotton__123, gesegugosegu, viichan6, all}  from "./emote.js"

const members = {
  'woowakgood': woowakgood,
  'vo_ine': vo_ine,
  'jingburger': jingburger,
  'lilpaaaaaa': lilpaaaaaa,
  'cotton__123': cotton__123,
  'gosegugosegu': gesegugosegu,
  'viichan6': viichan6,
  'all': all
}

const $buttons = document.querySelectorAll(".member")
const $emotes = document.querySelector("#emotes")
const $selected_emotes = document.querySelector("#selected_emotes")

// 멤버 버튼에 누르면 이모티콘 표시하는 이벤트리스너 추가
for (let button of $buttons) {
  button.addEventListener('click', function() {
    show_emotes(members[this.id])
  })
}

// storage에서 등록된 이모티콘 가져와서 미리보기에 넣기
chrome.storage.sync.get(['selected_emotes_list'], function(result){
  if (result.selected_emotes_list) {
    for (let emote of result.selected_emotes_list) {
      const button = document.createElement('button')
      button.setAttribute('class', 'emotes')
      button.classList.add('selected')
      button.setAttribute('name', emote)
      button.style.backgroundImage = `url('${members['all'][emote]}')`
      button.addEventListener('click', function() {
        remove(this)
      })
      $selected_emotes.appendChild(button)
    }
  } else {
    chrome.storage.sync.set({selected_emotes_list: []}, function() {
      console.log('selected_emotes_list storage 추가 완료')
    })
  }
})

// 멤버 버튼 누르면 이모티콘 표시
function show_emotes(member) {
  while($emotes.firstChild) {
    $emotes.firstChild.remove()
  }
  for (let emote in member) {
    const button = document.createElement('button')
    button.setAttribute('class', 'emotes')
    button.setAttribute('name', emote)
    button.style.backgroundImage = `url('${member[emote]}')`
    button.addEventListener('click', function() {
      select(this)
    })
    $emotes.appendChild(button)
  }
}

// 이모티콘 누르면 $selected_emotes, storage 에 넣어주기
function select(node) {
  let emote_name = node.name
  chrome.storage.sync.get(['selected_emotes_list'], function(result){
    if (result.selected_emotes_list) {
      let list = result.selected_emotes_list
      if (list.findIndex(element => element == emote_name) == -1) {
        list.push(emote_name)
        let copy = node.cloneNode(true)
        copy.classList.add('selected')
        copy.addEventListener('click', function() {
          remove(this)
        })
        $selected_emotes.appendChild(copy)    
        chrome.storage.sync.set({selected_emotes_list: list}, function() {
          console.log(`${node.name} 추가 완료`)
        })
      }
    }
  })
}

// 이모티콘 누르면 $selected_emotes, storage 에서 제거
function remove(node) {
  let emote_name = node.name
  chrome.storage.sync.get(['selected_emotes_list'], function(result){
    let list = result.selected_emotes_list
    if (list.findIndex(element => element == emote_name) > -1) {
      list.splice(list.findIndex(element => element == emote_name), 1)
      node.remove()
      chrome.storage.sync.set({selected_emotes_list: list}, function() {
        console.log(`${node.name} 제거 완료`)
      })
    }
  })
}
