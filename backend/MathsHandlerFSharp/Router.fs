module Router

open Newtonsoft.Json
open Microsoft.FSharp.Collections
open RegressionHandler
open DistributionHandler
open Common
open Models
open Exceptions
open Tests


[<EntryPoint>]
let main argv =

    //Gets regression profile.
    let getLinearRegressionProfile ( data:RegressionRequestDataset ) = 

        let rec createTupleList ( a:list<float>, b:list<float>, from:int, upto:int ) =
            if from=upto then
                [( a.[from], b.[from] )] 
            else
                [( a.[from], b.[from] )] @ createTupleList (a, b, ( from+1 ), upto )

        


        let rec createList ( data:float list list, from:int, upto:int ) =
            if from=upto then
                [( data.[from].[0], data.[from].[1] )] 
            else
                [( data.[from].[0], data.[from].[1] )] @ createList (data, ( from+1 ), upto )

        let dataTuple = createList ( data.data, 0, data.data.Length-1 )
        
        
        let sumXY =     Sum ( dataTuple |> List.map( fun ( x:float, y:float ) -> x * y ) )
        let sumX =      Sum ( dataTuple |> List.map( fun ( x:float, y:float ) -> x ) )
        let sumY =      Sum ( dataTuple |> List.map( fun ( x:float, y:float ) -> y ) )
        let sumXX =     Sum ( dataTuple |> List.map( fun ( x:float, y:float ) -> x * x ) )
        let sumYY =     Sum ( dataTuple |> List.map( fun ( x:float, y:float ) -> y * y ) )
        let n =         dataTuple.Length
        let b =         b ( n, sumXY, sumX, sumY, sumXX );
        let a =         a ( n, sumY, sumX, b );
        let r =         r ( n, sumXY, sumX, sumY, sumXX, sumYY );
        let xMean =     sumX / ( n |> float );
        let yMean =     sumY / ( n |> float );
        let Sx =        StandardDeviation ( dataTuple |> List.map( fun ( x:float, y:float ) -> x ) );
        let Sy =        StandardDeviation ( dataTuple |> List.map( fun ( x:float, y:float ) -> y ) );
        let Syx =       StandarErrorEstimate ( dataTuple, b , a );
        let Sb =        Sb ( dataTuple, b , a, xMean );
        let Sa =        Sa ( Sb, sumXX, n );
        
        let yMeanSE = standardErrorMean(Sy,n)
        let xMeanSE = standardErrorMean(Sx,n)
        let xIntercept = ( 0.0 - a ) / b

        let responseObj:LinearRegressionResponseProfile = { status = "good"; data={
            b = b
            a = a
            r = r
            rr = r * r
            yMean = yMean
            xMean = xMean
            Sx = Sx
            Sy = Sy
            Syx = Syx
            Sb = Sb
            Sa = Sa 
            xMeanSE = xMeanSE
            yMeanSE = yMeanSE
            xIntercept = xIntercept
        }}
        let response = JsonConvert.SerializeObject( responseObj )
        printfn "%s" response 
        
        
    //Gets distribution profile.
    let getDistributionProfile ( data:DistributionRequestDataset ) =        
        let dataset = data.data
        
        let sum = Sum ( dataset )
        let n = dataset.Length
        let mean =  Mean(dataset)
        let sd = if data.dataType.Equals("sample") then StandardDeviation(dataset) else standardDeviationPopulation(dataset)
        let variance = if data.dataType.Equals("sample") then Variance(dataset) else variancePopulation(dataset)
        let SeMean = standardErrorMean(sd, data.data.Length)



        let points = ([-15.0..15.0] |> List.map (fun x -> [ (mean + (x * sd) ); PDF((mean + (x * sd) ), mean, sd) ]))

        let responseObj:DistributionResponseProfile = { status="good"; data={
                mean = mean
                sd = sd
                sum = sum
                n = n
                variance = variance
                pdCurve=points
                SeMean=SeMean
            }
        }
 
        let response = JsonConvert.SerializeObject( responseObj )
        printfn "%s" response 
        
    //Gets distribution percentile for a rank
    let getDistributionRank  ( data:DistributionRankRequestDataset ) =
        
        let rank = percentile( data.data, data.percentile )
        let responseObj:DistributionRankResponse = { status = "good"; data = { rank=rank } }
        let response = JsonConvert.SerializeObject( responseObj )

        printfn "%s" response 

    //Gets distribution rank for a percentile.
    let getDistributionPercentile ( data:DistributionPercentileRequestDataset ) =
        
        let percentile = rank( data.data, data.rank )
        let responseObj:DistributionPercentileResponse = { status = "good"; data = { percentile=percentile } }
        let response = JsonConvert.SerializeObject( responseObj )

        printfn "%s" response 

    //Gets proabaility area.
    let getAreaProbability ( data:DistributionProbabilityRequestDataset ) = 

        let mean = Mean(data.data)
        let sd = StandardDeviation(data.data)
        let p = ProbabilityDensityCalulator(data.area, data.boundries, mean, sd)
   

        let responseObj:DistributionProbabilityResponse = { status = "good"; data = { probability=p } }
        let response = JsonConvert.SerializeObject( responseObj )


        printfn "%s" response

    //Main router
    try
        if argv.Length >= 1 then
            match argv.[0] with
            | "get-linear-regression-profile" -> getLinearRegressionProfile (JsonConvert.DeserializeObject<RegressionRequestDataset> argv.[1])
            | "get-distribution-percentile" -> getDistributionPercentile (JsonConvert.DeserializeObject<DistributionPercentileRequestDataset> argv.[1])
            | "get-distribution-rank" -> getDistributionRank (JsonConvert.DeserializeObject<DistributionRankRequestDataset> argv.[1])
            | "get-distribution-profile" -> getDistributionProfile (JsonConvert.DeserializeObject<DistributionRequestDataset> argv.[1])
            | "get-distribution-area-probability" -> getAreaProbability (JsonConvert.DeserializeObject<DistributionProbabilityRequestDataset> argv.[1])
            | "test" -> runTests
            | _ -> printfn "not recognised"
        with
        | _ -> 
            let responseObj:ResponseDefault = { status = "bad"; message="Error while perfroming action" }
            let response = JsonConvert.SerializeObject( responseObj )
            printfn "%s" response



   
    
    0 // return an integer exit code