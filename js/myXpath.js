function loadJS(url, callback) {

  /* TODO
  1.runjs
  2.dom元素的样式属性
  3.demo样式优化
  4.操作历史记录先展示
  5.历史记录的编辑与删除
  6.跨域页面的引入修改 */

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


// loadJS('./lib/jquery.min.js', function () {
//   loadJS('./lib/wgxpath.install.js', function () {
//     loadJS('./lib/jquery-path-1.0.7.js', function () {
//       addStyles();
//       mainInit();
//     })
//   });
// });

let addStyles = function () {
  let head = document.getElementsByTagName('head')[0]
  let link = document.createElement('link')
  link.href = PAOptions.basePath + '/scss/index.css'
  link.rel = 'stylesheet'
  link.type = 'text/css'
  head.appendChild(link)

  return;

}

let addPopDiv = function () {
  let popDiv = `
  <div class="ab-modal">
      <div>
        <div class="ab-model-item-wrap">
          <span>xpath路径：</span>
          <input class="ab-ip-xpath" id="ab-ip-xpath" />
        </div>
      </div>
      <div class="ab-model-item ab-edit-type">
        <div class="ab-model-item-wrap">
          <span>操作类型：</span>
          <select id="am-select" value="style">
            <span>类型</span>
            <option value="style">style</option>
            <option value="text">edit text</option>
            <option value="html">edit html</option>
            <option value="insert">insert html</option>
            <option value="remove">remove</option>
            <option value="runJs">run javascript</option>
          </select>
        </div>
      </div>
      <div class="ab-modal-item fontSize" type="style">
        <div class="ab-model-item-wrap">
          <span>字体大小：</span>
          <input type="text">
        </div>
      </div>
      <div class="ab-modal-item fontColor" type="style">
        <div class="ab-model-item-wrap">
          <span>字体颜色：</span>
          <input type="text">
        </div>
      </div>
      <div class="ab-modal-item background" type="style">
        <div class="ab-model-item-wrap">
          <span>背景颜色：</span>
          <input type="text">
        </div>
      </div>
      <div class="ab-modal-item editText" type="text">
        <div class="ab-model-item-wrap">
          <span>编辑内容：</span>
          <textarea type="text" rows="5" cols="30"></textarea>
        </div>
      </div>
      <div class="ab-modal-item editHtml" type="html">
        <div class="ab-model-item-wrap">
          <span>编辑HTML：</span>
          <textarea type="text" rows="5" cols="30"></textarea>
        </div>
      </div>
      <div class="ab-modal-item runJs" type="runJs">
        <div class="ab-model-item-wrap">
          <span>编辑JS：</span>
          <textarea type="text" rows="5" cols="30"></textarea>
        </div>
        <div class="ab-modal-item add" type="insert">
          <div class="ab-model-item-wrap">
            <span>添加元素：</span>
            <textarea id="am-tt-add" type="text" rows="5" cols="30"></textarea>
            <select id="am-select-direct" value="before">
              <span>方向</span>
              <option value="before">before</option>
              <option value="after">after</option>
            </select>
          </div>
        </div>
      </div>
      <div class="ab-modal-item remove" type="remove">
        <div class="ab-model-item-wrap">
          <div class="ab-modal-remove">删除元素</div>
        </div>
      </div>
      <div class="ab-modal-btn">
        <div class="ab-modal-confirm">确认</div>
      </div>
    </div>
  `;

  let div = document.createElement('div');
  div.id = 'ab-model';
  div.style.display = 'none';
  div.innerHTML = popDiv;
  document.body.appendChild(div);
}

let mainInit = function () {
  alert('sdk初始化成功！');
  addPopDiv();

  let lastHover = undefined;
  let lastClick = undefined;
  let xpathClick = undefined;
  let domClick = undefined;
  // 表单
  let $form = $('.ab-modal')
  let $formFontSize = $form.children('.fontSize').find('input')
  let $formFontColor = $form.children('.fontColor').find('input')
  let $formBackground = $form.children('.background').find('input')
  let $formEditText = $form.children('.editText').find('textarea')
  let $formEditHtml = $form.children('.editHtml').find('textarea')
  let $formRunJs = $form.children('.runJs').find('textarea')
  let $formRemove = $('.ab-modal-remove')
  let $formAdd = $form.children('.add').find('textarea')
  let $formAddBefore = $form.children('.add').find('.ab-modal-insert.before')
  let $formAddAfter = $form.children('.add').find('.ab-modal-insert.after')
  // 移除标志
  let removeFlag = false
  // 插入html方向
  let insertDirection = ''
  let mainDataArray = new Array();

  // let mainData = {
  //   xpath: "//html/body/p[@class='ddd']",
  //   style: {
  //     'fontSize': '30px',
  //     'color': 'blue',
  //     'backgroundColor': 'red'
  //   }
  // };
  let currentType = 'style';
  let currentXpath = '';

  $('.ab-modal-item').hide();
  $('.ab-modal-item[type="' + currentType + '"]').show();

  $('#am-select').change(function () {
    currentType = $(this).children('option:selected').val()
    $('.ab-modal-item').hide();
    $('.ab-modal-item[type="' + currentType + '"]').show();
  });


  $(document.body).mousemove(function (e) {

    if($(e.target).parents('.ab-modal').length > 0)
    {
      return;
    }
    if (lastHover) $(lastHover).attr('is-hover', false);
    lastHover = e.target;
    $(e.target).attr('is-hover', true);
  });

  $(document.body).click(function (e) {
    if($(e.target).parents('.ab-modal').length > 0)
    {
      return;
    }
    removeFlag = false
    if (lastClick) $(lastClick).attr('is-click', false);
    lastClick = e.target;
    $(e.target).attr('is-click', true);

    domClick = lastClick;

    $('#ab-model').show();

    let xpath = getXPath(domClick);
    currentXpath = xpath;
    $('#ab-ip-xpath').val(xpath);

    // 默认填入的信息
    let initialInfo = {
      style: {
        fontSize: window.getComputedStyle(domClick).fontSize,
        fontColor: window.getComputedStyle(domClick).color,
        backgroundColor: window.getComputedStyle(domClick).backgroundColor,
      },
      text: $(domClick).text(),
      html: domClick.outerHTML
    }

    // 初始化
    const setInit = function (initialInfo) {
      $formFontSize.val(initialInfo.style.fontSize)
      $formFontColor.val(initialInfo.style.fontColor)
      $formBackground.val(initialInfo.style.backgroundColor)
      // 填入text信息
      $formEditText.val(initialInfo.text)
      // 填入html信息
      $formEditHtml.val(initialInfo.html)
      $formAdd.val('')
    }

    setInit(initialInfo)
    console.log(initialInfo)
    return false;

  });

  // 编辑操作面板
  const editPanel = () => {
    // 设置样式
    $formFontSize.bind('keyup', function () {
      // console.log($(this).val())
    })
    $formFontColor.bind('keyup', function () {
      // console.log($(this).val())
    })
    $formBackground.bind('keyup', function () {
      // console.log($(this).val())
    })
    // 修改文本
    $formEditText.bind('keyup', function () {
      // console.log($(this).val())
    })
    // 修改html
    $formEditHtml.bind('keyup', function () {
      // console.log($(this).val())
    })
    // 移除元素
    $formRemove.bind('click', function () {
      $(domClick).css('display', 'none')
      removeFlag = true
      // $(domClick).addClass('will-remove')
    })
    // 往前插入
    $formAddBefore.bind('click', function () {
      let $insertElement = $($formAdd.val())[0]
      $(domClick).before($insertElement)
      insertDirection = 'before'
    })
    // 往后插入
    $formAddAfter.bind('click', function () {
      let $insertElement = $($formAdd.val())[0]
      $(domClick).after($insertElement)
      insertDirection = 'after'
    })
  }

  editPanel()

  let findElementByXpath = function (xpath) {
    let element;

    element = $.xpath(xpath, window.document);

    return element
  };


  let doABTestRender = function (mainData) {
    let domClick = findElementByXpath(mainData.xpath);
    switch (mainData.type) {
      case 'style':
        // 改变DOM样式
        $(domClick).css({
          'font-size': mainData.style['font-size'],
          'color': mainData.style['color'],
          'background-color': mainData.style['background-color']
        })
        break;
      case 'text':
        $(domClick).text(mainData.text);
        break;
      case 'html':
        $(domClick).replaceWith(mainData.html);
        break;
      case 'remove':
        break;
      case 'insert':
        if (mainData.add.insertDirection == 'before') {
          $(domClick).before(mainData.add.html)
        } else {
          $(domClick).after(mainData.add.html)
        }
        break;
    }
  };

  $(".ab-modal-confirm").bind('click', function () {
    let mainData = {
      type: currentType,
      xpath: currentXpath
    }

    switch (currentType) {
      case 'style':
        mainData.style = {
          'font-size': $formFontSize.val(),
          'color': $formFontColor.val(),
          'background-color': $formBackground.val()
        };
        break;
      case 'text': // 改变DOM text
        mainData.text = $formEditText.val();
        break;
      case 'html':
        mainData.html = $formEditHtml.val();
        break;
      case 'remove':
        mainData.removeFlag = removeFlag;
        break;
      case 'insert':
        mainData.add = {
          insertDirection: $('#am-select-direct').val(), // 插入方向
          html: $('#am-tt-add').val()
        };
      case 'runJs':
        mainData.js = $formRunJs.val()
        eval(mainData.js)
        break;
    }

    doABTestRender(mainData);


    // console.log("before:", domClick)
    /* if ($formEditHtml.val()) {
      // doNotTrack.html($formEditHtml.val())
      //domClick.outerHTML = $formEditHtml.val()


      let newDiv = document.createElement('div');
      newDiv.innerHTML = $formEditHtml.val();
      // newDiv.id = 'abc';
      $(newDiv).children().attr('id', 'abc')
      $(domClick).after($(newDiv).children());
      $(domClick).remove()
      // domClick = document.createElement($formEditHtml.val())
      // domClick = document.createElement("p")
      //domClick.setAttribute("id","abc")
      //$(domClick)[0].id='abc';
      domClick = document.getElementById('abc')
      //domClick = $($formEditHtml.val())[0]
      console.log(domClick);
    } */

    // console.log("after:", domClick)

    // if($(domClick).hasClass('will-remove')){
    //   $(domClick).remove()
    // }

    // let xpath = getXPath(domClick);
    // console.log('xpath' + xpath);

    // let mainData = {
    //   xpath: xpath,
    //   style: {
    //     'fontSize': $formFontSize.val(),
    //     'color': $formFontColor.val(),
    //     'backgroundColor': $formBackground.val()
    //   },
    //   // 标签内容
    //   text: $formEditText.val(),
    //   // 移除标志
    //   removeFlag:removeFlag,
    //   // 插入html
    //   add: {
    //     // 插入方向
    //     insertDirection: insertDirection,
    //     html: $formAdd.val()
    //   },
    //   // Todo判断是不是单个元素的重复修改
    //   // againFlag: false

    // };
    // mainData.attr = {
    //   'text': $formEditText.val(),
    //   'html': $formEditHtml.val(),
    // }

    mainDataArray.push(mainData);

    let userStorage = window.localStorage
    if (!window.localStorage) {
      alert('浏览器版本过低，保存功能不支持')
    } else {
      userStorage.setItem('mainDataArray', JSON.stringify(mainDataArray))
    }
    console.log(userStorage)
    console.log(mainDataArray);
  })


  let getXPath = function (event) {
    let xpath = $(event).getQuery({
      _document: $(window.document)
    });
    xpath = xpath.replace(/\"/g, "'");
    return xpath;
  };


};


let PAOptions = {
  basePath : 'https://laicengfan.github.io/abtest-demo'
}


window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{
  if(event.data.method == 'check-sdk')
  {
    window.parent.postMessage({
      method:'check-sdk-ok'
    },'*');
  }
  else if(event.data.method == 'start')
  {
    PAABTest.start();
  }

  // For Chrome, the origin property is in the event.originalEvent
  // object.
  // 这里不准确，chrome没有这个属性
  // var origin = event.origin || event.originalEvent.origin;
  var origin = event.origin
  // if (origin !== PAOptions.basePath)
  //   return;

  // ...
}


let PAABTest = {
  start : () => {
    loadJS(PAOptions.basePath + '/lib/jquery.min.js', function () {
      loadJS(PAOptions.basePath + '/lib/wgxpath.install.js', function () {
        loadJS(PAOptions.basePath + '/lib/jquery-path-1.0.7.js', function () {
          addStyles();
          mainInit();

        })
      });
    });
  }
}