

    var numberOfDays = 64;  


    deduct = (percent,days=numberOfDays) =>{
        return days-= days * (percent/100);
    };
    linier = (days=numberOfDays,label=false)=> {
        let data = [days];
        for (let i = 10; i < 110; i+=10) {
           label ? 
                    data.push(Math.floor(deduct(i,days)))
                :
                    data.push(deduct(i,days));
        }
        return label ? data.reverse(): data  ;
    }


    count = (days=numberOfDays) =>{
        let data = [days];
        for (let i = 0; i < days+1; i++) {
             data.push(i);       
        }
        return data;
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels:linier(numberOfDays,true).concat(),
            datasets: [{
                label: 'Burn Down',
                data: linier(),
               
                borderColor: [
                    'rgba(4, 4, 183, 1)'  
                ],
                borderWidth: 5
            },
            {
                label: "",
                data: [
                        numberOfDays,
                        deduct(10),
                        deduct(20),
                        48,
                        48,
                        48,
                        44,
                        44,
                        deduct(20),
                        deduct(90),
                        deduct(100),
                        ],
               
                borderColor: [
                'rgba(183, 4, 4, 1)'   
                ],
                borderWidth: 5
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });