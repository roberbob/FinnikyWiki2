var password = ;//user password
var username= ;//username
var repo= ;//user repo name
    
function grabData() {

var settings = {
  "url": "https://api.github.com/repos/"+username+"/"+repo+"/git/refs/heads/main",
  "method": "GET",
  "timeout": 0,
  "headers": {
    "Authorization": "Basic "+password
  },
};

$.ajax(settings).done(function (response) {
  document.getElementById('sha1').innerHTML = JSON.stringify(response.object.sha).replaceAll('"','');
});

}

async function modifyData(){
await grabData();

setTimeout(function(){
var settings = {
  "url": "https://api.github.com/repos/"+username+"/"+repo+"/git/commits/"+document.getElementById('sha1').innerHTML,
  "method": "GET",
  "timeout": 0,
  "headers": {
    "Authorization": "Basic "+password
  },
};

$.ajax(settings).done(function (response) {
  document.getElementById('sha2').innerHTML = (JSON.stringify(response.tree.sha).replaceAll('"',''));
});
},1000);
}

async function changeData(){
await modifyData();
var og = document.getElementsByTagName('html')[0].innerHTML;
var contentSaver= '<!doctype html><html>'+document.getElementsByTagName('html')[0].innerHTML.replaceAll('\\','\\\\').replaceAll('"','\\"').replaceAll('\n','\\n')+'</html>';

setTimeout(function(){

var settings = {
  "url": "https://api.github.com/repos/"+username+"/"+repo+"/git/trees",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Authorization": "Basic "+password,
    "Content-Type": "text/plain"
  },
  "data": "{\n    \"base_tree\": \""+document.getElementById('sha2').innerHTML+"\",\n    \"tree\": [\n        {\n            \"path\": \"FinnikyWiki2/FinnikyWiki2.html\",\n            \"mode\": \"100644\",\n            \"type\": \"blob\",\n            \"content\": \""+contentSaver+"\"\n        }\n    ]\n}",
};

$.ajax(settings).done(function (response) {
  document.getElementById('sha3').innerHTML=JSON.stringify(response.sha).replaceAll('"','');
});

},2000);
}

async function changesomeMore(){
await changeData();

setTimeout(function(){

var settings = {
  "url": "https://api.github.com/repos/"+username+"/"+repo+"/git/commits",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Authorization": "Basic "+password,
    "Content-Type": "text/plain"
  },
  "data": "{\n    \"parents\": [\""+document.getElementById('sha1').innerHTML+"\"],\n    \"tree\": \""+document.getElementById('sha3').innerHTML+"\",\n    \"message\": \"Updated by FinnikyWiki\"\n}",
};

$.ajax(settings).done(function (response) {
  document.getElementById('sha4').innerHTML = (JSON.stringify(response.sha)).replaceAll('"','');
});

},3000);
}

async function push(){
await changesomeMore();

setTimeout(function(){

var settings = {
  "url": "https://api.github.com/repos/"+username+"/"+repo+"/git/refs/heads/main",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Authorization": "Basic "+password,
    "Content-Type": "text/plain"
  },
  "data": "{\n    \"sha\":\""+document.getElementById('sha4').innerHTML+"\"\n}",
};

$.ajax(settings).done(function (response) {
  document.getElementById('output').innerHTML = JSON.stringify(response.url).replaceAll('"','');
});

},4000);

}
