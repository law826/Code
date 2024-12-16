function run(variables, scriptUtils)
{
    var debug = "";

    // Inspect variables object
    debug += "\n=== Variables ===\n";
    for (var prop in variables) {
        debug += "variables." + prop + ": " + JSON.stringify(variables[prop]) + "\n";
    }

    // Inspect scriptUtils object
    debug += "\n=== ScriptUtils ===\n";
    for (var prop in scriptUtils) {
        debug += "scriptUtils." + prop + ": " + JSON.stringify(scriptUtils[prop]) + "\n";
    }

    // Try to inspect fd object directly
    debug += "\n=== fd object ===\n";
    debug += "fd type: " + (typeof fd) + "\n";
    debug += "fd toString: " + fd.toString() + "\n";
    
    // Try to inspect GetAutoIt
    debug += "\n=== fd.GetAutoIt ===\n";
    debug += "GetAutoIt type: " + (typeof fd.GetAutoIt) + "\n";
    debug += "GetAutoIt toString: " + fd.GetAutoIt.toString() + "\n";
    
    // List known methods we've used
    debug += "\n=== Known GetAutoIt Methods ===\n";
    var knownMethods = [
        'ClipPut', 'ClipGet', 'MouseClick', 
        'Send', 'Sleep', 'WinGetText'
    ];
    
    for (var i = 0; i < knownMethods.length; i++) {
        var method = knownMethods[i];
        debug += method + ": " + (typeof fd.GetAutoIt[method]) + "\n";
    }

    // Put the debug info in clipboard
    fd.GetAutoIt.ClipPut(debug);
}