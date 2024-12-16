fd.GetAutoIt.ClipPut("");
fd.BuiltInCommand("Copy selection");
fd.Wait(0.1);
var searchString = fd.GetAutoIt.ClipGet();

var statDxSearchTargetPrefix = "search?term="; 
var productUrl = "app.statdx.com";
var saltVersion = "1";
//These values are given for MModal testing purpose 
//and these have to be change per hospital I believe.
var originId = "C000744132";
var userName = fd.Variables.GetValue("SpeakerExternalId");
var saltValue = "C8reHDx9;cHRL=MmTAlv-KRoaxkOTYY3";
var currentTimeStamp = formatDate(new Date(), "yyyyMMddHHmmss", true);
//fd.DebugOutput(currentTimeStamp);
var targetValue = constructTargetValue(searchString);
//fd.DebugOutput(targetValue);

// Construct the Hash the attach in the query
var stringToHash = constructStatDxQueryToHash(originId, userName, targetValue, currentTimeStamp, saltVersion, saltValue);
//fd.DebugOutput(stringToHash);

fd.Variables.SetValue("productUrl", productUrl);
fd.Variables.SetValue("originId", originId);
fd.Variables.SetValue("userName", userName);
fd.Variables.SetValue("saltVersion", saltVersion);
fd.Variables.SetValue("currentTimeStamp", currentTimeStamp);
fd.Variables.SetValue("targetValue", targetValue);
fd.Variables.SetValue("stringToHash", stringToHash);
				
				
function formatDate(date, format, utc){
  fd.DebugOutput("---In formatDate---");
  var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
  var ii = function(i, len) {        
    return i < 10 ? "0" + i : i;
  }
  
  format = format.replace(/(^|[^\\])AM\/PM/g, "$1" + "TT");
  format = format.replace(/(^|[^\\])am\/pm/g, "$1" + "tt");
  
  var y = utc ? date.getUTCFullYear() : date.getFullYear();
  format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
  format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
  format = format.replace(/(^|[^\\])y/g, "$1" + y);

  var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
  format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
  format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
  format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
  format = format.replace(/(^|[^\\])M/g, "$1" + M);

  var d = utc ? date.getUTCDate() : date.getDate();
  format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
  format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
  format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
  format = format.replace(/(^|[^\\])d/g, "$1" + d);

  var H = utc ? date.getUTCHours() : date.getHours();
  format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
  format = format.replace(/(^|[^\\])H/g, "$1" + H);

  var h = H > 12 ? H - 12 : (H == 0 ? 12 : H);
  format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
  format = format.replace(/(^|[^\\])h/g, "$1" + h);

  var m = utc ? date.getUTCMinutes() : date.getMinutes();
  format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
  format = format.replace(/(^|[^\\])m/g, "$1" + m);

  var s = utc ? date.getUTCSeconds() : date.getSeconds();
  format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
  format = format.replace(/(^|[^\\])s/g, "$1" + s);

  var T = H < 12 ? "AM" : "PM";
  format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
  format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

  var t = T.toLowerCase();
  format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
  format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

  var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
  format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
  format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

  format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
  format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

  format = format.replace(/\\(.)/g, "$1");

  return format;
}

function constructTargetValue(searchString){
  fd.DebugOutput("---In constructTargetValue---");
  return encodeURIComponent(statDxSearchTargetPrefix + searchString);
}
		
function constructStatDxQueryToHash(originId, userName, targetValue, currentTimeStamp, saltVersion, saltvalue){
  fd.DebugOutput("---In constructStatDxQueryToHash---");
  return "_ob=TicketedURL&_origin="+originId+"&_originUser="+userName+"&_target="+targetValue+"&_ts="+currentTimeStamp+"&_version="+saltVersion+saltvalue;
}