var LOCALHOST="/slidecontrol/";
var PROJECTORWINURL=LOCALHOST+"pwin.html";
var PORTFOLDER="ColetaniaPortugues2018";
var ENGFOLDER="EnglishSongbook";
var FREEZEPAGE=LOCALHOST+"Freeze.jpg";

var lastengslidenumber=0;
var lastportslidenumber=0;
var songs="";
var currfolder="";
var curlang="";
var currsongindex=1;
var currslidenumber2="";
var currfolder2="";
var curlang2="";
var songfirstslidenumber2=0;
var nextsongfirstslidenumber2=0;
var pwin;
var titles;

function init(){
  document.getElementById("songsinput").addEventListener("keydown", function(event) {if (event.key === "Enter") {event.preventDefault();loadsongs();}});
  document.getElementById("songinput").addEventListener("keyup", function(event) {if (event.key === "Enter") {loadsong();}});
  document.getElementById("songsinput").addEventListener("keypress", forceKeyPressUppercase, false);
  updatepreview("freeze",0);
  clrsearch();
  openprojectorwin(1);
  lastengslidenumber=getlastslidenumber(engsongslide,ENGFOLDER);
  lastportslidenumber=getlastslidenumber(portsongslide,PORTFOLDER);
}

function getlastslidenumber(a,folder){
   let lastnum=parseInt(a[Object.keys(a)[Object.keys(a).length - 1]]);
   for(i=lastnum;i<99999;i++){
      if(UrlExists(LOCALHOST+folder+"/Slide"+i+".JPG")==0)
        return i;
   }
   return 99999;
}

function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if (http.status != 404)
        return 1;
    else
        return 0;
}

function openprojectorwin(f){
 let params1 = `scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no,
 width=720,height=480,left=-1000,top=-1000`;
 pwin=open(PROJECTORWINURL, 'pwin', params1);
 if(f!=1)
    pwin.onload = function () { showslide2();}
}

function showslide2(){
  if(currslidenumber2!=""){
    if(currslidenumber2 <= songfirstslidenumber2)
        document.getElementById("prevslide2").style.backgroundColor="red"
    else
        document.getElementById("prevslide2").style.backgroundColor="#4CAF50"
    if(currslidenumber2 >= (nextsongfirstslidenumber2-1))
        document.getElementById("nextslide2").style.backgroundColor="red";
    else
        document.getElementById("nextslide2").style.backgroundColor="#4CAF50"
  }

  let folder=PORTFOLDER;

  if(curlang2=='A' || curlang2=='E')
    folder=ENGFOLDER;

  let purl="url('"+LOCALHOST+folder+"/Slide"+currslidenumber2+".JPG')";

  if(document.getElementById("freeze").checked)
     purl="url('"+FREEZEPAGE+"')";

  pwin.document.title="Slide"+currslidenumber2;
  let wpi=pwin.document.getElementById("projimg");
  wpi.style.backgroundImage=purl;
  updatepreview(folder,currslidenumber2);
}

function loadsong(){
  let sval=document.getElementById("songinput").value;
  loadsong2(1,sval.toUpperCase());
}

function loadsongs(){
   var songslist=document.getElementById("songsinput").value;//p1,e22,p3...
   if(songslist==null || songslist==undefined || songslist=="")
     return; 
   songs=songslist.split(",");  
   currsongindex=0;
   hilite(songs[0].toUpperCase());
   loadsong2(2,songs[0].toUpperCase());
}

function loadsong2(t,tsong){
   song=tsong;
   if(song!="PCC" && song.match(/[PEA]\d+$/)==null){
     alert("Must start with 'P' or 'E' or 'A' like P25 or E225 or A1");
     return;
   } 
   curlang2=song.charAt(0);
   song=song.substring(1);//122,CC,A1
   if(curlang2=='P'){
      slide=portsongslide[song]; 
      if(slide==null){
        alert("There is no song "+song+" in Portuguese");
        return;
      }      
      currfolder2=PORTFOLDER;
      currslidenumber2=parseInt(slide,10);
      songfirstslidenumber2=currslidenumber2;
      nextsongfirstslidenumber2=getNextSongFirstSlidenumber(portsongslide,currslidenumber2);
      if(nextsongfirstslidenumber2<0)
        nextsongfirstslidenumber2=lastportslidenumber;
   }else{
      if(curlang2=='A')
         slide=engsongslide["A"+song];
      else
         slide=engsongslide[song];
      if(slide==null){
        alert("There is no song "+song+" in English");
        return;
      }
      currfolder2=ENGFOLDER;
      currslidenumber2=parseInt(slide,10);
      songfirstslidenumber2=currslidenumber2;
      nextsongfirstslidenumber2=getNextSongFirstSlidenumber(engsongslide,currslidenumber2);
      if(nextsongfirstslidenumber2<0)
        nextsongfirstslidenumber2=lastengslidenumber;
   } 

   let songtitle=getTitle(curlang2,song);
   document.getElementById("prvsongtitle").innerHTML=songtitle;
   showslide2();
}

