module Parser

open System.IO
open Models

exception InputError of string
open System


let readLines (filePath:string) = seq {
    use sr = new StreamReader (filePath)
    while not sr.EndOfStream do
        yield sr.ReadLine ()
}


let readDistribution ( path:string ) = 
    let data = ( readLines(path)          
    |> Seq.toList
    |> List.map (fun ( point:string ) -> 
        let row = ( point.Split(",") |> Seq.toList )
        //printfn "%A" row
        if row.Length = 2 || row.Length = 1 then
            row.[0] |> float 
        else
            raise (InputError("Data is invalid please, insure data is entered in rows"))                
        )
    )
    data

let readRegression ( path:string ) = 
    let data =  (readLines(path)  
        |> Seq.toList
        |> List.map (fun ( point:string ) -> 
            let row = ( point.Split(",") |> Seq.toList )
            if row.Length = 2 then
                (row |> List.map(fun point -> point |> float ) )
            else
                raise (InputError("Data is invalid please, insure data is entered in rows"))            
        )
    )
    data

let WriteDistribution ( request:RequestDistributionData ) =        
    let data = ( request.data 
    |> List.map(fun point -> point |> string )
    |> String.concat(",\n") )
    data

let WriteRegression ( request:RequestRegressionData ) =        
    let data = ( request.data 
    |> List.map(fun point -> String.Format("{0},{1}", (point.[0] |> string ), (point.[1] |> string)))
    |> String.concat(",\n") 
    )
    data

