statDxUrlScheme = "https"
statDxUrlPath = "ticketedURL"
function run()
  'Get MD5 Hash
  stringToHash = fd.Variables.GetValue("stringToHash")
  bytes = stringToUTFBytes(stringToHash)
  mds5HashBytes = md5hashBytes(bytes)
  hashedQueryString = LCase(Replace(bytesToHex(mds5HashBytes),"-",""))
  'fd.DebugOutput(hashedQueryString)
  
  'Construct final Uri
  statDxUri = constructStatDxUri(hashedQueryString)
  'fd.DebugOutput(statDxUri)
  
  Set WshShell = CreateObject("WScript.Shell")
  wshShell.Run "msedge.exe -url " & statDxUri, 1, false
End function

function constructStatDxUri(hashedQueryString)
  fd.DebugOutput("---In constructStatDxUri---")
  productUrl = fd.Variables.GetValue("productUrl")
  originId = fd.Variables.GetValue("originId")
  userName = fd.Variables.GetValue("userName")
  targetValue = fd.Variables.GetValue("targetValue")
  currentTimeStamp = fd.Variables.GetValue("currentTimeStamp")
  saltVersion = fd.Variables.GetValue("saltVersion")
  query = constructStatDxQuery(originId, userName, targetValue, currentTimeStamp, saltVersion, hashedQueryString)
  'fd.DebugOutput(query)
  constructStatDxUri = statDxUrlScheme & "://" & productUrl & "/" & statDxUrlPath & "?" & query
end function

function constructStatDxQuery(originId, userName, targetValue, currentTimeStamp, saltVersion, hashedQueryString)
  fd.DebugOutput("---In constructStatDxQuery---")
  constructStatDxQuery = "_ob=TicketedURL&_origin=" & originId & "&_originUser=" & userName & "&_target=" &_
  targetValue & "&_ts=" & currentTimeStamp & "&_version=" & saltVersion & "&md5=" & hashedQueryString
end function

function stringToUTFBytes(aString)
  Dim UTF8
  Set UTF8 = CreateObject("System.Text.UTF8Encoding")
  stringToUTFBytes = UTF8.GetBytes_4(aString)
end function

function md5hashBytes(aBytes)
  Dim MD5
  set MD5 = CreateObject("System.Security.Cryptography.MD5CryptoServiceProvider")
  
  MD5.Initialize()
  'Note you MUST use computehash_2 to get the correct version of this method, and the bytes MUST be double wrapped in brackets to ensure they get passed in correctly.
  md5hashBytes = MD5.ComputeHash_2( (aBytes) )
end function

function bytesToHex(aBytes)
  Dim hexStr, x
  for x=1 to lenb(aBytes)
    hexStr= hex(ascb(midb( (aBytes),x,1)))
    if len(hexStr)=1 then hexStr="0" & hexStr
    bytesToHex=bytesToHex & hexStr
  next
end function