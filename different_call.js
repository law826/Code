function initializeDebugLog() {
    return "";
}

function getActiveWindowText(fullDebugLog) {
    var extractedText = fd.GetAutoIt.WinGetText("[ACTIVE]");
    fullDebugLog += "Raw Extracted Text (length: " + extractedText.length + "):\n" + extractedText + "\n\n";
    return { text: extractedText, debugLog: fullDebugLog };
}

function splitAndLogLines(extractedText, fullDebugLog) {
    var lines = extractedText.split(/\r?\n/);
    fullDebugLog += "Number of lines: " + lines.length + "\n\n";
    fullDebugLog += "=== First 10 Lines ===\n";
    for (var i = 0; i < Math.min(10, lines.length); i++) {
        fullDebugLog += "Line " + (i + 1) + " [" + lines[i].length + " chars]: [" + lines[i] + "]\n";
    }
    return { lines: lines, debugLog: fullDebugLog };
}

function getSearchPhrases() {
    return {
        targetPhrases: [
            "Connected VRC Radiologist to ",
            "questions",
            "Dr. ",
            "NP ",
            "PA ",
            "PA-C ",
            "ARNP ",
            "FNP ",
            "CNP ",
            "MD "
        ],
        excludedProviders: ["Lawrence Ngo, MD"]
    };
}

function isExcludedProvider(line, excludedProviders) {
    for (var k = 0; k < excludedProviders.length; k++) {
        if (line.indexOf(excludedProviders[k]) !== -1) {
            return true;
        }
    }
    return false;
}

function checkPriorityPhrase(line, fullDebugLog) {
    var connectPhrase = "Connected VRC Radiologist to ";
    var connectIndex = line.indexOf(connectPhrase);
    if (connectIndex !== -1) {
        var afterPrefix = line.substring(connectIndex + connectPhrase.length);
        fullDebugLog += "Found priority phrase. After prefix: [" + afterPrefix + "]\n";
        var parts = afterPrefix.split(" for pt ");
        var result = parts[0] || "";
        fullDebugLog += "Extracted from priority check: [" + result + "]\n";
        return { result: result, debugLog: fullDebugLog, found: true };
    }
    return { result: "", debugLog: fullDebugLog, found: false };
}

function checkOtherPhrases(line, targetPhrases, fullDebugLog) {
    for (var j = 0; j < targetPhrases.length; j++) {
        var phrase = targetPhrases[j];
        var phraseIndex = line.indexOf(phrase);
        if (phraseIndex !== -1) {
            fullDebugLog += "Found target phrase: " + phrase + "\n";
            var result = "";
            
            if (phrase === "Connected VRC Radiologist to ") {
                if (phraseIndex + phrase.length <= line.length) {
                    var afterPrefix = line.substring(phraseIndex + phrase.length);
                    fullDebugLog += "After prefix: [" + afterPrefix + "]\n";
                    var parts = afterPrefix.split(" for pt ");
                    result = parts[0] || "";
                }
            } else {
                var parts = line.split(" has ");
                result = parts[0] || "";
            }
            
            fullDebugLog += "Extracted provider name: [" + result + "]\n";
            return { result: result, debugLog: fullDebugLog, found: true };
        }
    }
    return { result: "", debugLog: fullDebugLog, found: false };
}

function logFinalResult(result, fullDebugLog) {
    if (result) {
        fullDebugLog += "\nFinal result: [" + result + "]\n";
    } else {
        fullDebugLog += "\nNo provider name found\n";
    }
    fd.GetAutoIt.ClipPut(fullDebugLog);
    return fullDebugLog;
}

function extractDoctorName() {
    var fullDebugLog = initializeDebugLog();
    
    var windowText = getActiveWindowText(fullDebugLog);
    fullDebugLog = windowText.debugLog;
    
    var linesResult = splitAndLogLines(windowText.text, fullDebugLog);
    var lines = linesResult.lines;
    fullDebugLog = linesResult.debugLog;
    
    var searchPhrases = getSearchPhrases();
    var result = "";

    if (lines && lines.length > 0) {
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            fullDebugLog += "\nProcessing Line " + (i + 1) + ": " + line + "\n";

            if (!line || typeof line !== 'string') {
                fullDebugLog += "Warning: Invalid line type at index " + i + "\n";
                continue;
            }

            if (!isExcludedProvider(line, searchPhrases.excludedProviders)) {
                // Check priority phrase first
                var priorityCheck = checkPriorityPhrase(line, fullDebugLog);
                fullDebugLog = priorityCheck.debugLog;
                if (priorityCheck.found) {
                    result = priorityCheck.result;
                    break;
                }

                // Check other phrases
                var otherCheck = checkOtherPhrases(line, searchPhrases.targetPhrases, fullDebugLog);
                fullDebugLog = otherCheck.debugLog;
                if (otherCheck.found) {
                    result = otherCheck.result;
                }
            } else {
                fullDebugLog += "Excluded provider found, skipping line\n";
            }
        }
    }

    fullDebugLog = logFinalResult(result, fullDebugLog);
    return result;
}

function formatCriticalFindings(doctorName) {
    // Get current time
    // Debug statement that this is running.
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    minute = minute < 10 ? "0" + minute : minute.toString();
    var ampm = hour >= 12 ? "PM" : "AM";
    hour = hour > 12 ? hour - 12 : hour;

    // Debug statement that this is running.
    
    // Get current date
    var month = (now.getMonth() + 1).toString(); // getMonth() returns 0-11
    var day = now.getDate().toString();
    var year = now.getFullYear().toString();

    // Debug statement that this is running.
    
    // Format the statement
    var statement = "THIS REPORT CONTAINS FINDINGS THAT MAY BE CRITICAL TO PATIENT CARE. " +
                   "The findings were verbally communicated via telephone conference with " +
                   doctorName + " at " + hour + ":" + minute + " " + ampm + " CST on " +
                   month + "/" + day + "/" + year + ". " +
                   "The findings were acknowledged and understood.";
                    
    return statement;
}

function run() {
    // Extract the doctor name
    var doctorName = extractDoctorName();

    // Nothing seem to run below here. Debugging.
    // fd.GetAutoIt.ClipPut("Doctor name: [" + doctorName + "]\n");
    // That works fine. 

    // Format the critical findings statement with the doctor name
    var formattedStatement = formatCriticalFindings(doctorName);   
    // Put the formatted statement in the clipboard
    // fd.GetAutoIt.ClipPut(formattedStatement);

    // Click toward bottom of the screen
    fd.GetAutoIt.MouseClick("left", 200, 1490);

    // Wait for 0.5 seconds. 
    fd.GetAutoIt.Sleep(500);

    // Paste the formatted statement
    fd.GetAutoIt.Send("^v");
}
