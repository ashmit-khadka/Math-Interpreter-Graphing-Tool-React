// Learn more about F# at http://fsharp.org
module Init

open System


let rec Sum ( data:float list ) = 
    match data with
    | head::tail -> head + Sum tail
    | [] -> 0.0

let Mean ( data:float list ) =
    let sum = Sum data  
    sum / (data.Length |> float)

//Sample Variance.
let Variance ( data:float list ) =
    let mean =      Mean data
    let residual  = Sum ( data |> List.map( fun ( x:float ) -> Math.Pow( x - mean , 2.0 )))
    residual / (( data.Length - 1 ) |> float )

//Sample Mean.
let StandardDeviation ( data:float list ) = 
    Math.Sqrt( Variance data )

let StandarErrorEstimate ( data:( float * float ) list, gradient:float, yTntercept:float ) =
    let residual  = Sum ( data |> List.map( fun ( x:float, y:float ) -> Math.Pow(( x * gradient + yTntercept ) - y, 2.0 )))
    Math.Sqrt( residual / ( (data.Length - 2) |> float ) )

//Slope.
let b ( n:int, sumXY:float, sumX:float, sumY:float, sumXX:float ) =
    let n =  (n |> float)
    (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)

//Y-Intercept.
let a ( n:int, sumY:float, sumX:float, b:float ) = 
    let n =  (n |> float)
    (sumY - b * sumX) / n

//Correlation Coefficient.
let r ( n:int, sumXY:float, sumX:float, sumY:float, sumXX:float, sumYY:float ) =
    let n =  (n |> float)
    (n * sumXY - sumX * sumY) / Math.Sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))

//Standard Error of Slope.
let Sb ( data:( float * float ) list, gradient:float, yTntercept:float, xBar:float ) =
    let yResidual = Sum ( data |> List.map( fun ( x:float, y:float ) -> Math.Pow( y - ( x * gradient + yTntercept ), 2.0 )))
    let xResidual = Sum ( data |> List.map( fun ( x:float, y:float ) -> Math.Pow((x - xBar) , 2.0 )))
    Math.Sqrt(( yResidual / xResidual ) * (1.0 / ((data.Length |> float) - 2.0)))

let Sa ( Sb:float, sumXX:float, n:int ) =
    Sb * Math.Sqrt((1.0 / (n |> float) * sumXX))


let regression ( data:( float * float ) list ) = 
    let sumXY =     Sum ( data |> List.map( fun ( x:float, y:float ) -> x * y ) )
    let sumX =      Sum ( data |> List.map( fun ( x:float, y:float ) -> x ) )
    let sumY =      Sum ( data |> List.map( fun ( x:float, y:float ) -> y ) )
    let sumXX =   Sum ( data |> List.map( fun ( x:float, y:float ) -> x * x ) )
    let sumYY =   Sum ( data |> List.map( fun ( x:float, y:float ) -> y * y ) )
    let n =         data.Length

    let b = b ( n, sumXY, sumX, sumY, sumXX )
    let a = a ( n, sumY, sumX, b )
    let r = r  ( n, sumXY, sumX, sumY, sumXX, sumYY )
    let yMean = sumY / (n |> float)
    let xMean = sumX / (n |> float)
    let Sx = StandardDeviation ( data |> List.map( fun ( x:float, y:float ) -> x ) )
    let Sy = StandardDeviation ( data |> List.map( fun ( x:float, y:float ) -> y ) )
    let Syx = StandarErrorEstimate ( data, b , a )
    let Sb = Sb (data, b , a, xMean)
    let Sa = Sa (Sb, sumXX, n)

    printfn "a %f" a
    printfn "b %f" b
    printfn "Sb %f" Sb
    printfn "Sa %f" Sa
    printfn "r %f" r
    printfn "rSqd %f" (r * r)
    printfn "Sxy %f" Syx
    printfn "Y Intercept %f" a
    printfn "X Intercept %f" ((0.0 - a) / b )
    printfn "y S.d. %f" Sy



    0.0


