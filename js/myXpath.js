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
    }

    .ab-modal-item {
        height: 30px;
        line-height: 30px;
    }

    .ab-modal-confirm {
        width: 118px;
        height: 48px;
        line-height: 48px;
        background: #4285f4;
        border: 1px solid #4285f4;
        color: #fff;
        text-align: center;
        cursor: pointer;
        margin: 20px auto;
    }`;
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
        <input type="text">
      </div>
      <div class="ab-modal-item editHtml">
        <span>编辑HTML</span>
        <input type="text">
      </div>
      <div class="ab-modal-item remove">
        <span>删除元素</span>
      </div>
      <div class="ab-modal-item add">
        <span>添加元素</span>
      </div>
      <div class="ab-modal-confirm">确认</div>
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
        let $formEditText = $form.children('.editText').children('input')
        let $formEditHtml = $form.children('.editHtml').children('input')
        let $formRemove = $form.children('.remove').children()
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
          // 初始化
          (function(){
            $formFontSize.val('')
            $formFontColor.val('')
            $formBackground.val('')
            $formEditText.val('')
            $formEditHtml.val('')
          }())


          if (lastClick) $(lastClick).attr('is-click',false);
          lastClick = e.target;
          $(e.target).attr('is-click',true);
          domClick = lastClick;

          $('#ab-model').show();
  
          // 设置样式
          console.log($formFontSize)
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
            $(domClick).addClass('will-remove')
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
            if($formEditHtml.val()){
              $(domClick).html($formEditHtml.val())
            }
            if($(domClick).hasClass('will-remove')){
              $(domClick).remove()
            }
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