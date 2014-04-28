$(document).ready(function() {

	$('#gridContainer1').loadGrid('usuario/grid', $(':input'),1);

		$('#btnSalvar').parent().hide('slow');
		$('#btnCancelar').parent().hide('slow');
		$('#idUsuario').parent().hide('slow');
		$('#idPerfil').parent().hide('slow');
		$('#email').parent().hide('slow');
		$('#login').parent().hide('slow');
		$('#senha').parent().hide('slow');
		
		$('#btnCadastrar').click(function() {

			$('#btnPesquisar').parent().hide('slow');
			$('#btnCadastrar').parent().hide('slow');
			$('#btnSalvar').parent().show('slow');
			$('#btnCancelar').parent().show('slow');

			$('#idUsuario').parent().show('slow');
			$('#idPerfil').parent().show('slow');
			$('#email').parent().show('slow');			
			$('#login').parent().show('slow');
			$('#senha').parent().show('slow');
			
			$('#nome').addClass('required').parent().addClass('required');
			$('#login').addClass('required').parent().addClass('required');
			$('#senha').addClass('required').parent().addClass('required');
			
			$('#gridContainer1').hide('slow');

		});
		
		$('#btnPesquisar').click(
				function() {
					$('#gridContainer1').loadGrid('usuario/grid',
							$(':input'), 1);
				});
		
		$('#btnCancelar').click(function() {

			$('#nome').removeClass('required').parent().removeClass('required');
			$('#login').removeClass('required').parent().removeClass('required');
			$('#senha').removeClass('required').parent().removeClass('required');

			$('#frmUsuario').clearForm();

			$("[for='senha']").html('Senha:');
			
			$('#idUsuario').parent().hide('slow');
			$('#idPerfil').parent().hide('slow');
			$('#email').parent().hide('slow');
			$('#login').parent().hide('slow');
			$('#senha').parent().hide('slow');
			
			$('#btnSalvar').parent().hide('slow');
			$('#btnCancelar').parent().hide('slow')
			$('#btnPesquisar').parent().show('slow');
			$('#btnCadastrar').parent().show('slow');

			$('#gridContainer1').show('slow');

		});
				
		$('#btnSalvar').click(function() {
			if (!formValidate()) {
				return false;
			} else {
				$.ajax( {
					url : '/usuario/ajax-salvar',
					async : false,
					type : 'POST',
					data : $('#frmUsuario').serialize(),
					dataType : 'json',
					success : function(retorno) {
					
					if(retorno['type'] == 'success') {
						
						$('#nome').removeClass('required').parent().removeClass('required');
						$('#login').removeClass('required').parent().removeClass('required');
						$('#senha').removeClass('required').parent().removeClass('required');

						$('#frmUsuario').clearForm();

						$('#idUsuario').parent().hide('slow');
						$('#nome').parent().hide('slow');
						$('#email').parent().hide('slow');
						$('#login').parent().hide('slow');
						$('#senha').parent().hide('slow');
						
						$('#btnSalvar').parent().hide('slow');
						$('#btnCancelar').parent().hide('slow')
						$('#btnPesquisar').parent().show('slow');
						$('#btnCadastrar').parent().show('slow');
						
						$('#gridContainer1').loadGrid('usuario/grid',
							$(':input'), 1)
							
						showDialog(retorno['msn'],retorno['type']);
					} else {
						showDialog(retorno['msn'],retorno['type']);
					}
					
				}
										
			});
		}
	});

	});

function onClickGrid(idUsuario) {

	$.ajax({
		url : '/usuario/ajax-get-usuario',
		async : false,
		type : 'POST',
		data : 'idUsuario=' + idUsuario,
		dataType : 'json',
		success : function(retorno) {
			
			$('#frmUsuario').clearForm();
			
			$('#btnPesquisar').parent().hide('slow');
			$('#btnCadastrar').parent().hide('slow');
			$('#btnSalvar').parent().show('slow');
			$('#btnCancelar').parent().show('slow');

			$('#idUsuario').parent().show('slow');
			$('#idPerfil').parent().show('slow');
			$('#email').parent().show('slow');			
			$('#login').parent().show('slow');
			$('#senha').parent().show('slow');
			
			$('#nome').addClass('required').parent().addClass('required');
			$('#login').addClass('required').parent().addClass('required');
			$('#senha').removeClass('required').parent().removeClass('required');
			$("[for='senha']").removeClass('required');	
			
			$('#frmUsuario').populate(retorno);
			
			$("[for='senha']").html('Nova Senha:');

		}
	});	
	
}
