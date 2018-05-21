$(document).ready(function() {
    // Declare variables.
    var action1     = $("#action1"),
        action2     = $("#action2"),
        action3     = $("#action3"),
        add_choice  = $("#add_choice"),
        choices     = $("#choices"),
        counter     = 2,
        emailInput  = $("#email");

    // Add a choice.
    add_choice.on("click", () => {
        counter++;
        choices.append("<div class='input-field col s12'><input id='pollchoice" + counter +"' name='pollchoice" + counter +"' type='text' class='validate'><label for='pollchoice'>Poll Choice " + counter + "</label></div>")
    })

    // Hide flash messages after an amount of time. 
    setTimeout(() => {
        $(".success, .fail, #message").fadeOut(500);
    }, 2000);

    // Check if email exist in database.
    emailInput.on('blur', () => {
        var email = emailInput.val();
        
        $.ajax({
            url: '/users/checkEmail',
            type: 'POST',
            data: {checkEmail: email},
            success: (data) => {
                if(data.msg == "OK") {

                    $("#checkEmail").hide()

                } else {
                    
                    $("#checkEmail").text(data.msg)
                    $("#checkEmail").show();

                }
            }
        })
    })
    
    // Ask if you are sure you want to vote your choice and. 
    // Send ajax post request to vote.
    $("#showPoll .poll-style").on("click",  "button", (event) => {
            
            var ans = confirm("Are you sure you want to vote for this ?")
            var value = event.target.value // Get vote.
            var id = $("#pollID").val() // Get the poll id.

             // Send ajax post request to vote.
            if(ans) {
                
                $.ajax({
                    type:"POST",
                    url: "/polls/vote",
                    data: {pollID: id, vote: value},
                    success: (res) => {

                        // Show message.
                        $("#showPoll #votingMessage").show(() => {
                            $("#showPoll #votingMessage").text(res.msg)
                        })

                        // Hide message after 2 seconds.
                        setTimeout(() => {
                            $("#showPoll #votingMessage").fadeOut(500);
                        }, 2000);
                        
                    }
                })

            } else {
                event.preventDefault()
            }

    })

    // Ask if you want to delete a poll
    $(".deletePoll").on("click", (event) => {
        var ans = confirm("Are you sure you want to delete this poll ?")

        if(ans) {

        } else {
            event.preventDefault()
        }


    })


    // Function to diplay chart.
    function showChart() {

        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
        
        }

        var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
})

