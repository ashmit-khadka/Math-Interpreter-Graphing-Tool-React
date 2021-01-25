
module NewtonRoot

//This helper method finds the value of the function by using coeffecients parsed as a list 
    let rec rootFV(fOrig:List<float>, length:int, root) : float  =
        match fOrig with
        //finds the result of the head to the power of its postion in the list it then recursively calls for the other coeffecients in the list.
        | head::tail -> head*pown root (length-1) + rootFV(tail, tail.Length, root) 
        //if a coeffecient is missing
        | []-> 0.0                                     

//This helper method finds the derivative of the function parsed
    let rec findDeriv(fOrig:List<float>, length:int) : List<float> =
        match fOrig with 
        //when the recursion has finished
        |head::[]->[ ]
        //multiplies the head by the correct degree and recursively calls
        |head::tail -> [head*((float length)-1.0)]@findDeriv(tail,tail.Length)

//This is the main method it takes the list of coeffecients, the seed and error margin
    let rec CNewton fOrig root err =
        //This let finds the Derivative of the current function
        let Der = findDeriv(fOrig, fOrig.Length)
        //This let finds the value of the current function given the current seed/root
        let fRoot = rootFV(fOrig, fOrig.Length, root)
        //This let finds the value of the current derivative given the current seed/root
        let derRoot = rootFV(Der, fOrig.Length, root)
        //This let calculates the new root
        let nRoot = root - fRoot/derRoot
        //This if checks to see if the result of the new root - the old root
        //is greater than the error margin. If it is then it recursively calls, else
        //it has found the closest root to the original seed.
        if abs(nRoot - root) > err then
            CNewton fOrig nRoot err
        else
            nRoot
    

  

    

