module Common

open System

let rec Sum ( data:float list ) = 
    match data with
    | head::tail -> head + Sum tail
    | [] -> 0.0

let Mean ( data:float list ) =
    let sum = Sum data  
    sum / (data.Length |> float)

//Sample
let standardErrorMean( standardDeviation:float, n:int ) = 
    standardDeviation / Math.Sqrt(n |> float)



//Sample Variance.
let Variance ( data:float list ) =
    let mean =      Mean data
    let residual  = Sum ( data |> List.map( fun ( x:float ) -> Math.Pow( x - mean , 2.0 )))
    residual / (( data.Length - 1 ) |> float )

//Sample Mean.
let StandardDeviation ( data:float list ) = 
    Math.Sqrt( Variance data )


//Sample Variance.
let variancePopulation ( data:float list ) =
    let mean =      Mean data
    let residual  = Sum ( data |> List.map( fun ( x:float ) -> Math.Pow( x - mean , 2.0 )))
    residual / ( data.Length |> float )

//Sample Mean.
let standardDeviationPopulation ( data:float list ) = 
    Math.Sqrt( variancePopulation data )

//Error Function
let Erf ( x:float ) = 
    // constants
    let a1 = 0.254829592;
    let a2 = -0.284496736;
    let a3 = 1.421413741;
    let a4 = -1.453152027;
    let a5 = 1.061405429;
    let p = 0.3275911;

    // Save the sign of x
    let sign = if (x < 0.0) then 1.0 else 1.0;    
    let xAbs = Math.Abs(x);

    // A&S formula 7.1.26
    let t = 1.0 / (1.0 + p * x);
    let y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.Exp(-x * x);

    let erf = sign * y
    erf