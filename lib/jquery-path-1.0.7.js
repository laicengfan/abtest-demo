/*! 
 * jQuery xpathFinder v1.0.7 
 * http://www.mashupeye.com/ 
 * 
 * Copyright 2011, MashupEye 
 * GPL Version 2 licenses. 
 * 
 * Date: Thu Sep 3 23:17:53 2011 
 */  
(function($){
	//生成xpath
    $.fn.getQuery = function(options){
         o = $.extend({   
             type: 'xpath',        		// 生成类型 'xpath' or 'selector'
             highLight : false, 			// 选择的元素是否高亮显示
             fullPath : false, 			// 是否是全路径
             preferenceAttr: 'id', 		// 属性偏好 'id' or 'class'
             bgColor: 'yellow',        	// 背景色
             border:'yellow 1px solid',	// 边框
             expansion: 3,				// 扩大边框
             _document: null			// document对象
        }, options||{});
        var path = getPath(this, '');  
        selector = path.replaceAll('/', '>').replaceAll('\\[', ':eq(').replaceAll('\\]', ')').replaceAll('\\:eq\\(\\@', '[').replaceAll('\'\\)', '\']');  
        query = '/' + path;  
        if(!o.fullPath){  
            query = '/' + query;  
        } 
        if(o.type=='selector'){  
            return selector;  
        } else {  
            return query;  
        }  
    }  
  
    this.getXpath = function(){  
        return query;  
    }  
  
    this.getSelector = function(){  
        return selector;  
    } 
       
	//逆向解析xpath
    $.xpath = function (xpath,iframeDocumentObject) {
    	wgxpath.install();
    	var elements = [];               //用来存储XPath选择到的元素
    	try{
    		var xpathResult = 
            	iframeDocumentObject.evaluate(xpath, iframeDocumentObject, null, 6, null);
            for (var i = 0; i < xpathResult.snapshotLength; i++) {
                elements.push(xpathResult.snapshotItem(i));
            }
    	}catch(e){}
//        addCss($(iframeDocumentObject),jQuery(elements));
        return jQuery(elements);          //传给jQuery工厂方法,返回jQuery对象
    }   
    
    function getPath(e, path){  
        var tn = e.get(0).tagName;  
        if(isNullOrEmpty(e) || isNullOrEmpty(tn)){  
            return path;  
        }  
        var attr = getAttr(e);  
        tn = tn.toLowerCase() + attr;  
        path = isNullOrEmpty(path) ? tn : tn + "/" + path;  
        var parentE = e.parent();  
        if(isNullOrEmpty(parentE) || (!o.fullPath && attr.substring(0, 5) == '[@id=')){  
            return path;  
        }  
        return getPath(parentE, path);  
    }  
  
    function getAttr(e){ 
        var tn = e.get(0).tagName;
        if(tn == "BODY" || tn == "HTML"){
        	return "";  
        }
        var id = e.attr('id'), clazz = e.attr('class');
        var hasId = !isNullOrEmpty(id), hasClazz = !isNullOrEmpty(clazz);
        id = "[@id='" + id + "']";
        var _clazz = "";
        if(hasClazz){
        	clazz = clazz.replace(/(\spa-pachong)|(pa-pachong)/g,"");
        	if(clazz==""){
        		hasClazz=false;
        	}else{
        		_clazz = clazz;
        		clazz = "[@class='" + clazz + "']";
        	}
        }
        
        if(hasId && hasClazz){  
            if(o.preferenceAttr.toLowerCase() == 'class'){
            	var _classSize;
            	if(_clazz!=""){
            		_classSize = 
            			e.siblings(tn).filter("[class='"+_clazz+"']").size();
            	}else{
            		_classSize = e.siblings(tn).size();
            	}
            	if(_classSize > 0) {  
            		var i;
            		if(_clazz!=""){
            			i = e.prevAll(tn).filter("[class='"+_clazz+"']").size();  
            		}else{
            			i = e.prevAll(tn).size();
            		}
                    if(o.type=='xpath'){
                        i++;
                    }
                    return clazz+'[' + i + ']';
            	}else{
            		return clazz;
            	}
            } else {
                return id;
            }
        } else if(hasId && !hasClazz) {
            return id;
        } else if(!hasId && hasClazz) {
        	var _classSize;
        	if(_clazz!=""){
        		_classSize = 
        			e.siblings(tn).filter("[class='"+_clazz+"']").size();
        	}else{
        		_classSize = e.siblings(tn).size();
        	}
        	if(_classSize > 0) { 
        		var i;
        		if(_clazz!=""){
        			i = e.prevAll(tn).filter("[class='"+_clazz+"']").size();  
        		}else{
        			i = e.prevAll(tn).size();  
        		}
                if(o.type=='xpath'){
                    i++;
                }
                return clazz+'[' + i + ']';
        	}else{
        		return clazz;
        	}
        } else {
            if(e.siblings(tn).size() > 0) {
                var i = e.prevAll(tn).size();
                if(o.type=='xpath'){
                    i++;
                }
                return '[' + i + ']';
            } else {
            	return '';
            }
        }
    }
    
    function isNullOrEmpty (o){  
        return null==o || 'null'==o || ''==o || undefined==o;  
    }
})(jQuery);  
  
String.prototype.replaceAll = function(regx,t){     
    return this.replace(new RegExp(regx,'gm'),t);     
}; 
