$(document).ready(function() {

    $('#gridContainer1').loadGrid('venda/grid', $(':input'), 1);
	
    $('#btnPesquisar').click(function() {
        verificarDatas();
    	
    	
    });
	
    $('#btnCadastrar').click(function() {
		
        window.location = "/venda/cadastrar";
		
    });
    
    
    $('#dds').autocomplete({
        "data": viewData.dds,
        "minChar": 0,
        "width": 500,
        "result": function(event, data, formatted) {
            if (isset(data)) {
                $('#dds').val($.trim(data.cdbr) + ' - '+ $.trim(data.nome));
                $('#idDds').val($.trim(data.idDds));
            } else {
                $('#dds').clearForm();
                $('#idDds').clearForm();
            }
        },
        "formatItem": function(item) {

            if(item.nome) {
                return ($.trim(item.cdbr) + ' - '+ $.trim(item.nome));
            } else {
                return ($.trim(item.nome));
            }
        }
    });
    
});

function onClickGrid(idVenda) {

    var strJson = jQuery.parseJSON('{"idVenda":"'+idVenda+'"}');
    redirect('venda/cadastrar',strJson , 'post');

}

function verificarDatas(){
	
    	var dtInicio = $("#dataInicio").val();
    	var dtFim = $("#dataFim").val();
    	/**
         * Pego a data do select da data inicial
         */
        var ano1 = dtInicio.substr(6,4);
        var mes1 = dtInicio.substr(3,2);
        var dia1 = dtInicio.substr(0,2);
        /**
         * Pego a data do select da data final
         */
        var ano2 = dtFim.substr(6,4);
        var mes2 = dtFim.substr(3,2);
        var dia2 = dtFim.substr(0,2);
        
        var formatDataInicio = new Date();
        var formatDataFinal = new Date();
        
        /**
	     * Colocar (mes - 1) porque o javascript na sua função date com valores de string
	     * ele calcula 0 = Janeiro, 1 = Fevereriro e assim adiante
	     */ 
        formatDataInicio.setFullYear(ano1,mes1-1,dia1);
        formatDataFinal.setFullYear(ano2,mes2-1,dia2);
        if(dtFim != ''){
        	if(formatDataInicio > formatDataFinal
            		|| formatDataInicio.getTime() > formatDataFinal.getTime()){
        		showDialog(
						'A data final não pode ser menor que a data inicial',
						'error');
            }else{
            	$('#gridContainer1').loadGrid('venda/grid', $(':input'), 1);
            }
        }else{
        	$('#gridContainer1').loadGrid('venda/grid', $(':input'), 1);
        }
        
        	
 	
}

