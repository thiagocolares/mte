$(document)
    .ready(function() {

        $('#btnLogin').click(function() {
        	
            if (!validaForm()) {
                showDialog("Preenchimento inválido!","erro");
            } else {
                $.ajax({
                    url : '/login/login',
                    async : false,
                    type : 'POST',
                    data : $('#frmLogin').serialize(),
                    dataType : 'json',
                    success : function(retorno) {
								
                        if(retorno['type'] == 'success') {

                            window.location = 'index';

                        } else {
													
                            showDialog(retorno['msn'],retorno['type']);
									
                        }
                    }
													
                });
            }
        });

    });
    
    function validaForm() {
        if($("#email").val() == "" || $("#senha").val() == "") {
            return false;
        } else {
            return true;
        }
    }