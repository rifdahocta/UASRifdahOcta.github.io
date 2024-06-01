// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

define("exports dojo/_base/lang dojo/_base/array dojo/_base/html dojo/_base/kernel dojo/has dojo/number dojo/Deferred jimu/utils esri/lang esri/tasks/QueryTask esri/tasks/query esri/graphic jimu/ArcadeUtils".split(" "),function(f,t,q,y,z,w,B,u,v,C,D,E,F,G){function A(c){var b=t.clone(c.attributes);(c=c.geometry)&&"point"===c.type&&("x"in b?b._x=c.x:b.x=c.x,"y"in b?b._y=c.y:b.y=c.y);return b}f.exportCSV=function(c,b,a){return f._createCSVStr(b,a).then(function(d){return f._download(c+".csv",d)})};
f.exportCSVFromFeatureLayer=function(c,b,a){a=a||{};return f._getExportData(b,{datas:a.datas,objectIds:a.objectIds,fromClient:a.fromClient,withGeometry:a.withGeometry,outFields:a.outFields,filterExpression:a.filterExpression,outSpatialReference:a.outSpatialReference,arcadeExpressions:a.arcadeExpressions,geometry:a.geometry,orderByFields:a.orderByFields,start:a.start,num:a.num}).then(function(d){return f._formattedData(b,d,{formatNumber:a.formatNumber,formatDate:a.formatDate,formatCodedValue:a.formatCodedValue,
richText:{clearFormat:a.richTextFieldsToClear&&!!a.richTextFieldsToClear.length,fieldsToClear:a.richTextFieldsToClear||[]},popupInfo:a.popupInfo}).then(function(h){return f.exportCSV(c,h.datas,h.columns)})})};f.exportCSVByAttributes=function(c,b,a,d){d=t.mixin({},d);d.datas=a;return f.exportCSVFromFeatureLayer(c,b,d)};f.exportCSVByGraphics=function(c,b,a,d){a=q.map(a,function(h){return h.attributes});return f.exportCSVByAttributes(c,b,a,d)};f._createCSVStr=function(c,b){var a=new u,d="",h=0,e=0,g=
"",k="",m=","===B.format(1.1,{locale:z.locale}).substring(1,2)?";":",",l=";"===m;try{b=q.map(b,function(p){return"string"===typeof p?{name:p}:p});q.forEach(b,function(p){p=p.alias||p.name;-1<p.toString().indexOf(m)&&(p='"'+p+'"');d=d+g+p;g=m});d+="\r\n";h=c.length;e=b.length;for(var n=0;n<h;n++){g="";for(var r=0;r<e;r++){(k=c[n][b[r].name])||"number"===typeof k||(k="");if("string"===typeof k){var x=!1;(x=";"===m?/[";\r\n]/g.test(k):/[",\r\n]/g.test(k))&&(k='"'+k.replace(/(")/g,'""')+'"')}else l&&
"number"===typeof k&&(k='"'+k.toLocaleString(z.locale)+'"');d=d+g+k;g=m}d+="\r\n"}a.resolve(d)}catch(p){console.error(p),a.resolve("")}return a};f._isIE11=function(){return 11===v.has("ie")};f._isEdge=function(){return v.has("edge")};f._getDownloadUrl=function(c){return window.Blob&&window.URL&&window.URL.createObjectURL?(c=new Blob(["\ufeff"+c],{type:"text/csv"}),URL.createObjectURL(c)):"data:attachment/csv;charset\x3dutf-8,\ufeff"+encodeURIComponent(c)};f._download=function(c,b){var a=new u;try{if(w("ie")&&
10>w("ie")){var d=window.top.open("about:blank","_blank");d.document.write("sep\x3d,\r\n"+b);d.document.close();d.document.execCommand("SaveAs",!0,c);d.close()}else if(10===w("ie")||f._isIE11()||f._isEdge()){var h=new Blob(["\ufeff"+b],{type:"text/csv"});navigator.msSaveBlob(h,c)}else{var e=y.create("a",{href:f._getDownloadUrl(b),target:"_blank",download:c},document.body);if(w("safari")){var g=document.createEvent("MouseEvents");g.initEvent("click",!0,!0);e.dispatchEvent(g)}else e.click();y.destroy(e)}a.resolve()}catch(k){a.reject(k)}return a};
f._getExportData=function(c,b){var a=new u,d=null,h=[],e=b.datas,g=b.withGeometry,k=!!b.arcadeExpressions;d=b.outFields;d&&d.length||(d=c.fields);d=t.clone(d);if(g&&!(e&&0<e.length)){k?(h=q.filter(c.fields,function(l){return-1===l.name.indexOf("expression/")}),h=t.clone(h)):h=t.clone(d);var m="";m=-1!==d.indexOf("x")?"_x":"x";d.push({name:m,alias:m,format:{digitSeparator:!1,places:6},show:!0,type:"esriFieldTypeDouble"});m=-1!==d.indexOf("y")?"_y":"y";d.push({name:m,alias:m,format:{digitSeparator:!1,
places:6},show:!0,type:"esriFieldTypeDouble"})}e&&0<e.length?(k&&(e=f._getAttrsWithExpressionsBatch(e,b.arcadeExpressions)),a.resolve({data:e||[],outFields:d})):b.fromClient?(e=q.map(c.graphics,function(l){l=g?A(l):t.clone(l);return l=k?f._getAttrsWithExpressions(l,b.arcadeExpressions):l}),a.resolve({data:e||[],outFields:d})):f._getExportDataFromServer(c,h,b).then(function(l){k&&(l=f._getAttrsWithExpressionsBatch(l,b.arcadeExpressions));a.resolve({data:l||[],outFields:d})});return a};f._getExportDataFromServer=
function(c,b,a){var d=new u;if("esri.layers.FeatureLayer"!==c.declaredClass)return d.resolve([]),d;var h=new D(c.url),e=new E;e.where=a.filterExpression||c.getDefinitionExpression&&c.getDefinitionExpression()||"1\x3d1";0<b.length?(c=q.map(b,function(g){return g.name}),e.outFields=c):e.outFields=["*"];e.objectIds=a.objectIds;e.returnGeometry=a.withGeometry;e.outSR=a.spatialReference;e.geometry=a.geometry;e.orderByFields=a.orderByFields;e.start=a.start;e.num=a.num;e.outSpatialReference=a.outSpatialReference;
h.execute(e,function(g){g=q.map(g.features,function(k){return A(k)});d.resolve(g)},function(g){console.error(g);d.resolve([])});return d};f._formattedData=function(c,b,a){var d=new u,h=[],e=b.data;b=b.outFields;c=f._getDomainValuesMap(c,b,e);for(var g=0,k=e.length;g<k;g++){for(var m={},l=0;l<b.length;l++){var n=b[l];m[n.name]=c[n.name]?c[n.name][g].displayValue:f._getExportValue(e[g],n,a)}h.push(m)}a=q.map(b,function(r){return{alias:r.alias,name:r.name}});d.resolve({datas:h,columns:a});return d};
f._getDomainValuesMap=function(c,b,a){var d={};q.forEach(b,function(h){var e=v.getDisplayValueForCodedValueOrSubtype(c,h.name,a[0]);d[h.name]=e.isCodedValueOrSubtype?v.getDisplayValueForCodedValueOrSubtypeBatch(c,h.name,a):!1});return d};f._getExportValue=function(c,b,a){function d(l){if(g&&C.isDefined(g.fieldInfos))for(var n=0,r=g.fieldInfos.length;n<r;n++){var x=g.fieldInfos[n];if(x.fieldName===l)return x.format}return null}function h(l){for(var n=0,r=k.length;n<r;n++)if(k[n].fieldName===l)return!0;
return!1}var e=c[b.name],g=a.popupInfo,k=a.richText.fieldsToClear,m="esriFieldTypeDate"===b.type&&a.formatDate;h="esriFieldTypeString"===b.type&&a.richText.clearFormat&&h(b.name);return m?v.fieldFormatter.getFormattedDate(e,d(b.name)):h?e?(c=document.createElement("span"),c.innerHTML=e,c.textContent||c.innerText||""):e:c[b.name]};f._getAttrsWithExpressions=function(c,b){var a=t.getObject("expressionInfos",!1,b);b=t.getObject("layerDefinition",!1,b);var d=new F(null,null,c);return G.customExpr.getAttributesFromCustomArcadeExpr(a,
d,b)||c};f._getAttrsWithExpressionsBatch=function(c,b){var a=[];return a=q.map(c,function(d){return f._getAttrsWithExpressions(d,b)})}});