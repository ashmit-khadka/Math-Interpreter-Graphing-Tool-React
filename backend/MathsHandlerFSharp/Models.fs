module Models


type RegressionDataset = {
    xValues:list<float>
    yValues:list<float>
}

type RegressionRequestDataset = {
    data:float list list
}

type DistributionRequestDataset = {
    dataType:string
    data:list<float>
}

///////////////

type DistributionRankRequestDataset = {
    data:list<float>
    percentile:float
}

type DistributionRankResponseData = {
    rank:float
}

type DistributionRankResponse = {
    status:string
    data:DistributionRankResponseData
}


/////////////

type DistributionPercentileRequestDataset = {
    data:list<float>
    rank:float
}

type DistributionPercentileResponseData = {
    percentile:float
}

type DistributionPercentileResponse = {
    status:string
    data:DistributionPercentileResponseData
}

///////////////


type DistributionProbabilityRequestDataset = {
    area:string
    data:list<float>
    boundries:list<float>

}

type DistributionProbabilityResponseData = {
    probability:float
}

type DistributionProbabilityResponse = {
    status:string
    data:DistributionProbabilityResponseData
}


///

type LinearRegressionResponseProfileData = {
    a:float
    Sa:float
    b:float
    Sb:float
    r:float
    rr:float
    xMean:float
    Sx:float
    xMeanSE:float
    yMean:float
    Sy:float
    yMeanSE:float
    Syx:float
    xIntercept:float
}


type LinearRegressionResponseProfile = {
    status:string
    data:LinearRegressionResponseProfileData
}

////

type DistributionResponseProfileData = {
    mean:float
    sd:float
    sum:float
    n:int
    variance:float
    pdCurve:float list list
    SeMean:float
}

type DistributionResponseProfile = {
    status:string
    data:DistributionResponseProfileData
}

///

type ResponseDefault = {
    status:string
    message:string
}
