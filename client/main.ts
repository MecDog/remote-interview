/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />
import * as io from 'socket.io-client'
import * as $ from 'jquery'

let roomId =(new URLSearchParams(window.location.search.slice(1))).get('room')
if(roomId){
  $('#entry').hide();
  $('#main').show();
  loadEditor(decodeURIComponent(roomId));
} else {
  $('#entry').show();
  $('#main').hide();
}

function loadEditor(roomId: string) {
  (window as any).require(['vs/editor/editor.main'], function() {
    let $container = $('#container')
    $container.height(window.innerHeight - 53)
    let editor = monaco.editor.create($container[0], {
      value: [
        ''
      ].join('\n'),
      language: 'javascript',
      theme: 'vs-dark',
    })
    let model = editor.getModel()
    let socket = io('//localhost:3001/',{
      path:'/showCode',
      query:{
        room:roomId
      }
    })
    let log = console.log
    let cursor =$('#cursor')
    // 监听语言项是否改变
    document.querySelector('#language-select')!.addEventListener('change', (e) => {
      let val: string = (e.target as any).value
      monaco.editor.setModelLanguage(model, val)
    })
    // 代码改变
    editor.onDidChangeModelContent((e) => {
      if(e.isFlush) return
      let content = editor.getValue()
      let cursor = editor.getPosition()
      socket.emit('codeChange', {val:content,cursor})
    })
    socket.on('codeChange', function (data: any) {
      editor.setValue(data.val)
      editor.setPosition(data.cursor)
    })
  
    // 鼠标移动
    editor.onMouseMove((e) => {
      socket.emit('mouseMove',{x:e.event.posx,y:e.event.posy-70})
    })
    socket.on('mouseMove', function (data: any) {
      log('socket1被触发')
      cursor.css('transform',`translate(${data.x}px,${data.y}px)`)
    })
  
      // 光标改变
    socket.on('cursorChange',function(data:any){
      editor.setPosition(data)
    })
    editor.onDidChangeCursorPosition((e)=>{
      if(e.reason == 3) {
        socket.emit('cursorChange', e.position)
      }
    })
    socket.on('message',function (msg:string) {
      alert(msg)
    })
  })
}