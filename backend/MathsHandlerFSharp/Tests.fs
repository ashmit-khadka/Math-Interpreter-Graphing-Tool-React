module Tests

open RegressionHandler
open DistributionHandler
open Common
open Models
open Exceptions


let runTests =

    let precision = 4

    let testPercentile = 
        let result = percentile ( [165.0; 168.0; 172.0; 174.0; 177.0; 178.0; 181.0; 182.0; 183.0; 186.0; 188.0; 193.0], 75.0 )
        let expected = 183.75
        if result = expected then
            printfn "Expected: %A, Output: %A percentile [OK]"  expected result
        else
            printfn "Expected: %A, Output: %A percentile [FAIL]" expected result


    let testRank = 
        let result = rank ( [165.0;177.0;188.0;178.0;182.0;172.0;186.0;168.0;174.0;183.0;181.0;193.0], 183.75 )
        let expected = 75.0
        if result = expected then
            printfn "Expected: %A, Output: %A rank [OK]"  expected result
        else
            printfn "Expected: %A, Output: %A rank [FAIL]" expected result


    let testZValue = 
        let result = zValue ( 15.0, 10.0, 3.0 )
        let expected = 1.666666667
        if System.Math.Round(result, precision) = System.Math.Round(expected, precision) then
            printfn "Expected: %A, Output: %A zValue [OK]"  expected result
        else
            printfn "Expected: %A, Output: %A zValue [FAIL]" expected result

    let testPDF = 
        let result = PDF ( 15.0, 10.0, 3.0 )
        let expected = 0.03315904626
        if System.Math.Round(result, precision) = System.Math.Round(expected, precision) then
            printfn "Expected: %A, Output: %A PDF [OK]"  expected result
        else
            printfn "Expected: %A, Output: %A PDF [FAIL]" expected result


    let testProbabilityDensityCalulatorA = 
        let result = ProbabilityDensityCalulator ("outside", [175.0;180.0], 178.0, 8.0 )
        let expected = 0.7551
        if System.Math.Round(result, precision) = System.Math.Round(expected, precision) then
            printfn "Expected: %A, Output: %A Probability Density Calulator Outside [OK]"  expected result
        else
            printfn "Expected: %A, Output: %A Probability Density Calulator Outside [FAIL]" expected result

    let testProbabilityDensityCalulatorB = 
        let result = ProbabilityDensityCalulator ("between", [175.0;180.0], 178.0, 8.0 )
        let expected = 0.244894
        if System.Math.Round(result, precision) = System.Math.Round(expected, precision) then
            printfn "Expected: %A, Output: %A Probability Density Calulator Between [OK]"  expected result
        else
            printfn "Expected: %A, Output: %A Probability Density Calulator Between [FAIL]" expected result


    let testProbabilityDensityCalulatorC = 
        let result = ProbabilityDensityCalulator ("above", [165.0], 178.0, 8.0 )
        let expected = 0.9594390
        if System.Math.Round(result, precision) = System.Math.Round(expected, precision) then
            printfn "Expected: %A, Output: %A Probability Density Calulator Above [OK]"  expected result
        else
            printfn "Expected: %A, Output: %A Probability Density Calulator Above [FAIL]" expected result
            
    

    testPercentile
    testRank
    testZValue
    testPDF
    testProbabilityDensityCalulatorA
    testProbabilityDensityCalulatorB



