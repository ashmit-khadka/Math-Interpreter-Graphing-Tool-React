module DistributionHandler

open System
open Common
open Exceptions

//Returns value for a given percentile in float list.
let percentile ( data:float list, percentile:float ) =     
    let dataSorted =    data |> List.sort 
    let n =             data.Length
    let p =             percentile / 100.0
    let r =             (p * ((n - 1) |> float)) + 1.0; //true index
    let index =         Math.Floor(r) |> int;  //practical index
    let d =             r - (index |> float);
    let value =         dataSorted.[index - 1] + (dataSorted.[index] - dataSorted.[index - 1]) * d;
    value

//Returns percentile for a given value with in float list.
let rank ( data:float list, value:float ) =     
    let dataSorted =    data |> List.sort 
    let n =             data.Length
    let currentRank =   dataSorted |> List.findIndex(fun x -> x > value) 
    let d =             (value - dataSorted.[currentRank-1]) /  (dataSorted.[currentRank] - dataSorted.[currentRank-1])
    let r =             (currentRank |> float) + d
    let k =             ((r - 1.0) / ((n |> float) - 1.0)) * 100.0
    k

//Z score.
let zValue( value:float, mean:float, standardDeviation:float ) =
    let z = ( value - mean ) / standardDeviation
    z

//Probability Density Function.
let PDF( value:float, mean:float, standardDeviation:float ) =
    let numerator = Math.Pow(Math.E, (-0.5 * (Math.Pow( zValue( value, mean, standardDeviation ), 2.0)))) 
    let denominator = (Math.Sqrt(2.0 * Math.PI) * standardDeviation)    

    let p1 = 1.0 / (Math.Sqrt(2.0 * Math.PI) * standardDeviation);
    let p2 = Math.Pow(Math.E, (-0.5 * (Math.Pow((value - mean) / standardDeviation, 2.0))));

    let desnsity = p1 * p2
    desnsity

//Returns probability for normal distribution
let ProbabilityDensityCalulator( area:string, boundries:float list,  mean:float, standardDeviation:float ) = 
    let efPlusInfinity z = Math.Abs((Erf(Double.PositiveInfinity / Math.Sqrt(2.0)) / 2.0) - (Erf(z / Math.Sqrt(2.0)) / 2.0))
    let efNegitiveInfinity z = Math.Abs((Erf(Double.NegativeInfinity / Math.Sqrt(2.0)) / 2.0) - (Erf(z / Math.Sqrt(2.0)) / 2.0))

    match area with
    | "above" -> efPlusInfinity ( zValue ( boundries.[0], mean, standardDeviation ) )
    | "below" -> 1.0 - efNegitiveInfinity ( zValue ( boundries.[0], mean, standardDeviation ) )
    | "between" -> efPlusInfinity ( zValue ( boundries.[0], mean, standardDeviation ) ) - efPlusInfinity ( zValue ( boundries.[1], mean, standardDeviation ) )
    | "outside" -> 1.0 - ( efNegitiveInfinity ( zValue ( boundries.[0], mean, standardDeviation ) ) - efPlusInfinity ( zValue ( boundries.[1], mean, standardDeviation ) ) )
    | _ -> raise (InputError(String.Format("Area {0} is not recognised", area)))