$( document ).ready(function() {
    
    // GET REQUEST
    ajaxGet();
	

	// SUBMIT FORM
    $("#userForm").submit(function(event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();

		ajaxPost();
	});
    
    function ajaxPost(){
    	
    	// PREPARE FORM DATA
    	var formData = {
            email : $("#email").val(),
    		first_name : $("#firstname").val(),
    		last_name :  $("#lastname").val()
    	}
    	
    	// DO POST
    	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : window.location + "api/users",
			data : JSON.stringify(formData),
			dataType : 'json',
			success : function(data) {
				$("#postResultDiv").html("<p>" + 
					"Post Successfully! <br>" +
					"--->" + JSON.stringify(data.result)+ "</p>"); 
			},
			error : function(e) {
				alert("Error!")
				console.log("ERROR: ", e);
			}
		});
    	
    	// Reset FormData after Posting
    	resetData();
 
    }
    
    function resetData(){
		$("#email").val("");
    	$("#firstname").val("");
    	$("#lastname").val("");
    }



    // DO GET
	function ajaxGet(){
		$.ajax({
			type : "GET",
			url : window.location + "api/users",
			success: function(data){
                let result = data.result;
				$('#getResultDiv ul').empty();
				$.each(result, function(i, user){
					let button = ' <button type="button" class="editUser" id="'+user.id+'">Edit</button>';
                    $('#getResultDiv .list-group').append( button +"" +user.id + " " + user.email + " " + user.first_name + " " + user.last_name + "<br>")
				});
			},
			error : function(e) {
				$("#getResultDiv").html("<strong>Error</strong>");
				console.log("ERROR: ", e);
			}
		});
	}
    
	$( document ).on( "click", ".editUser", function( event ) { //Give proper selector in place of sth in res
		ajaxGetUser(event.target.id);
	});

	// DO GET
	function ajaxGetUser(id){
		$.ajax({
			type : "GET",
			url : window.location + "api/users/"+id,
			success: function(data){
				let result = data.result;
				$("#email").val(result.email);
    			$("#firstname").val(result.first_name);
    			$("#lastname").val(result.last_name);
			},
			error : function(e) {
				$("#getResultDiv").html("<strong>Error</strong>");
				console.log("ERROR: ", e);
			}
		});
	}
	

});