function getNextSongFirstSlidenumber(object,slidenumber){
   var i;
   for(i=1;i<1000;i++){
      var j=slidenumber+i;
      var val=getKeyByValue(object,j.toString());
      if(val != null && val != undefined)
        return j;
   }
   return -1;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function nextsong(){
  currsongindex=currsongindex+1;
  if(currsongindex >= songs.length)
    currsongindex=songs.length-1;
   hilite(songs[currsongindex].toUpperCase());
   loadsong2(2,songs[currsongindex].toUpperCase());
}

function prevsong(){
  currsongindex=currsongindex-1;
  if(currsongindex<1)
    currsongindex=0;
  hilite(songs[currsongindex].toUpperCase());
  loadsong2(2,songs[currsongindex].toUpperCase());
}

function nextslide2(){
  let nextslidenumber=currslidenumber2+1;
  if(curlang2=='P'&& nextslidenumber>=lastportslidenumber)
      return;
  else if((curlang2=='A' || curlang2=='E') && nextslidenumber>=lastengslidenumber)
      return;
  currslidenumber2=nextslidenumber;
  showslide2();
}

function prevslide2(){
  var prevslidenumber=currslidenumber2-1;
  if(prevslidenumber < 1)
      return;
  currslidenumber2=prevslidenumber;
  showslide2();
}

function getTitle(clang,tsong){
  let ptitle="";
  if(clang=='P')
      ptitle=portsongtitle[tsong];
  else if(clang=='E')
      ptitle=engsongtitle[tsong];
  else if(clang=='A')
      ptitle=engsongtitle["A"+tsong];
  if(ptitle.length>35)
     ptitle=ptitle.substring(0,35)+"...";
  return "<span>"+ptitle+"</span>";
}

function updatepreview(folder,slidenumber){
  let pv=document.getElementById("preview");
  if(folder=="freeze" || slidenumber==0)
     pv.src=FREEZEPAGE;
  else
     pv.src=LOCALHOST+folder+"/Slide"+slidenumber+".JPG";
}

function clrsearch(){
  let e=document.getElementById("searchbox");
  e.value="";
  let sr=document.getElementById("searchresults");

  for(var i=sr.options.length-1;i >= 0;i--)
     sr.remove(i);
}

function clrsonginput(){
  let e=document.getElementById("songinput");
  e.value="";
}

function clrsongsinput(){
  let e=document.getElementById("songsinput");
  e.value="";
  var hl=document.getElementById("hl");
  hl.innerHTML="";
}

function clremptysongsinput(){
  let e=document.getElementById("songsinput");
  let ev=e.value;
  if(ev.trim().length<1){
    var hl=document.getElementById("hl");
    hl.innerHTML="";
  }
    
}

function search(stype){
  let sbval=document.getElementById("searchbox").value;
  let sr=document.getElementById("searchresults");

  for(var i=sr.options.length-1;i >= 0;i--)
     sr.remove(i);

     for(var key in portsongtitle){
       let t=portsongtitle[key];
       if(t.toUpperCase().includes(sbval.toUpperCase())){
         let o=option=document.createElement("option");
         o.text="P"+key+"  "+t;
         sr.add(o);
       }
     }
     for(var key in engsongtitle){
       let t=engsongtitle[key];
       if(t.toUpperCase().includes(sbval.toUpperCase())){
         let o=option=document.createElement("option");
         if(key.startsWith("A"))
           o.text=key+"  "+t;
         else
           o.text="E"+key+"  "+t;
         sr.add(o);
       }
     }

}

function addsearch(t){
   if(t==1){
     let e=document.getElementById("songsinput");
     let sv=document.getElementById("searchresults").value;
     if(sv.trim().length < 1)
        return;
     sv=sv.substring(0,sv.indexOf(" "));
     let old=e.value;
     if(old.length>0)
       old=old+",";
     e.value=old+sv;
     loadsongs();
   }else{
     let sv=document.getElementById("searchresults").value;
     if(sv.trim().length < 1)
        return;
     sv=sv.substring(0,sv.indexOf(" "));
     let e=document.getElementById("songinput");
     e.value=sv
     loadsong();
   }
}

function applyHighlights(text,key) {
  text = text.replace(key,"<mark>"+key+"</mark>");  
  return text;
}

function hilite(key) {
  var ta=document.getElementById("songsinput");
  var hl=document.getElementById("hl");
  var text=ta.value;
  var highlightedText = applyHighlights(text,key);
  hl.innerHTML=highlightedText;
}

function forceKeyPressUppercase(e){
    var charInput = e.keyCode;
    if((charInput >= 97) && (charInput <= 122)) { // lowercase
      if(!e.ctrlKey && !e.metaKey && !e.altKey) { // no modifier key
        var newChar = charInput - 32;
        var start = e.target.selectionStart;
        var end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
        e.target.setSelectionRange(start+1, start+1);
        e.preventDefault();
      }
    }
}