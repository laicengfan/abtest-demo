function loadJS( url, callback ){

    var script = document.createElement('script'),

        fn = callback || function(){};

    script.type = 'text/javascript';

    

    //IE

    if(script.readyState){

        script.onreadystatechange = function(){

            if( script.readyState == 'loaded' || script.readyState == 'complete' ){

                script.onreadystatechange = null;

                fn();

            }

        };

    }else{

        //其他浏览器

        script.onload = function(){

            fn();

        };

    }

    script.src = url;

    document.getElementsByTagName('head')[0].appendChild(script);

}

loadJS('./lib/jquery.min.js',function(){
    loadJS('./lib/wgxpath.install.js',function(){
        loadJS('./lib/jquery-path-1.0.7.js',function(){
            addStyles();
            mainInit();
        })
    });
});

let addStyles = function(){
    // 或者插入新样式时操作
    var styleEl = document.createElement('style');
    //styleSheet = styleEl.style;
    styleEl.innerHTML = `[is-hover="true"] {
        background-color: rgba(0, 0, 0, 0.1);
    }
    [is-hover="true"] {
        background-color: rgba(0, 0, 0, 0.1);
    }
    .ab-modal {
        padding: 20px;
        box-shadow: 0 6px 10px 0 rgb(115 124 139 / 15%);
        position: fixed;
        bottom: 50px;
        right: 0;
        z-index: 9;
        background:#fff;
    }

    .ab-modal-item {
        width:100%;
        display:flex;
        margin-bottom: 20px;
    }
    .ab-modal-item span{
      margin-right:10px;
    }
    .ab-modal-btn{
      display:flex;
    }
    .ab-modal-confirm {
        width: 118px;
        height: 48px;
        line-height: 48px;
        background: #4285f4;
        color: #fff;
        text-align: center;
        cursor: pointer;
        margin: 20px 10px;
    }
    .ab-modal-remove {
      width: 118px;
      height: 48px;
      line-height: 48px;
      background: #e9ebf3;
      color: #737c8b;
      text-align: center;
      cursor: pointer;
      margin: 20px 10px;
  }
    `;
    document.head.appendChild(styleEl);  
    return;

}

let addPopDiv = function(){
    let popDiv = `
    <div class="ab-modal">
      <div class="ab-modal-item fontSize">
        <span>字体大小</span>
        <input type="text">
      </div>
      <div class="ab-modal-item fontColor">
        <span>字体颜色</span>
        <input type="text">
      </div>
      <div class="ab-modal-item background">
        <span>背景颜色</span>
        <input type="text">
      </div>
      <div class="ab-modal-item editText">
        <span>编辑内容</span>
        <textarea type="text" rows="5" cols="30"></textarea>
      </div>
      <div class="ab-modal-item editHtml">
        <span>编辑HTML</span>
        <textarea type="text" rows="5" cols="30"></textarea>
      </div>
      <div class="ab-modal-item add">
        <span>添加元素</span>
      </div>
      <div class="ab-modal-btn">
        <div class="ab-modal-confirm">确认</div>
        <div class="ab-modal-remove">删除元素</div>
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
        addPopDiv();

        let lastHover = undefined;
        let lastClick = undefined;
        let xpathClick = undefined;
        let domClick = undefined;
        // 表单
        let $form = $('.ab-modal')
        let $formFontSize = $form.children('.fontSize').children('input')
        let $formFontColor = $form.children('.fontColor').children('input')
        let $formBackground = $form.children('.background').children('input')
        let $formEditText = $form.children('.editText').children('textarea')
        let $formEditHtml = $form.children('.editHtml').children('textarea')
        let $formRemove = $form.children('.ab-modal-remove')
        let $formAdd = $form.children('.add').children('input')
        
        let mainDataArray = new Array();

        // let mainData = {
        //   xpath: "//html/body/p[@class='ddd']",
        //   style: {
        //     'fontSize': '30px',
        //     'color': 'blue',
        //     'backgroundColor': 'red'
        //   }
        // };
  
        $('.ab').mousemove(function (e) {
        
          if (lastHover) $(lastHover).attr('is-hover',false);
          lastHover = e.target;
          $(e.target).attr('is-hover',true);
        });

        $('.ab').click(function (e) {

          if (lastClick) $(lastClick).attr('is-click',false);$(lastClick).removeClass('is-click');
          lastClick = e.target;
          $(e.target).attr('is-click',true);
          $(e.target).addClass('is-click');
          
          domClick = lastClick;

          $('#ab-model').show();

          // 初始化
          (function(){
            $formFontSize.val('')
            $formFontColor.val('')
            $formBackground.val('')
            // 填入text信息
            $formEditText.val($(domClick).text())
            // 填入html信息
            $formEditHtml.val(domClick.outerHTML)
          }())
  
          // 设置样式
          console.log(domClick)
          $formFontSize.bind('keyup', function () {
            console.log($(this).val())
          })
          $formFontColor.bind('keyup', function () {
            console.log($(this).val())
          })
          $formBackground.bind('keyup', function () {
            console.log($(this).val())
          })
          $formEditText.bind('keyup', function () {
            console.log($(this).val())
          })
          $formEditHtml.bind('keyup', function () {
            console.log($(this).val())
          })
          $formRemove.bind('click', function () {
            $(domClick).remove()
            // $(domClick).addClass('will-remove')
          })
  
          // debugger;

          return false;

        });

        $(".ab-modal-confirm").bind('click', function () {
            // 改变DOM样式
            $(domClick).css({
              'font-size': $formFontSize.val(),
              'color': $formFontColor.val(),
              'background-color': $formBackground.val()
            })
            // 改变DOM属性
            if($formEditText.val()){
              $(domClick).text($formEditText.val())
            }
            console.log("before:",domClick)
            if($formEditHtml.val()){
              // doNotTrack.html($formEditHtml.val())
              //domClick.outerHTML = $formEditHtml.val()


              let newDiv = document.createElement('div');
              newDiv.innerHTML = $formEditHtml.val();
              // newDiv.id = 'abc';
              $(newDiv).children().attr('id','abc')
              $(domClick).after($(newDiv).children());
              $(domClick).remove()
              // domClick = document.createElement($formEditHtml.val())
              // domClick = document.createElement("p")
              //domClick.setAttribute("id","abc")
              //$(domClick)[0].id='abc';
              domClick = document.getElementById('abc')
              //domClick = $($formEditHtml.val())[0]
              console.log(domClick);
            }
            console.log("after:",domClick)

            // if($(domClick).hasClass('will-remove')){
            //   $(domClick).remove()
            // }
            let xpath = getXPath(domClick);
            console.log('xpath' + xpath);

            let mainData ={
                xpath:xpath
            };
            mainData.style = {
              'fontSize': $formFontSize.val(),
              'color': $formFontColor.val(),
              'backgroundColor': $formBackground.val()
            }
            mainData.attr = {
              'text': $formEditText.val(),
              'html': $formEditHtml.val(),
            }

            console.log(mainData)

            mainDataArray.push(mainData);

            console.log(JSON.stringify(mainDataArray));
          })

  
        let getXPath = function (event) {
          let xpath = $(event).getQuery({
            _document: $(window.document)
          });
          xpath = xpath.replace(/\"/g, "'");
          return xpath;
        };
  
  
      };