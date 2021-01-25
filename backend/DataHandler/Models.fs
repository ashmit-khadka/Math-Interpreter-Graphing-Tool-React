module Models

type ResponseRegressionData = {
    data:string list list
    headers:bool
}

type ResponseRegression = {
    status:string
    data:float list list
}

type ResponseDistribution = {
    status:string
    data:float list
}

type RequestRegressionData = {
    path:string
    data:float list list
}

type RequestDistributionData = {
    path:string
    data:float list
}

type Response = {
    status:string
    message:string
}