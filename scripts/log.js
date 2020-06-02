

    fetch("../scripts/log.json")
    .then(res => res.json())
    .then(data => {
       
       count(data);
    })
    .catch(err => failureToLoad(err));
    fetch("https://trello.com/b/DMQHAGYq.json")
    .then(res => res.json())
    .then(data => {
       
       console.log(data);
    })
    .catch(err => console.error(err));

    count = (days) =>{
        let page = document.getElementById("page");
        let totalHours = 0;
        for (let i = 1; i < Object.keys(days).length+1; i++) {
             
                page.append(dateBlock(i)); 
                let logContent =createlogContent(days["log-"+(i)],totalHours);
                page.append(logContent[0]);
                totalHours += logContent[1]
                console.log(totalHours);
        }
    }
    
    failureToLoad = (err) => {
        let page = document.getElementById("page");
        console.error(err);
        let error = {
            "f":"fas fa-bug",
            "T":"Error Loading Log",
            "p":"log loads dynamicly please disable add blockers"
        }
        let logContent = createlogContent(error,0)
         
        page.append(dateBlock("error :",err));
        page.append(logContent[0]);
        document.querySelector('i').style.color = "red";
    }


    dateBlock = (i,text="Day ") =>{
        let dateBlock = document.createElement('div');
        dateBlock.setAttribute('class','board day');
        let h2 = document.createElement('h2');
        h2.innerText = text +i;
        dateBlock.append(h2);
        return dateBlock;
    }

    logSectionP = (text) => {
      
        let p = document.createElement('p');
        p.innerText  = text;
       
        return p;
    }

    logSectionH = (text) => {
      
      let h3 = document.createElement('h3');
      h3.innerText  = text;
     
      return h3;
    }

    logSectionI = (imgSrc) => {
       
        let I = document.createElement('img');
        I.src  = imgSrc;
        I.setAttribute('class',' img')
      
        return I;
    }

    logSectionE = (imgSrc) => {
        
       let iframe = document.createElement('iframe');
       iframe.src  = imgSrc;
       iframe.setAttribute('class',' nopointer')
       return iframe;
   }

   logIcon = (iconType) => {
        let icon= document.createElement('i');
        icon.setAttribute('class',iconType+" img fa-3x");
      
       return icon;
   }

   
   elementlogHours = (hours,currentTotalHours) => {
       //console.log(hours+currentTotalHours)
        let text = `Hours: ${hours}\nRunning Total: ${hours+currentTotalHours}`;
        return [logSectionP(text),hours+currentTotalHours];
   }


   createlogContent = (contentArray,totalHours) => {
        let logSection = document.createElement('div');
        logSection.setAttribute('class','board log');
        logSection.setAttribute('class','board log imggrid');
        let returnableHours = 0;
        Object.keys(contentArray).forEach(element => {
           // console.log(element, element[0], contentArray[element]);
            switch(element[0]){
                case "p":
                        logSection.append(logSectionP(contentArray[element]));
                    
                    break;
                case "T":
                        logSection.append(logSectionH(contentArray[element]));
                    
                    break;
                case "h" :
                        
                        totalHours += contentArray[element];
                        console.log("totalHours :", totalHours )
                        returnableHours = contentArray[element]
                        let text = "Hours: "+contentArray[element]+"\nRunning Total hours: "+ totalHours;
                        logSection.append(logSectionP(text));

                    break;
                case "i":
                        logSection.append(logSectionI(contentArray[element]))
                        
                
                    break;
                case "f":
                    logSection.append(logIcon(contentArray[element]))
                    
            
                break;
                case "e":
                        let a = document.createElement('a');
                        a.href = contentArray[element][0];
                        a.target = "_blank"
                        a.append(logSectionE(contentArray[element][1]))
                        logSection.append(a);
                        logSection.setAttribute('class','board log imggrid');
                   
                    break;
                };
            
        });
        //console.log(logSection);
        return [logSection,returnableHours];
    }
