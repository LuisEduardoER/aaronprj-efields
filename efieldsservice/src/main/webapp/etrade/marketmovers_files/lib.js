// Copyright Wall Street On Demand
// JSJuiced using http://labs.gueschla.com/jsjuicer/, http://adrian3.googlepages.com/jsjuicer.html
// ------------------------------------------------------------------------------------------------
// slimmed down Function methods from wsdom.js
Function.prototype.Extend=function(superClass){this.prototype=new superClass();this.prototype.getSuperClass=function(){return superClass;};this.getSuperClass=this.prototype.getSuperClass;return this;};
Function.prototype.Super=function(context,methodName,args){if(null!=methodName){var method=this.getSuperClass().prototype[methodName];}
else{var method=this.getSuperClass();}
if(!args){return method.call(context);}
else{return method.apply(context,args);}};
// slimmed down Element.3.js
var Element_class=function(){}
Element_class.prototype.get=function(el){if(typeof el=="string")el=document.getElementById(el);return el;};Element_class.prototype.create=function(tag,attributes,children,parent,ElementObjectInstance){var element=document.createElement(tag);var attributeMap={"for":["htmlFor"],"colspan":["colSpan"]}
for(var i in attributes)
{if(i=="className"||i=="class")
{element.className=attributes[i];}
else if(document.all&&attributeMap[i])
{for(var j=0;j<attributeMap[i].length;j++){element.setAttribute(attributeMap[i][j],attributes[i]);}
element.setAttribute(i,attributes[i]);}
else if(i=="style")
{this.setStyle(element,attributes[i]);}
else if(i=="Events")
{if(typeof Events!="undefined"){var elEvents=attributes[i];if(!this.isArray(elEvents)){elEvents=[elEvents]}
for(var j=0;j<elEvents.length;j++){elEvents[j].element=element;Events.add(elEvents[j]);}}
else{alert(":: DEV ERROR :: \n Location: Element.3.js -- Element_class.prototype.create \n Type: Dependency \n Message: Expecting Events Lib for use of Events in Element.create")}}
else
{element.setAttribute(i,attributes[i]);};};if(arguments.length>2&&children)
{if(typeof children=="object"&&children.constructor==Array)
{for(var i=0;i<children.length;i++)
{this.addChild(element,children[i]);};}
else
{this.addChild(element,children);};};if(parent){this.addChild(parent,element);}
return(ElementObjectInstance)?new ElementObject(element):element;};Element_class.prototype.addChild=function(el,child){if(typeof child=="object")
{el.appendChild(child);}
else if(typeof child=="string"||typeof child=="number")
{el.innerHTML+=child;};};Element_class.prototype.remove=function(el){el=this.get(el);if(!this.isArray(el)){el=[el]}
for(var i=0;i<el.length;i++){el[i].parentNode.removeChild(el[i])}};Element_class.prototype.removeChildNodes=function(el){el=this.get(el);while(el.childNodes.length){el.removeChild(el.firstChild);}
return el;};Element_class.prototype.cloneNode=function(el,cloneChildren){var cloneChildNodes=(cloneChildren)?cloneChildren:false;if(document.all){var node=el.outerHTML;if(cloneChildNodes&&el.innerHTML){node.innerHTML=el.innerHTML;}
var container=document.createElement("DIV");container.innerHTML=node;node=container.firstChild;}else{var node=el.cloneNode(cloneChildNodes);}
return node;};Element_class.prototype.getParent=function(el,tag,includeSelf){var el=Element.get(el);if(!tag){tag=el.tagName;}
if(!includeSelf&&el.parentNode){el=el.parentNode;}
if(el.tagName&&el.tagName.match(/body/i)&&!tag.match(/body/i)){return null;}
if(el.nodeType==1&&el.tagName.toLowerCase()==tag.toLowerCase()){return el;}
else{return this.getParent(el.parentNode,tag,true);}}
Element_class.prototype.setAttribute=function(el,prop,val){el=this.get(el);if(!this.isArray(el)){el=[el]}
for(var i=0;i<el.length;i++){el[i].setAttribute(prop,val);}};Element_class.prototype.setHTML=function(el,v,appendV){el=this.get(el);if(!this.isArray(el)){el=[el]}
for(var i=0;i<el.length;i++){el[i].innerHTML=(appendV)?(el[i].innerHTML+v):v;}};
/* parseselector */
Element_class.prototype.parseSelector=(function(){var SEPERATOR=/\s*,\s*/;function parseSelector(selector,node,num){node=node||document.documentElement;node=Element.get(node);var argSelectors=selector.split(SEPERATOR);var result=[];for(var i=0;i<argSelectors.length;i++){var nodes=[node];var stream=toStream(argSelectors[i]);for(var j=0;j<stream.length;){var token=stream[j++];var filter=stream[j++];var args='';if(stream[j]=='('){while(stream[j++]!=')'&&j<stream.length)args+=stream[j];args=args.slice(0,-1);}
if(stream[j]=='['){while(stream[j++]!=']'&&j<stream.length)args+=stream[j];args=args.slice(0,-1);token="[";}
nodes=select(nodes,token,filter,args);}
result=result.concat(nodes);}
if(num!=undefined){if(result.length&&num=="first"){return result[0]}
else if(result.length&&num=="last"){return result[result.length-1]}
else if(result.length&&!isNaN(num)&&result.length>=num){return result[num]}
else{return null;}}
return result;}
var WHITESPACE=/\s*([\s>+~(),]|^|$)\s*/g;var IMPLIED_ALL=/([\s>+~,]|[^(]\+|^)([#.:@])/g;var STANDARD_SELECT=/^[^\s>+~]/;var STREAM=/[\s#.:>+~[\]()@!]|[^\s#.:>+~[\]()@!]+/g;function toStream(selector){var stream=selector.replace(WHITESPACE,'$1').replace(IMPLIED_ALL,'$1*$2');if(STANDARD_SELECT.test(stream))stream=' '+stream;return stream.match(STREAM)||[];}
function select(nodes,token,filter,args){return(selectors[token])?selectors[token](nodes,filter,args):[];}
var util={toArray:function(enumerable){var a=[];for(var i=0;i<enumerable.length;i++)util.push(a,enumerable[i]);return a;},push:function(arr,val){arr.push(val)
return arr.length;}};var dom={isTag:function(node,tag){return(tag=='*')||(tag.toLowerCase()==node.nodeName.toLowerCase().replace(':html',''));},previousSiblingElement:function(node){do node=node.previousSibling;while(node&&node.nodeType!=1);return node;},nextSiblingElement:function(node){do node=node.nextSibling;while(node&&node.nodeType!=1);return node;},hasClass:function(name,node){return(node.className||'').match('(^|\\s)'+name+'(\\s|$)');},getByTag:function(tag,node){if(tag=='*'){var nodes=node.getElementsByTagName(tag);if(nodes.length==0&&node.all!=null)return node.all
return nodes;}
return node.getElementsByTagName(tag);}};var selectors={'#':function(nodes,filter){for(var i=0;i<nodes.length;i++){if(nodes[i].getAttribute('id')==filter)return[nodes[i]];}
return[];},' ':function(nodes,filter){var result=[];for(var i=0;i<nodes.length;i++){result=result.concat(util.toArray(dom.getByTag(filter,nodes[i])));}
return result;},'>':function(nodes,filter){var result=[];for(var i=0,node;i<nodes.length;i++){node=nodes[i];for(var j=0,child;j<node.childNodes.length;j++){child=node.childNodes[j];if(child.nodeType==1&&dom.isTag(child,filter)){util.push(result,child);}}}
return result;},'.':function(nodes,filter){var result=[];for(var i=0,node;i<nodes.length;i++){node=nodes[i];if(dom.hasClass([filter],node))util.push(result,node);}
return result;},'!':function(nodes,filter){var result=[];for(var i=0,node;i<nodes.length;i++){node=nodes[i];if(!dom.hasClass([filter],node))util.push(result,node);}
return result;},':':function(nodes,filter,args){return(pseudoClasses[filter])?pseudoClasses[filter](nodes,args):[];},'+':function(nodes,filter){var result=[];for(var i=0,node;i<nodes.length;i++){node=nodes[i];var sibling=parseSelector.dom.nextSiblingElement(node);if(sibling&&parseSelector.dom.isTag(sibling,filter)){util.push(result,sibling);}}
return result;},'~':function(nodes,filter){var result=[];for(var i=0,node;i<nodes.length;i++){node=nodes[i];var sibling=parseSelector.dom.previousSiblingElement(node);if(parseSelector.dom.isTag(sibling,filter))util.push(result,sibling);}
return result;},'[':function(nodes,filter,args){args=args.replace(/'/g,'"');var attributeProps=[];if(!/=/.test(args)){attributeProps=["",args,"",""];}
else{var params=args.match(/([^^$!*]*)(!\*=|\*=|\$=|\^=|!=|=)(i)?["'](.*)["']/);if(params){attributeProps=params;}}
attributeProps={name:attributeProps[1],operator:attributeProps[2],casei:attributeProps[3],value:attributeProps[4]};if(attributeProps.casei){attributeProps.value=attributeProps.value.toLowerCase();}
var result=[];for(var i=0,node;i<nodes.length;i++){node=nodes[i];var children=parseSelector.dom.getByTag(filter,node);for(var j=0;j<children.length;j++){var att=children[j].getAttribute(attributeProps.name);if(!att)continue;if(attributeProps.casei){att=att.toLowerCase();}
if(!attributeProps.operator){util.push(result,children[j])}
else{switch(attributeProps.operator){case'=':if(att==attributeProps.value)util.push(result,children[j]);break;case'!=':if(att!=attributeProps.value)util.push(result,children[j]);break;case'*=':if(att.match(attributeProps.value))util.push(result,children[j]);break;case'!*=':if(!att.match(attributeProps.value))util.push(result,children[j]);break;case'^=':if(att.match('^'+attributeProps.value))util.push(result,children[j]);break;case'$=':if(att.match(attributeProps.value+'$'))util.push(result,children[j]);}}}}
return result;}};parseSelector.selectors=selectors;var pseudoClasses={};parseSelector.pseudoClasses=pseudoClasses;parseSelector.util=util;parseSelector.dom=dom;return parseSelector;})();
/* end parseselector */
Element_class.prototype.getParent=function(el,tag,includeSelf){var el=Element.get(el);if(!tag){tag=el.tagName;}
if(!includeSelf&&el.parentNode){el=el.parentNode;}
if(el.tagName&&el.tagName.match(/^BODY$/i)&&!tag.match(/^BODY$/i)){return null;}
if(el.nodeType==1&&el.tagName.toLowerCase()==tag.toLowerCase()){return el;}
else{return this.getParent(el.parentNode,tag,true);}}
Element_class.prototype.getParentBySelector=function(el,selector,includeSelf){el=this.get(el);var pNode=includeSelf?el:el.parentNode;selector=selector.replace(/\s+/," ").split(" ");var levels=selector.length;var level=0;var selectorType,isMatch,isTag,isClass;function getSelectorType(){var sel=selector[level];selectorType={tag:sel};if(sel.match(/(\D*)\#(\D*)/)){selectorType.tag=RegExp.$1;selectorType.id=RegExp.$2;}
else if(sel.match(/(.*)\[([^^$*]*?)((\*=|\$=|\^=|=)+["'](.*)["'])?]/)){selectorType.tag=RegExp.$1;selectorType.attribute=RegExp.$2;selectorType.operator=RegExp.$4;selectorType.value=RegExp.$5;}
else if(sel.match(/(\D*)\.(\D*)/)){selectorType.tag=RegExp.$1;selectorType.className=RegExp.$2;}}
getSelectorType();while(pNode&&!pNode.tagName.match(/^BODY$/i)){isMatch=false;isTag=pNode.tagName.match(new RegExp("^"+selectorType.tag.replace(/([*])/,"\\$1")+"$","i"))||selectorType.tag=="*"||selectorType.tag=="";isClass=selectorType.className&&this.hasClass(pNode,selectorType.className);if(isTag&&selectorType.attribute){var att=pNode.getAttribute(selectorType.attribute);if(!selectorType.operator){if(att)isMatch=true;}
else{switch(selectorType.operator){case'*=':;if(att.match(selectorType.value))isMatch=true;break;case'=':if(att==selectorType.value)isMatch=true;break;case'^=':if(att.match('^'+selectorType.value))isMatch=true;break;case'$=':if(att.match(selectorType.value+'$'))isMatch=true;}}}
else if(isTag){if(isClass){isMatch=true;}
else if(selectorType.tag&&!selectorType.className){isMatch=true;}
else if(selectorType.id&&pNode.getAttribute("id")==selectorType.id){isMatch=true;}}
else if(isTag&&isClass){isMatch=true;}
if(isMatch){if(level==levels-1){return pNode;}
level++;getSelectorType();}
pNode=pNode.parentNode||null;}
return null;}
Element_class.prototype.getSizeXY=function(el){var size=this.getSize(el);return{x:size.width,y:size.height};};

Element_class.prototype.insertBefore=function(el,sibling){el=this.get(el);if(!el)return;sibling=this.get(sibling);if(!el||!sibling||!sibling.parentNode)
{return null;};sibling.parentNode.insertBefore(el,sibling);};Element_class.prototype.insertAfter=function(el,sibling){el=this.get(el);if(!el)return;sibling=this.get(sibling);if(!el||!sibling||!sibling.parentNode)
{return null;};return sibling.nextSibling?sibling.parentNode.insertBefore(el,sibling.nextSibling):sibling.parentNode.appendChild(el);};Element_class.prototype.getXY=function(el){el=this.get(el);if(!el)return;var x=0,y=0;while(el.offsetParent){x+=el.offsetLeft;y+=el.offsetTop;el=el.offsetParent;}
return{x:x,y:y};};Element_class.prototype.setXY=function(el,x,y){el=this.get(el);if(!el)return;if(!this.isArray(el)){el=[el]}
for(var i=0;i<el.length;i++){if(x!==null)el[i].style.left=x+"px";if(y!==null)el[i].style.top=y+"px";}};Element_class.prototype.getSize=function(el){el=this.get(el);if(!el)return;var height=el.offsetHeight;var width=el.offsetWidth;return{height:height,width:width};};Element_class.prototype.setSize=function(el,width,height){el=this.get(el);if(!el)return;if(!this.isArray(el)){el=[el]}
for(var i=0;i<el.length;i++){this.setWidth(el[i],width);this.setHeight(el[i],height);}};Element_class.prototype.setWidth=function(el,width){el=this.get(el);if(!el)return;if(!this.isArray(el)){el=[el]}
for(var i=0;i<el.length;i++){el[i].style.width=width+"px";}};Element_class.prototype.setHeight=function(el,height){el=this.get(el);if(!el)return;if(!this.isArray(el)){el=[el]}
for(var i=0;i<el.length;i++){el[i].style.height=height+"px";}};Element_class.prototype.getBorderSize=function(el){el=this.get(el);var height=el.offsetHeight-el.clientHeight;var width=el.offsetWidth-el.clientWidth;return{height:height,width:width};};Element_class.prototype.setOpacity=function(el,opacity){el=this.get(el);if(!el)return
if(!this.isArray(el)){el=[el]}
for(var i=0;i<el.length;i++){el[i].style.filter="alpha(opacity:"+opacity+")";el[i].style.KHTMLOpacity=opacity/100;el[i].style.MozOpacity=opacity/100;el[i].style.opacity=opacity/100;}};Element_class.prototype.switchClass=function(el,classname,b){el=this.get(el);if(!el)return;if(!this.isArray(el)){el=[el]}
if(b){this.addClass(el,classname);}
else{this.removeClass(el,classname);}
if(el.length){return el[0].className;}};Element_class.prototype.replaceClass=function(el,oClassname,nClassname){el=this.get(el);if(!el)return;if(!this.isArray(el)){el=[el]}
this.removeClass(el,oClassname);this.addClass(el,nClassname);if(el.length){return el[0].className;}};Element_class.prototype.addClass=function(el,classname){el=this.get(el);if(!el)return;if(!this.isArray(el)){el=[el]}
for(var i=0;i<el.length;i++){if(!this.hasClass(el[i],classname)){el[i].className+=(el[i].className?" ":"")+classname;}}
if(el.length){return el[0].className;}};Element_class.prototype.removeClass=function(el,classname){el=this.get(el);if(!this.isArray(el)){el=[el]}
var re=this._getClassnameRegEx(classname);for(var i=0;i<el.length;i++){el[i].className=el[i].className.replace(re,"$1$3");}
if(el.length){return el[0].className;}};Element_class.prototype.toggleClass=function(el,classname){el=this.get(el);if(!this.isArray(el)){el=[el]}
for(var i=0;i<el.length;i++){if(this.hasClass(el[i],classname)){this.removeClass(el[i],classname);}else{this.addClass(el[i],classname);}}
if(el.length){return el[0].className;}};Element_class.prototype.hasClass=function(el,classname){el=this.get(el);return(el.className&&el.className.match(this._getClassnameRegEx(classname))!=null);};Element_class.prototype._getClassnameRegEx=function(classname){return new RegExp("(\\s|^)("+classname+")(\\s|$)","g")};Element_class.prototype.isArray=function(o){return(o instanceof Array);};Element=new Element_class();
Element_class.prototype.setStyle=function(el,styles){el=this.get(el);if(!el)return;var pairs=[];styles=styles.split(";");for(var i=0;i<styles.length;i++){var nv=styles[i].replace(":","{:}").split("{:}");if(nv.length>1){nv[0]=nv[0].replace(/\-(.)/g,function(){return arguments[1].toUpperCase();}).replace(/\s/g,"");pairs.push({n:nv[0],v:nv[1].replace(/^\s*|\s*$/g,"")});}}
if(!this.isArray(el)){el=[el]}
var attributeMap={"float":["cssFloat","styleFloat"]}
for(var i=0;i<el.length;i++){for(var j=0;j<pairs.length;j++){if(attributeMap[pairs[j].n]){for(var k=0;k<attributeMap[pairs[j].n].length;k++){pairs.push({n:attributeMap[pairs[j].n][k],v:pairs[j].v});}}
el[i].style[pairs[j].n]=pairs[j].v;}}}
/* thanks to PPK - http://www.quirksmode.org/viewport/compatibility.html */
Element_class.prototype.getWindowSize=function(){if(self.innerHeight){var width=self.innerWidth;var height=self.innerHeight;}else if(document.documentElement&&document.documentElement.clientHeight){var width=document.documentElement.clientWidth;var height=document.documentElement.clientHeight;}else if(document.body){var width=document.body.clientWidth;var height=document.body.clientHeight;};return{width:width,height:height};};Element_class.prototype.getWindowScrollOffset=function(){if(typeof window.pageYOffset=='number'){var x=window.pageXOffset;var y=window.pageYOffset;}else if(document.body&&(document.body.scrollLeft||document.body.scrollTop)){var x=document.body.scrollLeft;var y=document.body.scrollTop;}else if(document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop)){var x=document.documentElement.scrollLeft;var y=document.documentElement.scrollTop;};return{x:x||0,y:y||0};};Element_class.prototype.getViewport=function(){var windowSize=this.getWindowSize();var scrollOffset=this.getWindowScrollOffset();var top=scrollOffset.y;var bottom=scrollOffset.y+windowSize.height;var left=scrollOffset.x;var right=scrollOffset.x+windowSize.width;return{top:top,left:left,bottom:bottom,right:right,width:windowSize.width,height:windowSize.height};};

// Serializer.3.js
Serializer=function(){this._nameExclusions={};this._typeExclusions={};this._encode=true;this._strictJson=true;this._safeDeserialize=false;this._sBase64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";};Serializer.prototype.serialize=function(o){this._data=[];this._serializeNode([o],o,0);this._data=this._data.join("");this._data=this._data.replace(/,}/g,"}");this._data=this._data.replace(/,]/g,"]");this._data=this._data.substr(0,this._data.length-1);if(this.allowEncoding()){this._data=this.base64encode(this._data);}
return this._data;}
Serializer.prototype.addNameExclusion=function(){var l=arguments.length;for(var i=0;i<l;i++){this._nameExclusions[arguments[i]]=true;}}
Serializer.prototype.removeNameExclusion=function(){var l=arguments.length;for(var i=0;i<l;i++){this._nameExclusions[arguments[i]]=false;}}
Serializer.prototype.addTypeExclusion=function(){var l=arguments.length;for(var i=0;i<l;i++){this._typeExclusions[arguments[i].toLowerCase()]=true;}}
Serializer.prototype.removeTypeExclusion=function(){var l=arguments.length;for(var i=0;i<l;i++){this._typeExclusions[arguments[i].toLowerCase()]=false;}}
Serializer.prototype.requireStrictJson=function(value){if(typeof(value)!="undefined"){this._strictJson=value;}
return this._strictJson;}
Serializer.prototype.requireSafeDeserialize=function(value){if(typeof(value)!="undefined"){this._safeDeserialize=value;}
return this._safeDeserialize;}
Serializer.prototype.allowEncoding=function(value){if(typeof(value)!="undefined"){this._encode=value;}
return this._encode;}
Serializer.prototype._unicodeEscape=function(str){var dec=str.charCodeAt(0);var hexStr="\\u";var hexVals=['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];var hexPlace;hexPlace=4096
hexStr+=hexVals[Math.floor(dec/hexPlace)];dec=dec%hexPlace;hexPlace=256
hexStr+=hexVals[Math.floor(dec/hexPlace)];dec=dec%hexPlace;hexPlace=16
hexStr+=hexVals[Math.floor(dec/hexPlace)];dec=dec%hexPlace;hexPlace=1
hexStr+=hexVals[Math.floor(dec/hexPlace)];dec=dec%hexPlace;return hexStr;}
Serializer.prototype._serializeNode=function(o,startObj,depth,parentType){var t,f,d1,d2;for(var i in o){if(o[i]===null){t="null";}else{t=typeof(o[i]);}
f=t=="object"?true:false;t=t=="object"&&typeof(o[i].length)!="undefined"&&o[i].constructor==Array?"array":t;if(!this._typeExclusions[t]&&!this._nameExclusions[i]&&!(this._strictJson&&t=="function")){switch(t){case"string":d1="\"";d2="\"";break;case"object":d1="{";d2="}";break;case"array":d1="[";d2="]";break;default:d1="";d2="";break;}
if(isFinite(i)&&!(parentType&&parentType=="object")){this._data.push(d1);}else{var n=typeof(i)=="string"?"\""+i+"\"":i;this._data.push(n+":"+d1);}
if(f){if(depth==0||o[i]!==startObj){this._serializeNode(o[i],null,null,t);}}else{if(t=="string"){this._data.push(o[i].replace(/[^ -~]|[\"\\]/g,this._unicodeEscape));}else if(t=="undefined"||t=="null"){this._data.push(this._strictJson?"null":t);}else{this._data.push(o[i]);}}
this._data.push(d2+",");}}}
Serializer.prototype.deserialize=function(o){try{if(this.hasEncodingLeader(o)){o=this.base64decode(o);}
if(this._safeDeserialize){return this.safeDeserialize(o);}else{return this.unsafeDeserialize(o);}}catch(e){if(typeof(dbg)=="function"){dbg("Serializer.deserialize() error","","red");dbgObject(e);dbg("Serializer Source",o);}
var x="";}
return x;}
Serializer.prototype.safeDeserialize=function(o){try{var p=new jsonParser();p.parse(o);eval("var x = "+o);}catch(e){var x=null;}
return x;}
Serializer.prototype.unsafeDeserialize=function(o){try{eval("var x = "+o);}catch(e){var x=null;}
return x;}
Serializer.prototype.hasEncodingLeader=function(s){return s.indexOf("B64ENC")==0?true:false;}
Serializer.prototype.stripLeader=function(s){return s.substr(6,s.length);}
Serializer.prototype.prependLeader=function(s){return"B64ENC"+s;}
Serializer.prototype.base64decode=function(sIn){var i;var iBits;var sOut=[];if(this.hasEncodingLeader(sIn)){sIn=this.stripLeader(sIn);}else{return sIn;}
sIn=sIn.replace(/=/g,"");for(i=0;i<sIn.length;i+=4){iBits=(this._sBase64.indexOf(sIn.charAt(i))<<18)|(this._sBase64.indexOf(sIn.charAt(i+1))<<12)|((this._sBase64.indexOf(sIn.charAt(i+2))&0xff)<<6)|(this._sBase64.indexOf(sIn.charAt(i+3))&0xff);sOut.push(String.fromCharCode(iBits>>16&0xff));sOut.push((i>sIn.length-3)?"":String.fromCharCode(iBits>>8&0xff));sOut.push((i>sIn.length-4)?"":String.fromCharCode(iBits&0xff));}
return sOut.join("");}
Serializer.prototype.base64encode=function(sIn){var i;var iBits;var sOut=[];for(i=0;i<sIn.length;i+=3){iBits=(sIn.charCodeAt(i)<<16)+
((sIn.charCodeAt(i+1)&0xff)<<8)+
(sIn.charCodeAt(i+2)&0xff);sOut.push(this._sBase64.charAt(iBits>>18&0x3f));sOut.push(this._sBase64.charAt(iBits>>12&0x3f));sOut.push((i>sIn.length-2)?"=":this._sBase64.charAt(iBits>>6&0x3f));sOut.push((i>sIn.length-3)?"=":this._sBase64.charAt(iBits&0x3f));}
sOut=this.prependLeader(sOut.join(""));return sOut;}
function jsonParser(){this.lexer=null;this.tokens=[];}
jsonParser.prototype.parse=function(str){this.lexer=new jsonLexer(str);return this._json();}
jsonParser.prototype.lookAhead=function(k){while(this.tokens.length<=k){this.tokens.push(this.lexer.nextToken());}
return this.tokens[k].type;}
jsonParser.prototype.consume=function(type){if(this.tokens.length==0){this.tokens.push(this.lexer.nextToken());}
if(this.tokens[0].type==type){this.tokens.shift();}else{throw{message:'JSON: invalid token encountered validating string; Expected '+type+', got '+this.tokens[0].type};}}
jsonParser.prototype._json=function(){this._value();this.consume('_EOF');}
jsonParser.prototype._value=function(){switch(this.lookAhead(0)){case'_OBJ_OPEN':this._object();break;case'_ARR_OPEN':this._array();break;case'_DIGITS':case'_NEG':this._number();break;case'_STRING':this.consume('_STRING');break;case'_TRUE':this.consume('_TRUE');break;case'_FALSE':this.consume('_FALSE');break;case'_NULL':this.consume('_NULL');break;}}
jsonParser.prototype._object=function(){this.consume('_OBJ_OPEN');if(this.lookAhead(0)!='_OBJ_CLOSE'){this._member();}
while(this.lookAhead(0)!='_OBJ_CLOSE'){this.consume('_SEP');this._member();}
this.consume('_OBJ_CLOSE');}
jsonParser.prototype._member=function(){this.consume('_STRING');this.consume('_ASSIGN');this._value();}
jsonParser.prototype._array=function(){this.consume('_ARR_OPEN');if(this.lookAhead(0)!='_ARR_CLOSE'){this._value();}
while(this.lookAhead(0)!='_ARR_CLOSE'){this.consume('_SEP');this._value();}
this.consume('_ARR_CLOSE');}
jsonParser.prototype._number=function(){if(this.lookAhead(0)=='_NEG'){this.consume('_NEG');}
this.consume('_DIGITS');if(this.lookAhead(0)=='_DOT'){this.consume('_DOT');this.consume('_DIGITS');}
if(this.lookAhead(0)=='_EXP'){this.consume('_EXP');if(this.lookAhead(0)=='_POS'){this.consume('_POS');}else if(this.lookAhead(0)=='_NEG'){this.consume('_NEG');}
this.consume('_DIGITS');}}
function jsonLexer(input){input=input.replace(/"([^"\\]|\\"|\\)*"/g,'S');input=input.replace(/[0-9]+/g,'0');this.input=input;}
jsonLexer.prototype.charTokens={'{':'_OBJ_OPEN','}':'_OBJ_CLOSE','[':'_ARR_OPEN',']':'_ARR_CLOSE',':':'_ASSIGN',',':'_SEP','.':'_DOT','-':'_NEG','+':'_POS','e':'_EXP','E':'_EXP','S':'_STRING','0':'_DIGITS'};jsonLexer.prototype.nextToken=function(){if(this.input.length==0){return new jsonToken("_EOF",null);}
var first=this.input.substr(0,1);if(this.charTokens[first]){this.input=this.input.substr(1);return new jsonToken(this.charTokens[first],first);}
switch(first){case't':case'T':if(this.input.substr(0,4).toLowerCase()=='true'){this.input=this.input.substr(4);return new jsonToken('_TRUE',true);}
break;case'f':case'F':if(this.input.substr(0,5).toLowerCase()=='false'){this.input=this.input.substr(5);return new jsonToken('_FALSE',true);}
break;case'n':if(this.input.substr(0,4)=='null'){this.input=this.input.substr(4);return new jsonToken('_NULL',true);}
break;}
throw{message:'JSON: Unexpected character ('+first+') encountered validating string'};}
function jsonToken(type,value){this.type=type;this.value=value;}
// ContentBuffer.4.js
if(typeof Controller=="undefined")
{if(typeof dbg!="function")
{var dbg=function(){};};}
else
{Controller.require("/includes/jslib/debug.js");};function ContentBuffer()
{this.connections=[];this.connectionsMax=100;this.connectionsActive=0;this.connectionsPending=[];this.debug=false;this.context=window;this.connectionId=0;if(arguments.length&&typeof arguments[0]=="object")
{this.context=arguments[0];};};ContentBuffer.prototype.load=function(contentPackage)
{if(typeof Controller=="undefined")
{};try
{contentPackage.method=contentPackage.method.toLowerCase();if(contentPackage.method!="get"&&contentPackage.method!="post")
{contentPackage.method="get";};}
catch(e)
{contentPackage.method="get";};if(contentPackage.postdata&&!contentPackage.data)
{contentPackage.data=contentPackage.postdata;}
else if(!contentPackage.data)
{contentPackage.data={};};if(document.location.search.match(/\.\.nocache\.\.=on/i))
{contentPackage.data["..nocache.."]="on";};var dbgChartSrv=document.location.search.match(/\.\.debugchartsrv\.\.=([a-zA-Z]+)/i);if(dbgChartSrv){contentPackage.data["..debugchartsrv.."]=dbgChartSrv[1];}
return new Connection(this,this.connectionId++,contentPackage);};ContentBuffer.prototype._loadXMLHTTP=function(connection){var thisConnection=connection;var contentPackage=thisConnection.contentPackage;function stateMonitor(){thisBuffer._monitorConnectionState(thisConnection);};this.connectionsActive++;var dataPackage=null;var thisBuffer=this;thisConnection.active=true;if(typeof contentPackage.contentType=="string"){contentPackage.data["..contenttype.."]=contentPackage.contentType;};contentPackage.data["..requester.."]="ContentBuffer";if(contentPackage.method=="post"){dataPackage="";for(var i in contentPackage.data){dataPackage+=(dataPackage.length?"&":"")+this.encode(i)+"="+this.encode(contentPackage.data[i]);};if(this.debug||contentPackage.debug){dbg("ContentBuffer post data",dataPackage);};}else{for(var i in contentPackage.data){contentPackage.url+=(contentPackage.url.indexOf("?")==-1?"?":"&")+this.encode(i)+"="+this.encode(contentPackage.data[i]);};};if(this.debug||contentPackage.debug){dbg("ContentBuffer loading ["+thisConnection.connectionId+"]",contentPackage.url+" ["+contentPackage.method+"]");};if(this.debug||contentPackage.debug){var debugUrl=contentPackage.url;if(dataPackage){debugUrl+=(debugUrl.indexOf("?")==-1?"?":"&")+dataPackage;};debugUrl=debugUrl.replace(/\&?\.\.[^\=\&]*\.\.\=[^\&]*/g,"");if(debugUrl.indexOf("/")!=0&&debugUrl.indexOf("http")!=0){var path=String(window.location).replace(/https*:\/\//,"");debugUrl=path.substr(path.indexOf("/"),path.lastIndexOf("/")+1-path.indexOf("/"))+debugUrl;}
dbg("ContentBuffer URL","<a href=\""+debugUrl+"\"  target=\"_blank\">"+debugUrl+"</a>");};try{thisConnection.c.open(contentPackage.method.toUpperCase(),contentPackage.url,true);thisConnection.c.onreadystatechange=stateMonitor;}catch(e){};if(contentPackage.method=="post"){thisConnection.c.setRequestHeader("Content-Type","application/x-www-form-urlencoded");};thisConnection.c.send(dataPackage);};ContentBuffer.prototype._monitorConnectionState=function(connection){if(connection.c.readyState==4){if(connection.c.status!=200){if(this.debug||connection.contentPackage.debug){dbg("ContentBuffer load error",connection.c.status,"red");dbg("ContentBuffer result ["+connection.connectionId+"]",connection.c.responseText);};try{var result=connection.c.responseText;}catch(e){var result=null;};connection.contentPackage.result=result;if(typeof connection.contentPackage.onerror=="function"){connection.contentPackage.onerror.apply(connection.context,[connection]);};return;};var responseType=connection.contentPackage.contentType||connection.c.getResponseHeader("Content-Type");var result=null;if(responseType=="text/html"||responseType=="text/plain"){result=connection.c.responseText;}else if(responseType=="text/xml"){result=connection.c.responseXML;}else if(responseType=="text/javascript"){result=connection.c.responseText;if(!connection.contentPackage.preventEval){connection.context.__evalBuffer=function(){eval(result);}
connection.context.__evalBuffer();};};connection.contentPackage.result=result;if(this.debug||connection.contentPackage.debug){};if(typeof connection.contentPackage.onload=="function"){connection.contentPackage.onload.apply(connection.context,[connection]);};connection.active=false;this.connectionsActive--;if(this.connectionsPending.length){this._loadXMLHTTP(this.connectionsPending.shift());};};};ContentBuffer.prototype.isActive=function(){for(var i=0;i<this.connections.length;i++){if(this.connections[i].active){return true;}}
return false;}
ContentBuffer.prototype.abortRequests=function(){for(var i=0;i<this.connections.length;i++){this.connections[i].abort();};}
ContentBuffer.prototype.abortRequests=function(){for(var i=0;i<this.connections.length;i++){this.connections[i].abort();};}
ContentBuffer.prototype.encode=function(str){return encodeURIComponent(str);}
function Connection(contentBuffer,id,contentPackage){this.active=false;this.parent=contentBuffer;this.connectionId=id;this.contentPackage=contentPackage;this.context=contentPackage.context||this.parent.context;this._init();};Connection.prototype._init=function(){var c=false;try{c=new ActiveXObject("Msxml2.XMLHTTP");}catch(e){try{c=new ActiveXObject("Microsoft.XMLHTTP");}catch(f){c=false;};};if(!c&&typeof XMLHttpRequest!="undefined"){c=new XMLHttpRequest();};if(c){this.c=c;}else{dbg("Content Buffer initialization error.","Not supported by this browser","red");};if(this.parent.connectionsActive<this.parent.connectionsMax){this.parent.connections.push(this);this.parent._loadXMLHTTP(this);}else{dbg("queuing request");this.parent.connectionsPending.push(this);};};Connection.prototype.getResult=function(){return this.contentPackage.result;};Connection.prototype.status=function(){return(this.c.readyState==4&&this.c.status==200);};Connection.prototype.abort=function(){if(this.active){try{this.c.onreadystatechange=function(){};this.c.abort();}catch(e){dbg("connection abort failed",e,"red");};};};

// Events.3.js
var EventSource=function(type){this.listeners=[];this.type=type;};EventSource.prototype.addListener=function(listener,context){if(listener instanceof Function){listener={handler:listener,context:context}}
if(!listener.context){listener.context=window;}
this.listeners.push(listener);return listener;};EventSource.prototype.removeListener=function(listener){for(var i=0;i<this.listeners.length;i++){if(listener==this.listeners[i]){this.listeners.splice(i);}}};EventSource.prototype.removeAll=function(){this.listeners=[];};EventSource.prototype.fire=function(){for(var i=0;i<this.listeners.length;i++){Array.prototype.unshift.call(arguments,this.type);this.listeners[i].handler.apply(this.listeners[i].context,arguments);}};var DOMEventSource=function(type){DOMEventSource.Super(this,null,arguments);this.delayTimeouts=[];this.typeIE="on"+this.type;this.elements=[];};DOMEventSource.Extend(EventSource);DOMEventSource.prototype._getBrowserEventName=function(){switch(this.type){case"load":case"change":case"reset":case"select":case"submit":case"blur":case"focus":case"resize":case"scroll":case"abort":case"error":case"unload":return"HTMLEvents";case"mouseover":case"mouseout":case"click":case"dblclick":case"mouseup":case"mousedown":case"mouseenter":case"mouseleave":case"mousemove":case"contextmenu":return"MouseEvents";case"keypress":case"keydown":case"keyup":return"UIEvents";default:return null;}};DOMEventSource.prototype._createDOMHandlerClosure=function(listener,element){var theDOMEventSource=this;for(var i=0,DOMHandler;i<element.length;i++){DOMHandler=function(){var el=element[i].node;if(listener.delay){return function(){var e=new DOMEvent(window.event||arguments[0]);theDOMEventSource.clearDelayTimeouts();theDOMEventSource.delayTimeouts.push(window.setTimeout(function(){listener.handler.call(listener.context,e,el,listener.data);},listener.delay));}}
else{return function(){var e=new DOMEvent(window.event||arguments[0]);listener.handler.call(listener.context,e,el,listener.data);}}}();this._addEventListener(element[i].node,DOMHandler);element[i].registeredListeners.push({DOMHandler:DOMHandler,listener:listener});}};DOMEventSource.prototype.addElement=function(element,removeIfExisting){if(!(element instanceof Array)){element=[element];}
if(removeIfExisting){this.removeElement(element);}
var elements=[];for(var i=0;i<element.length;i++){elements.push({node:element[i],registeredListeners:[]});}
for(var i=0;i<this.listeners.length;i++){this._createDOMHandlerClosure(this.listeners[i],elements);}
this.elements=this.elements.concat(elements);};DOMEventSource.prototype.removeElement=function(element){var element=[].concat(element);for(var i=0,elWrapper;i<this.elements.length;i++){elWrapper=this.elements[i];if(!element.length){break;}
for(var j=0,el;j<element.length;j++){el=element[j];if(elWrapper.node===el){for(var k=0;k<elWrapper.registeredListeners.length;k++){this._removeEventListener(el,elWrapper.registeredListeners[k].DOMHandler);}
element.splice(j,1);this.elements.splice(i,1);j--;i--;}}}};DOMEventSource.prototype.removeAll=function(){this.removeAllElements();this.listeners=[];};DOMEventSource.prototype.removeAllElements=function(){for(var i=0,el;i<this.elements.length;i++){el=this.elements[i];for(var j=0;j<el.registeredListeners.length;j++){this._removeEventListener(el.node,el.registeredListeners[j].DOMHandler);}}
this.elements=[];};DOMEventSource.prototype.addListener=function(listener,context,delay){if(listener instanceof Function){listener={handler:listener,context:context,delay:delay}}
if(!listener.context){listener.context=window;}
this._createDOMHandlerClosure(listener,this.elements);this.listeners.push(listener);return listener;};DOMEventSource.prototype.removeListener=function(listener){for(var i=0,el;i<this.elements.length;i++){el=this.elements[i];for(var j=0,rl;j<el.registeredListeners.length;j++){rl=el.registeredListeners[j];if(rl.listener==listener){this._removeEventListener(el.node,rl.DOMHandler);el.registeredListeners.splice(j,1);break;}}}
for(var i=0,listener;i<this.listeners.length;i++){if(listener==this.listeners[i]){this.listeners.splice(i,1);break;}}};DOMEventSource.prototype.fire=function(element){if(undefined==element){for(var i=0;i<this.elements.length;i++){this._dispatchEvent(this.elements[i].node);}}
else{if(!(element instanceof Array)){element=[element];}
for(var i=0;i<element.length;i++){this._dispatchEvent(element[i]);}}};DOMEventSource.prototype._addEventListener=function(el,handler){if(document.attachEvent){DOMEventSource.prototype._addEventListener=function(el,handler){el.attachEvent(this.typeIE,handler);};}
else if(document.addEventListener){DOMEventSource.prototype._addEventListener=function(el,handler){el.addEventListener(this.type,handler,false);};}
this._addEventListener=DOMEventSource.prototype._addEventListener;this._addEventListener(el,handler);};DOMEventSource.prototype._removeEventListener=function(el,handler){if(el.detachEvent){DOMEventSource.prototype._removeEventListener=function(el,handler){el.detachEvent(this.typeIE,handler);};}
else if(el.removeEventListener){DOMEventSource.prototype._removeEventListener=function(el,handler){el.removeEventListener(this.type,handler,false);};}
this._removeEventListener=DOMEventSource.prototype._removeEventListener;this._removeEventListener(el,handler);};DOMEventSource.prototype._dispatchEvent=function(el){if(document.createEventObject){DOMEventSource.prototype._dispatchEvent=function(el){var event=document.createEventObject();event.srcElement=el;event.type=this.type;el.fireEvent(this.typeIE,event);};}
else{DOMEventSource.prototype._dispatchEvent=function(el){var event=document.createEvent(this._getBrowserEventName(this.type));event.initEvent(this.type,true,true);el.dispatchEvent(event);};}
this._dispatchEvent=DOMEventSource.prototype._dispatchEvent;this._dispatchEvent(el);};DOMEventSource.prototype.clearDelayTimeouts=function(){for(var i=0;i<this.delayTimeouts.length;i++){window.clearTimeout(this.delayTimeouts[i]);}
this.delayTimeouts=[];};var DOMEvent=function(nativeEvent){this.nativeEvent=nativeEvent;};DOMEvent.prototype.cancel=function(){if(this.nativeEvent.stopPropagation){this.nativeEvent.stopPropagation();}
else{try{this.nativeEvent.cancelBubble=true;}catch(e){}}
if(this.nativeEvent.preventDefault){this.nativeEvent.preventDefault();}
else{try{this.nativeEvent.returnValue=false;}catch(e){}}
return this.nativeEvent;};DOMEvent.prototype.getTarget=function(){var target=this.nativeEvent.srcElement||this.nativeEvent.target;this.getTarget=function(){return target;}
return this.getTarget();};var EventManager=function(){this.events=[];this.add(window,"unload",this.removeAll,this);};EventManager.prototype.add=function(element,type,handler,context,data,delay){if(arguments.length>1){var inputs={element:element,type:type,handler:handler,context:context,data:data,delay:delay}}
else if(arguments[0]instanceof Object){var inputs=arguments[0];}
else{var inputs={type:arguments[0]}}
var listener={handler:inputs.handler,context:inputs.context,delay:inputs.delay,data:inputs.data};if(this._isDomEventType(inputs.type)){var e=this._addDOMEvent(inputs.type,listener,inputs.element);}
else{var e=this._addCustomEvent(inputs.type,listener);}
this.events.push(e);return e;};EventManager.prototype._isDomEventType=function(type){if(null==DOMEventSource.prototype._getBrowserEventName.apply({type:type})){return false;}
return true;};EventManager.prototype._addDOMEvent=function(type,listener,element){var e=new DOMEventSource(type);if(listener.handler){e.addListener(listener);}
if(element){e.addElement(element);}
return e;};EventManager.prototype._addCustomEvent=function(type,listener){var e=new EventSource(type);if(listener.handler){e.addListener(listener);}
return e;};EventManager.prototype.remove=function(e,listener){if(e instanceof EventSource){if(undefined==listener){e.removeAll();}else{e.removeListener(listener);}
for(var i=0;i<this.events.length;i++){if(e==this.events[i]){this.events.splice(i,1);break;}}}
else if(e.nodeName||e instanceof Array){for(var i=0,event;i<this.events.length;i++){event=this.events[i];if(event instanceof DOMEventSource){event.removeElement(e);}}}};EventManager.prototype.removeAll=function(){for(var i=0;i<this.events.length;i++){this.events[i].removeAll();}
this.events=[];};EventManager.prototype.cancel=function(e){if(e instanceof DOMEvent){e.cancel();}
else if(e.srcElement){DOMEvent.prototype.cancel.apply({nativeEvent:e});}};var Events=new EventManager();