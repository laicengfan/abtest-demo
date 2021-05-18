function loadJS(url, callback) {

  var script = document.createElement('script'),

    fn = callback || function () {};

  script.type = 'text/javascript';



  //IE

  if (script.readyState) {

    script.onreadystatechange = function () {

      if (script.readyState == 'loaded' || script.readyState == 'complete') {

        script.onreadystatechange = null;

        fn();

      }

    };

  } else {

    //其他浏览器

    script.onload = function () {

      fn();

    };

  }

  script.src = url;

  document.getElementsByTagName('head')[0].appendChild(script);

}

let mainInitN = function (renderData) {

  let mainDataArray = renderData
  console.group("子页面的localStorage：", JSON.parse(localStorage.mainDataArray))

  let findElementByXpath = function (xpath) {
    let element;

    element = $.xpath(xpath, window.document);

    return element
  };

  console.log("渲染子页面时被历史操作修改后的数据：", mainDataArray)

  const memoryHtml = (mainData) => {
    // if(mainData.type === 'insert'){
    //   $('.')
    // }

  }

  let render = function (mainData) {
    let xele = findElementByXpath(mainData.xpath);
    for(let i=0; i<xele.length; i++){
      switch (mainData.type) {
        case 'style':
          for (const key in mainData.style) {
            if (mainData.style.hasOwnProperty(key)) {
              const value = mainData.style[key];
              $(xele)[i].style[key] = value;
            }
          }
          break;
        case 'text': // 替换文本内容
          $(xele).text(mainData.text);
          break;
        case 'html':
          $(xele).replaceWith(mainData.html);
          break;
        case 'insert': // 插入增加的html
          if (mainData.add.insertDirection === 'before') {
            $(xele).before(mainData.add.html)
          } else {
            $(xele).after(mainData.add.html)
          }
          break;
        case 'remove': // 删除元素
          if (mainData.removeFlag) {
            $(xele).css('display', 'none')
          }
          case 'runJs':
            eval(mainData.js)
            break;
      }
    }
  }

  for (let index = 0; index < mainDataArray.length; index++) {
    const element = mainDataArray[index];
    render(element);
  }

  //render(mainData0);

}

const avtiveBtn = `
  <div class="paab-btn fixed active" style="box-sizing: border-box;
  background-image: none;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  color: rgba(0, 0, 0, .85);
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  height: 32px;
  line-height: 1.5715;
  padding: 4px 15px;
  position: relative;
  text-align: center;
  touch-action: manipulation;
  transition: all .3s cubic-bezier(.645, .045, .355, 1);
  position:fixed;
  top:100px;
  left:0;
  background: #4285f4;
  border-color: #4285f4;
  color: #fff;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  white-space: nowrap;">
    <span>应用</span>
  </div>
`
document.write(avtiveBtn)

let mainDataArray = JSON.parse(localStorage.mainDataArray)
document.querySelector('.active').onclick = () => {
  PAABTestApp.render(mainDataArray);
}

let PAOptionsApp = {
  basePath: 'https://laicengfan.github.io/abtest-demo',
}

window.addEventListener("message", receiveMessageApp, false);

function receiveMessageApp(event) {
  if (event.data.method == 'save') {
    console.log('我收到了父页面的通讯')
    let mainDataArray = JSON.parse(localStorage.mainDataArray)
    document.querySelector('.active').onclick = () => {
      PAABTestApp.render(mainDataArray);
    }
    // console.log("event.data.method == render：",event.data.content)
  } else if (event.data.method == 'history-render') {
    PAABTestApp.render(mainDataArray);
    // console.log("event.data.method == history-render：",event.data.content)
  }
  else if(event.data.method === 'delete'){
    // 同步被删除操作后的数据
    mainDataArray = JSON.parse(localStorage.mainDataArray)
    PAABTestApp.render(mainDataArray);
  }


  // For Chrome, the origin property is in the event.originalEvent
  // object.
  // 这里不准确，chrome没有这个属性
  // var origin = event.origin || event.originalEvent.origin;
  var origin = event.origin
  // if (origin !== PAOptionsApp.basePath)
  //   return;

  // ...
}

let PAABTestApp = {
  render: (renderData) => {
    loadJS(PAOptionsApp.basePath + '/lib/jquery.min.js', function () {
      loadJS(PAOptionsApp.basePath + '/lib/wgxpath.install.js', function () {
        loadJS(PAOptionsApp.basePath + '/lib/jquery-path-1.0.7.js', function () {
          mainInitN(renderData);
        })
      });
    });
  }
}