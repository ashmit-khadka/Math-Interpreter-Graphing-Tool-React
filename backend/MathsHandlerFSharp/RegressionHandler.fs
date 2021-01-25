module RegressionHandler

open System
open Common


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