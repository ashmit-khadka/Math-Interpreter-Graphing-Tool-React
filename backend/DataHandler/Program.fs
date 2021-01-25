// Learn more about F# at http://fsharp.org

open System.IO
open FSharp.Data
open Newtonsoft.Json
open Newtonsoft.Json.Linq
open System
open Tests
open Models
open Tests
open Parser
//type myCsvTypeProvider = CsvProvider<"Regression.csv", HasHeaders=false>


exception InputError of string
 
 
type MyCsvType = CsvProvider<Schema = "A (float), B (float)", HasHeaders=false>
type distributionType = CsvProvider<Schema = "A (float),", HasHeaders=false>


[<EntryPoint>]
let main argv =


    let readDistributionRoute ( path:string ) = 
        let data = readDistribution ( path )
        let responseObj:ResponseDistribution = { status = "good"; data = data }
        let response = JsonConvert.SerializeObject( responseObj )
        printfn "%s" response


    let readRegressionRoute ( path:string ) = 
        let data =  readRegression ( path )
        let responseObj:ResponseRegression = { status = "good"; data = data }
        let response = JsonConvert.SerializeObject( responseObj )
        printfn "%s" response


    let WriteDistributionRoute ( request:RequestDistributionData ) =        
        let data = WriteDistribution ( request )
        
        use sw = new StreamWriter(request.path)
        sw.WriteLine(data)

        let responseObj:Response = { status = "good"; message="" }
        let response = JsonConvert.SerializeObject( responseObj )
        printfn "%s" response

    let WriteRegressionRoute ( request:RequestRegressionData ) =        
        let data = WriteRegression ( request )

        use sw = new StreamWriter(request.path)
        sw.WriteLine(data)

        let responseObj:Response = { status = "good"; message="" }
        let response = JsonConvert.SerializeObject( responseObj )
        printfn "%s" response


    let readRouter dataType =
        match dataType with
        | "regression" -> readRegressionRoute argv.[2]
        | "distribution" -> readDistributionRoute argv.[2]
        | _ -> printfn "Error with 2nd argument"

    let writeRouter dataType =
        match dataType with
        | "regression" -> WriteRegressionRoute ( JsonConvert.DeserializeObject<RequestRegressionData> argv.[2] )
        | "distribution" -> WriteDistributionRoute ( JsonConvert.DeserializeObject<RequestDistributionData> argv.[2] )
        | _ -> printfn "Error with 2nd argument"


    try
        if argv.Length >= 1 then
            match argv.[0] with
            | "read" -> readRouter argv.[1]
            | "write" -> writeRouter argv.[1]
            | "test" -> runTests
            | _ -> printfn "Error"
    with
    | _ -> 
        let responseObj:Response = { status = "bad"; message="Error while perfroming action" }
        let response = JsonConvert.SerializeObject( responseObj )
        printfn "%s" response

    0 // return an integer exit code
