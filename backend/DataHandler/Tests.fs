module Tests

open System.IO

let runTests = 
    let cwd = System.Environment.CurrentDirectory

    printfn "%s" cwd