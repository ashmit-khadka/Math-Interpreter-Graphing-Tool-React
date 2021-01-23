tree = {
    "$id":"2",
    "Depth":-1,
    "Parent":"EMPTY",
    "Value":null,
    "Children":[
       {
          "$id":"3",
          "Depth":2,
          "Parent":"<<Expression_Prime>>",
          "Value":"Plus",
          "Children":[
             {
                "$id":"4",
                "Depth":4,
                "Parent":"<<Factor>>",
                "Value":15,
                "Children":[
                   
                ]
             },
             {
                "$id":"5",
                "Depth":5,
                "Parent":"<<Expression_Prime>>",
                "Value":"Plus",
                "Children":[
                   {
                      "$id":"6",
                      "Depth":6,
                      "Parent":"<<Factor>>",
                      "Value":2,
                      "Children":[
                         
                      ]
                   },
                   {
                      "$id":"7",
                      "Depth":6,
                      "Parent":"<<Term_Prime>>",
                      "Value":"Multiply",
                      "Children":[
                         {
                            "$id":"8",
                            "Depth":7,
                            "Parent":"<<Factor>>",
                            "Value":7,
                            "Children":[
                               
                            ]
                         },
                         {
                            "$id":"9",
                            "Depth":7,
                            "Parent":"<<Term_Prime>>",
                            "Value":"Multiply",
                            "Children":[
                               {
                                  "$id":"10",
                                  "Depth":8,
                                  "Parent":"<<Factor>>",
                                  "Value":5,
                                  "Children":[
                                     
                                  ]
                               },
                               {
                                  "$id":"11",
                                  "Depth":10,
                                  "Parent":"<<Factor>>",
                                  "Value":5,
                                  "Children":[
                                     
                                  ]
                               },
                               {
                                  "$id":"12",
                                  "Depth":10,
                                  "Parent":"<<Term_Prime>>",
                                  "Value":"Exponent",
                                  "Children":[
                                     {
                                        "$id":"13",
                                        "Depth":11,
                                        "Parent":"<<Factor>>",
                                        "Value":3,
                                        "Children":[
                                           
                                        ]
                                     }
                                  ]
                               }
                            ]
                         }
                      ]
                   }
                ]
             }
          ]
       }
    ]
 }


const recp = (tree) => {
    if (tree.Children.length)
        
}