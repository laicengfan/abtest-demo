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

loadJS('./lib/jquery.min.js', function () {
  loadJS('./lib/wgxpath.install.js', function () {
    loadJS('./lib/jquery-path-1.0.7.js', function () {
      mainInitN();
    })
  });
});

let mainInitN = function () {

  // let mainDataArray = [{
  //   "xpath": "//html/body/div[@class='ab']/button[1]",
  //   "style": {
  //     "fontSize": "20px",
  //     "color": "red",
  //     "backgroundColor": "blue"
  //   }
  // }, {
  //   "xpath": "//html/body/div[@class='ab']/button[2]",
  //   "style": {
  //     "fontSize": "30px",
  //     "color": "yellow",
  //     "backgroundColor": "gray"
  //   }
  // }];
  let mainDataArray = JSON.parse(localStorage.mainDataArray)
  console.log(JSON.parse(localStorage.mainDataArray))
  console.log(typeof localStorage.mainDataArray)
  // let mainData0 = {
  //     xpath: "//html/body/div[@class='ab']/p[@class='ddd']",
  //     style: {
  //       'fontSize': '30px',
  //       'color': 'blue',
  //       'backgroundColor': 'red'
  //     }
  //   };


  let findElementByXpath = function (xpath) {
    let element;

    element = $.xpath(xpath, window.document);

    return element
  };;


  let render = function (mainData) {
    let xele = findElementByXpath(mainData.xpath);
    switch(mainData.type)
    {
      case 'style':
        for (const key in mainData.style) {
          if (mainData.style.hasOwnProperty(key)) {
            const value = mainData.style[key];
            $(xele)[0].style[key] = value;
          }
        }
        break;
      case 'text':// 替换文本内容
        $(xele).text(mainData.text);
        break;
      case 'html':
        $(xele).replaceWith(mainData.html);
        break;
      case 'insert': // 插入增加的html
        if(mainData.add.insertDirection === 'before'){
          $(xele).before(mainData.add.html)
        }else{
          $(xele).after(mainData.add.html)
        }
        break;
      case 'remove':// 删除元素
        if(mainData.removeFlag){
          $(xele).css('display','none')
        }
      case 'runJs':
        eval(mainData.js)
        break;
    }
    
  }

  for (let index = 0; index < mainDataArray.length; index++) {
    const element = mainDataArray[index];
    render(element);
  }

  //render(mainData0);

}