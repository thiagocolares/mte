$(document)
		.ready(
				function() {

					if ($('#idDds').val()) {
						comboDds();
					}

					$('#dds')
							.autocomplete(
									{
										"data" : viewData.dds,
										"minChar" : 0,
										"width" : 500,
										"result" : function(event, data,
												formatted) {
											if (isset(data)) {

												var strImgAlterar = "<a href='#' id='alterarDds' onClick='javascript: alterarDds();'>(Alterar)</a>";

												$('#dds').clearForm();
												$('#dds').hide();
												$("[for='dds']")
														.parent()
														.append(
																"<spam id='textoDds'>"
																		+ $
																				.trim(data.cdbr)
																		+ ' - '
																		+ $
																				.trim(data.nome)
																		+ "</spam>"
																		+ strImgAlterar)
												$('#idDds').val(
														$.trim(data.idDds));

											} else {
												$('#dds').clearForm();
											}
										},
										"formatItem" : function(item) {

											if (item.nome) {
												return ($.trim(item.cdbr)
														+ ' - ' + $
														.trim(item.nome));
											} else {
												return ($.trim(item.nome));
											}
										}
									});

					$('#produto').autocomplete({
						"data" : viewData.produto,
						"minChar" : 0,
						"width" : 500,
						"result" : function(event, data, formatted) {
							if (isset(data)) {
								$('#produto').val($.trim(data.descricao));
								$('#idProduto').val($.trim(data.idProduto));
							} else {
								$('#produto').clearForm();
								$('#idProduto').clearForm();
							}
						},
						"formatItem" : function(item) {
							return ($.trim(item.descricao));
						}
					});

					$('#btnAdicionar')
							.click(
									function() {
										if (!$('#idDds').val()) {
											showDialog(
													'Selecione o DDS antes de adicionar produtos!',
													'error');
										} else {
											if (!($('#idProduto').val())
													|| !($('#quantidade').val())) {
												showDialog('Informe o produto e a quantidade!');
											} else {
												adicionaProduto();
											}
										}
									});

					$('#btnSalvar')
							.click(
									function() {
										if (!formValidate()) {
											return false;
										} else {

											if (!$('#produtos_venda').val()) {
												showDialog('Você ainda não adicionou produtos à esta venda!');
											} else {

												$
														.ajax({
															url : '/venda/ajax-salvar',
															async : false,
															type : 'POST',
															data : $(
																	'#frmVenda')
																	.serialize()
																	+ '&valor_total='
																	+ $(
																			'#valor_total')
																			.text(),
															dataType : 'json',
															success : function(
																	retorno) {

																if (retorno['type'] == 'success') {
																	showDialog(
																			retorno['msn'],
																			retorno['type'],
																			'venda');
																} else {
																	showDialog(
																			retorno['msn'],
																			retorno['type']);
																}

															}

														});
											}
										}
									});

					$('#btnCancelar').click(function() {
						window.location = '/venda'
					});

					if ($('#produtos_venda').val()) {

						$('#gridContainerProdutos').loadGrid(
								'venda/grid-produtos', $(':input'), 1);
						calculaValorTotal();

					}

				});

function calculaValorTotal() {

	var valorSoma = 0;
	var valor = '';

	$('.column-4').each(function(index) {
		valor = $(this).text().replace('.', '');
		valor = valor.replace(',', '.');
		valorSoma = valorSoma + parseFloat(valor);
	});

	valorSoma = valorSoma.toFixed(2).toString();

	$('#total').html(
			'<b>Total:</b> <span id="valor_total">'
					+ formatMoney(valorSoma) + "</span>");

}

function adicionaProduto() {

	//Verificação da quantidade disponível no estoque
	
	$.ajax({
		url : '/venda/ajax-verifica-estoque',
		async : false,
		type : 'POST',
		data : 'idProduto='+$('#idProduto').val() + '&quantidade=' + $('#quantidade').val(),
		dataType : 'json',
		success : function(retorno) {

			if (retorno['type'] == 'success') {
				
				// Adiciona o produto ao campo hidden e dá um reload na grid
				var valAnterior = $('#produtos_venda').val();
				
				if (valAnterior) {
					$('#produtos_venda').val(valAnterior + ',' + $('#idProduto').val() + '-'+ $('#quantidade').val());
				} else {
					$('#produtos_venda').val($('#idProduto').val() + '-' + $('#quantidade').val());
				}
				$('#produto').clearForm();
				$('#idProduto').clearForm();
				$('#quantidade').clearForm();
				$('#gridContainerProdutos').loadGrid('venda/grid-produtos', $(':input'), 1);
				calculaValorTotal();
				
			} else {
				showDialog(retorno['msn'],retorno['type']);
			}

		}

	});
	
}

function deleteGrid(idProduto) {

	var arrProdutos = $('#produtos_venda').val().split(',');
	var arrProdutoQuant = new Array();
	var strFinal = '';

	$.each(arrProdutos, function(index, value) {
		arrProdutoQuant = value.split('-');
		if (arrProdutoQuant[0] != idProduto) {
			if (strFinal) {
				strFinal += ',' + value;
			} else {
				strFinal = value;
			}

		}
	});

	$('#produtos_venda').val(strFinal);
	$('#gridContainerProdutos').loadGrid('venda/grid-produtos', $(':input'), 1);
	calculaValorTotal();

}

function onClickGrid() {
	showDialog(
			'Não é possível alterar o produto! Remova-o e adicione novamente.',
			'error');
}

function alterarDds() {

	$('#dds').show();
	$('#textoDds').remove();
	$('#alterarDds').remove();
	$("[for='dds']").html("DDS:")
	$('#idDds').clearForm();
	$('#dds').focus();

}

function comboDds() {

	var arrDds = new Array();

	arrDds = $('#dds').val().split(' - ');

	var strImgAlterar = "<a href='#' id='alterarDds' onClick='javascript: alterarDds();'>(Alterar)</a>";

	$('#dds').clearForm();
	$('#dds').hide();
	$("[for='dds']").parent().append(
			"<spam id='textoDds'>" + $.trim(arrDds[0]) + ' - '
					+ $.trim(arrDds[1]) + "</spam>" + strImgAlterar)

}