$(window).load(function() {
	$('form').focusFirst();
});

function setupButtons()
{
    /*
    $('#BTN_SALVAR').hide();
    $('#BTN_EXCLUIR').hide();
    $('#BTN_CANCELAR').hide();
    */

    var formulario = ($('form').attr('name') != '') ?
	 		          $('form').attr('name') :
                      $('form').attr('id');
	var split = formulario.split('frm');
	var path = split[1].toLowerCase();

    eventoButtonCancelar(formulario);
    grid(path);

    $('#BTN_CADASTRAR').click(function(){
		eventoButtonCadastrar();
	});

    $('#BTN_SALVAR').click(function()
	{
		if(!formValidate()){
    		return false;
    	}else{
    		submitAjaxPpa(formulario,path);
    	}
	});

    $('#BTN_PESQUISAR').click(function()
	{
        if(!formValidatePesquisa()){
            return false;
        }
        grid(path);	
	});

	$('#BTN_CANCELAR').click(function()	{
        eventoButtonCancelar(formulario);
        grid(path);	
	});

    $('#BTN_EXCLUIR').click(function()	{
        deleteGrid(path, $('.primay-hidden').val(), formulario);
    });
}

function grid(path,value)
{
    var value = (!value) ? $(':input') : value;
    $('#gridContainer1').loadGrid(path+'/grid',value,1);
}

function eventoButtonCadastrar(hide)
{
    if(!hide) {
        $('#gridContainer1').hide('slow');
    }    

    $(':input.required').not(':hidden,:disabled').each(function(){
        $("[for='"+ $(this).attr('id') +"']").addClass('required');
     });

    $('#BTN_PESQUISAR').hide();
    $('#BTN_CADASTRAR').hide();
    $('#BTN_SALVAR').show();
    $('#BTN_CANCELAR').show();
}


function eventoButtonCancelar(formulario)
{
    $('#'+formulario).clearForm();

    $('#BTN_SALVAR').hide();
    $('#BTN_EXCLUIR').hide();
    $('#BTN_CANCELAR').hide();

    $(".hBox > label").removeClass('required');

    $('#BTN_CADASTRAR').show();
    $('#BTN_PESQUISAR').show();
}

function eventoAlterar(){
    $('#BTN_EXCLUIR').show();    
}

function submitAjaxPpa(formulario, path ,action){
    
    action = ( action )? action : 'salvar';    

    $.ajax({
        url: path+'/'+action,
        async: false,
        type: 'POST',
        data: $('#'+formulario).serialize(),
        dataType: 'json',
        success: function(retorno) {                        
            if(retorno['type'] == 'success') {
                eventoButtonCancelar(formulario);
                grid(path);                
            }
            showDialog(retorno['msn'],retorno['type']);            
        }
    });
}

function deleteGrid(path, codigo, formulario) {

    showConfirmDialog(
        'Você tem certeza que deseja excluir este registro?',
        function(){
            $.ajax({
                url: path+'/excluir',
                async: false,
                type: 'POST',
                data: 'codigo='+ codigo,
                dataType: 'json',
                success: function(retorno) {
                    if(retorno['type'] == 'success') {
                        eventoButtonCancelar(formulario);
                        grid(path);
                    }
                    showDialog(retorno['msn'],retorno['type']);
                }
            });
        }
        );
}

 /*
 * @param string controllerAction
 * @param mixed data
 * @return mixed
 */
 
function getData(controller,params){
	$.ajax({
		type: "POST",
		url: controller+"/get-"+controller,
		data: 'codigo='+params,
		dataType: 'json',
		success: function(retorno){
			var formulario = controller.toUpperCase();

			formulario = "frm"+formulario;
            eventoAlterar();
            eventoButtonCadastrar();
            
			$('#'+formulario).clearForm();
			$('#'+formulario).populate(retorno);
           try {
                populateAll(retorno);
            } catch (exception) {

            }
        },
		error: function(retorno){

        }
    });
}


/**
 * @author felipe.ono 
 * @since 14/03/2010
 * 
 *  Cria uma função para focus no primeiro campo do formulário
 */

$.fn.focusFirst = function() {
	
  var elements = $('input:visible', this).get(0);
  var select = $('select:visible', this).get(0);
  
  if (select && elements) 
  {
    if (select.offsetTop < elements.offsetTop) 
    {
      elements = select;
    }
  } 
  var textarea = $('textarea:visible', this).get(0);
  if (textarea && elements) 
  {
    if (textarea.offsetTop < elements.offsetTop) 
    {
      elements = textarea;
    }
  }
  
  if (elements) 
  {
    elements.focus();
  }
  
  return this;
} 