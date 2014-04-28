/******************************
  * base.form.js               *
  *                            *
  * comuns para todos os forms *
  ******************************/
$(document).ready(function(){
    setupInputs();
    setButtonsHovers();
});
/**
 *
 */
function setButtonsHovers(container){
    container = (container)?container:false;
    if( !container ){
        var buttons = $('button.ui-state-default');
    } else if( container.jquery ){
        var buttons = container.find('button.ui-state-default');
    } else {
        var buttons = $(container +' button.ui-state-default');
    }
    buttons.each(function(){
        $(this).hover(
            function(){
                $(this).addClass('ui-state-hover');
            },
            function(){
                $(this).removeClass('ui-state-hover');
            }
            );
    });
}

/**
 * Faz o submit assincrono
 *
 * a função aguarda um array json no seguinte formato:
 * array{'error':boolean, 'errorType': int, 'arrMessages': array}
 *
 * @param string controllerAction
 * @param mixed data
 * @return mixed
 */
function submitAjax(controllerAction, data){
    var retorno = false;
    data = ( !data )?$(':input:visible').serialize():data;
    data = ( !isset(data.jquery) )? data : data.serialize();
    ajaxLoading(i18n.loading);
    $.ajax({
        type: "POST",
        url: systemName+'/'+controllerAction,
        data: data,
        dataType: 'json',
        async: false,
        success: function(retornoSuccess){
            retorno = retornoSuccess;
            //verificar tipo de resposta (erro ou sucesso)
            //erro e validação necessita encontrar um id e exibir um tooltip (verificar se o campo pertence a uma aba)
            //alert(retornoSuccess);
            if(retornoSuccess.error){
                switch(retornoSuccess.errorType){
                    case 1:
                        showPhpValidation(retornoSuccess);
                        break;
                    case 2:
                        showPhpDbError(retornoSuccess);
                        break;
                }
            }else{
                showPhpSuccess(retornoSuccess);
            }
        },
        error: function(retornoError){
            retorno = retornoError;
            //"timeout", "error", "notmodified" and "parsererror"
            //alert(retornoError);
            showPhpDbError(retornoError);
        }
    });
    ajaxLoaded();
    return retorno;
}
/*
function deleteGrid(path, id)
{
	this.submitAjax(path+'/delete','codigo='+id);
	$('#gridContainer1').loadGrid(path+'/grid',$(':input'),1);
}
*/

function getObj(objID){
    if (document.getElementById){
        return document.getElementById(objID);
    }else if (document.all){
        return document.all[objID];
    }else if (document.layers){
        return document.layers[objID];
    }else{
        return null;
    }
}

/**
 * Metodo que popula o formulário após clicar em um registro da Grid

 *
 * @param string controllerAction
 * @param mixed data
 * @return mixed
 */
/*
function getData(controller,params){	
	$.ajax({
		type: "POST",
		url: controller+"/get"+controller,
		data: 'codigo='+params,
		dataType: 'json',
		success: function(retorno){
			var formulario = controller.toUpperCase();
			formulario = "frm"+formulario;
			
			//eventoButtonNovo();
			$('#'+formulario).clearForm();			
			$('#'+formulario).populate(retorno);
			
			//iniciaCadastro();
           try {
                populateAll(retorno);
            } catch (exception) {

            }
        },
		error: function(retorno){
        	
        }
    });
}*/
function populateAll(result){
    try {
        for (var objId in result) { 
            var value = result[objId];
            var obj = getObj(objId);

            if(obj == null){
                continue;
            }
            if(obj.type.indexOf('select') != -1)
            {
                var options = document.getElementById(objId).options;
                for(var i=0; i<options.length;i++){
                    if(options[i].value == value){
                        obj.selectedIndex = i;
                        break;
                    }else{
                        obj.selectedIndex = 0;
                    }
                }
            }
            else if(obj.type.indexOf('check') != -1)
            {
                if(value.toUpperCase() == 'S' || value.toUpperCase() == 'Y' || value === true){
                    obj.checked = true;
                }
            }
            else 
            {
                document.getElementById(objId).value = value;
            }
        }// for end
    } catch (exception) { }
}


/**
 * Valida campos
 *
 * exemplos:
 *         formValidate()          //valida todos os campos obrigatórios da tela
 *         formValidate('YYY')     //valida todos os campos internos ao elemento com id="YYY"
 *         formValidate($('.WWW')) //valida todos os campos que obedeçam a regra do seletor jQuery (class = WWW)
 * @param strig/objJquery campos
 * @return boolean
 */
function formValidate(campos){
    var retorno = true;
    if(!campos){
        $(':input.required').not(':hidden,:disabled').each(function(){
            if(retorno){
                retorno = $(this).baseValidate(false);
            }
        });
    }else{
        if(campos instanceof Object){
            campos.each(function(){
                if(retorno && $(this).is('.required')){
                    retorno = $(this).baseValidate(false);
                }
            });
        }else{
            $('#'+campos).each(function(){
                if(retorno){
                    retorno = $(this).baseValidate(false);
                }
            });
        }
    }
    return retorno;
}

/**
 * Valida campos para a pesquisa
 *
 * exemplos:
 *         formValidate()          //valida todos os campos obrigatórios da tela
 *         formValidate('YYY')     //valida todos os campos internos ao elemento com id="YYY"
 *         formValidate($('.WWW')) //valida todos os campos que obedeçam a regra do seletor jQuery (class = WWW)
 * @param strig/objJquery campos
 * @return boolean
 */
function formValidatePesquisa(campos){
    var retorno = true;
    if(!campos){
        $(':input.required').not(':hidden,:disabled').each(function(){
            if(retorno){
                retorno = $(this).baseValidate(true);
            }
        });
    }else{
        if(campos instanceof Object){
            campos.each(function(){
                if(retorno && $(this).is('.required')){
                    retorno = $(this).baseValidate(false);
                }
            });
        }else{
            $('#'+campos).each(function(){
                if(retorno){
                    retorno = $(this).baseValidate(false);
                }
            });
        }
    }
    return retorno;
}

/**
 * Executa a validação do input referenciada em "data('validateFunction')"
 *
 * @param boolean allowEmpty  default true (permite campo vazio)
 * @return boolean
 */
$.fn.baseValidate = function(allowEmpty){
    allowEmpty = (!allowEmpty)?false:true; //default true
    if( !allowEmpty ){
        switch ($(this).attr('controltype')) {
            case 'quote':
            case 'money':
            case 'float':
                if(!$(this).floatVal()>0){
                    $(this).showToolTip(i18n.MSG001);
                    return false;
                }
                break;
            case 'number':
                if(!parseInt($(this).val())>0){
                    $(this).showToolTip(i18n.MSG001);
                    return false;
                }
                break;
            default:
                if($.trim($(this).getValUnmasked()) == ""){
                    //                if($.trim($(this).val()) == ""){
                    $(this).showToolTip(i18n.MSG001);
                    return false;
                }
                break;
        }
    }
    if(!allowEmpty && ($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox')){
        var nameInput = $(this).attr('name');
        if(!$(':input[name="'+nameInput+'"]').isChecked()){
            $(this).showToolTip(i18n.MSG001);
            return false;
        }
    }

    if( $.isFunction( $(this).data('validateFunction') ) ){

        if($(this).data('validateFunction')($(this))){
            return true;
        }else{
            return false;
        }
    }
    return true;
};

/**
 * Verifica se o checkbox esta checado
 *
 * @return boolean
 */
$.fn.isChecked = function(){
    var field = $(this);
    if(field.length) {
        for(i = 0; i < field.length; i++) {
            if(field[i].checked)
                return true;
        }
    }
    else if(field.checked)
        return true;
    return false;
};

/**
 * Prepara os buttons de controle do formulário
 *
 * @return void
 */
/*
function setupButtons()
{		
	$('#salvar').hide();
	$('#cancelar').hide();
	
	var formulario = ($('form').attr('name') != '') ? 
			$('form').attr('name') : $('form').attr('id');
	var split = formulario.split('frm');
	var path = split[1].toLowerCase();

	$('#novo').click(function()
	{
		eventoButtonNovo();	
	});
	
	$('#salvar').click(function() 
	{ 
		
		if(!formValidate()){
    		return false;
    	}else{
    		submitAjax(path+'/salvar',$(':input'));
    	}
		$('#'+formulario).clearForm();
		eventoButtonCancelar();
		$('#gridContainer1').loadGrid(path+'/grid',$(':input'),1);
	});
	
	$('#pesquisar').click(function() 
	{
        if(!formValidatePesquisa()){
            return false;
        }
		$('#gridContainer1').loadGrid(path+'/grid',$(':input'),1);
	});

	$('#cancelar').click(function()
	{
		$('#'+formulario).clearForm();
		eventoButtonCancelar();
	});
	
}

function eventoButtonNovo()
{
	$("#salvar").html('Salvar');
    $("#salvar").show();
    $("#cancelar").show();
    $("#novo").hide();
    $("#pesquisar").hide();
}

function eventoButtonCancelar()
{
    $("#salvar").hide();
    $("#cancelar").hide();
    $("#novo").show();
    $("#pesquisar").show();
}
*/

/**
 * Prepara os inputs (mascaras e funções de validações)
 *
 * @param mixed container
 * @return void
 */
function setupInputs(container){
    container = (container)?container:false;
    if( !container ){
        var inputs = $(':input');
    } else if( container.jquery ){
        if( container.is(':input') ){
            var inputs = container;
        } else {
            var inputs = container.find(':input');
        }
    } else {
        var inputs = $(container +' :input');
    }
    inputs.each(function(){
        //        $(this).bind('change', $(this).baseValidate);

        var configDefaultDatepicker = {
            "dateFormat"      : "dd/mm/yy",
            "showOn"          : "button",
            "buttonImage"     : baseUrl + "/images/calendar.png",
            "buttonImageOnly" : true,
            "changeMonth"     : true,
            "changeYear"      : true,
            "yearRange"       : "-20:+20",
            "buttonText"      : "Escolher Data...",
            "dayNamesMin"     : ["Dom", "Seg", "Ter", "Qui", "Qua", "Sex", "Sab"],
            "monthNamesShort" : ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
            "monthNames"      : ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
        };

        switch( $(this).attr('controltype') ){
            case 'uf':
                $(this).bind('change', function(){
                    if( $($(this).attr('dependent')).length ){
                        $(this).getMunicipioByUf($(this).attr('dependent'));
                    }
                });
                break;
            case 'cpf':
                $(this).data('validateFunction', isCpfValid)
                .mask('999.999.999-99')
                .css('text-align','center');
                break;
            case 'cnpj':
                $(this).data('validateFunction', isCnpjValid)
                .mask('99.999.999/9999-99')
                .css('text-align','center');
                break;
            case 'phone':
                $(this).mask('(99) 9999-9999')
                .css('text-align','center');
                break;
            case 'cep':
                $(this).mask('99.999-999')
                .css('text-align','center');
                break;
            case 'quote':
                $(this).maskMoney({
                    precision:7
                })
                .css('text-align','right');
                break;
            case 'float':
            case 'money':
                $(this).maskMoney()
                .css('text-align','right');
                break;
            case 'paginator':
                $(this).bind('keypress', $(this).number)
                .bind('keypress',function(e){
                    var e=e||window.event;
                    var k=e.charCode||e.keyCode||e.which;
                    if( k == 13 ){
                        $(this).trigger('blur');
                        return true;
                    }
                    var key = String.fromCharCode(k);
                    var lastPage = $(this).attr('lastpage');
                    var qtdCharLastPage = lastPage.length;
                    if( qtdCharLastPage > 1 ){
                        key = parseInt( $(this).val() + (key+'') );
                        if( key > lastPage || key <= 0 ){
                            return false;
                        }
                    } else {
                        if( key > lastPage || key <= 0 ){
                            return false;
                        }
                    }
                });
                break;
            case 'number':
                $(this).bind('keypress', $(this).number);
                break;
            case 'float_zero_allowed':
            case 'money_zero_allowed':
                $(this).maskMoney()
                .css('text-align','right');
                break;
            case 'number_zero_allowed':
                $(this).bind('keypress', $(this).number);
                break;
            case 'date':
                $(this).data('validateFunction', isDateValid)
                .mask('99/99/9999')
                .css('text-align','center')
                .datepicker(configDefaultDatepicker);
                break;
            case 'init_date':
                $(this).data('validateFunction', isInitDateValid)
                .mask('99/99/9999')
                .css('text-align','center')
                .datepicker(configDefaultDatepicker);
                break;
            case 'final_date':
                $(this).data('validateFunction', isFinalDateValid)
                .mask('99/99/9999')
                .css('text-align','center')
                .datepicker(configDefaultDatepicker);
                break;
            case 'init__date':
                $(this).data('validateFunction', isDateValid)
                .mask('99/9999')
                .css('text-align','center')
                break;
            case 'final__date':
                $(this).data('validateFunction', isDateValid)
                .mask('99/9999')
                .css('text-align','center')
                break;                 
            case 'date__m_y':
                $(this).data('validateFunction', isDateValid)
                .mask('99/9999')
                .css('text-align','center');
                break;
            case 'date_m_y':
                $(this).data('validateFunction', isDateValid)
                .mask('99/9999')
                .css('text-align','center');
                break;                
            case 'init_date__m_y':
                $(this).data('validateFunction', isInitDateValid)
                .mask('99/9999')
                .css('text-align','center')
                .datepicker($.extend(configDefaultDatepicker,{
                    "dateFormat":"mm/yy"
                }));
                break;
            case 'final_date__m_y':
                $(this).data('validateFunction', isFinalDateValid)
                .mask('99/9999')
                .css('text-align','center')
                .datepicker($.extend(configDefaultDatepicker,{
                    "dateFormat":"mm/yy"
                }));
                break;

            case 'date_less_than_today':
                $(this).data('validateFunction', isDateValidLessThanToday)
                .mask('99/99/9999')
                .css('text-align','center')
                .datepicker($.extend({
                    "maxDate":"-1d"
                },configDefaultDatepicker));
                break;
            case 'date_less_than_tomorrow':
                $(this).data('validateFunction', isDateValidLessThanTomorrow)
                .mask('99/99/9999')
                .css('text-align','center')
                .datepicker($.extend({
                    "maxDate":"d"
                },configDefaultDatepicker));
                break;
            case 'date_greater_than_today':
                $(this).data('validateFunction', isDateValidGreaterThanToday)
                .mask('99/99/9999')
                .css('text-align','center')
                .datepicker($.extend({
                    "minDate":"+1d"
                },configDefaultDatepicker));
                break;
            case 'date_greater_than_yesterday':
                $(this).data('validateFunction', isDateValidGreaterThanYesterday)
                .mask('99/99/9999')
                .css('text-align','center')
                .datepicker($.extend({
                    "minDate":"d"
                },configDefaultDatepicker));
                break;
            case 'email':
                $(this).data('validateFunction', isMailValid)
                .css('text-transform','lowercase');
                break;

            case 'valor_composto':
                $(this).data('validateFunction', isValorCompostoValid);
                break;
            case 'year':
                $(this).mask('9999')
                .css('text-align','center');
                break;
            case 'code_control':
                $(this).mask('****.****.****.****')
                .css({
                    "text-transform" : "uppercase",
                    "text-align"     : "center"
                })
                .blur(function(){
                    $(this).val( $(this).val().toUpperCase() );
                });
                break;
            case 'upper_case':
                $(this).css({
                    "text-transform" : "uppercase"
                })
                .blur(function(){
                    $(this).val( $(this).val().toUpperCase() );
                });
                break;
            case 'lower_case':
                $(this).css({
                    "text-transform" : "lowercase"
                })
                .blur(function(){
                    $(this).val( $(this).val().toLowerCase() );
                });
                break;
        }
        if( $(this).is('textarea') ){
            if( $(this).attr('maxlength') ){
                $(this).bind('keypress', $(this).limited);
            }
        }

        $(this).blur( $(this).baseValidate );
    //        $(this).bind('blur', $(this).baseValidate );
    });
}


/** ToolTip **/

/**
 * Método que exibe o toolTip
 * @param String         msg
 * @param objJquery        objJquery
 * @param boolean         ojbModal
 * @return void
 */
$.fn.showToolTip = function(msg){
    this.activateParentTab();
    var top   = this.offset().top;
    var left  = this.offset().left;

    removeToolTip();

    var toolTip   = '<div class="toolTip" style="top:'+(top - 50)+'px; left: '+(left)+'px;">';
    toolTip  += '	<div class="toolTipTexto">'+msg+'</div>';
    toolTip  += '	<div class="toolTipSeta"></div>';
    toolTip  += '	<div class="toolTipImg"></div>';
    toolTip  += '	<div class="toolTipBtn" onClick="removeToolTip();"></div>';
    toolTip  += '</div>';

    $(document.body).append(toolTip);

    var element = $(this);

    var targetOffset = this.offset().top;
    $('html,body').animate({
        scrollTop: targetOffset-70
    }, 500);
    if(!element.attr('readonly')){
        setFocusTimeout(element);
    }
    element.one('change',function(){
        removeToolTip();
    });

    $('.toolTip').removeClass('hidden');
    $('.toolTip span').height( $('.toolTip p').height() );

};

/**
 * Ativa a tab do obj caso ele esteja dentro de uma.
 * Retorna false ou o Obj da tab.
 * @return boolean
 */
$.fn.activateParentTab = function(){
    var parentTab = this.closest('.ui-tabs>div');
    if(parentTab.length > 0){
        parentTab.parent().tabs('select', $('#'+parentTab.parent().attr('id')+'>div').index(parentTab));
        return true;
    }else{
        return false;
    }
};

/**
 * Remove possive o toolTip visivel
 * @return void
 */
function removeToolTip()
{
    var toolTip = $(".toolTip");
    if(toolTip.length > 0){
        toolTip.remove();
    }
}





/**
 * Exibe as mensagens de validações retornadas no json da requisição ajax
 * @param retorno json
 * @return void
 */
function showPhpValidation(retorno){
    ajaxLoaded();
    //var arrId = new Array();
    //var arrMsg = new Array();
    var i;
    var j;
    var k;

    var elemForm;
    var msgForm;
    for(i in retorno.arrMessages){
        //arrId.push(i);
        elemForm = i;
        for(j in retorno.arrMessages[i]){
            //arrMsg.push(retorno.arrMessages[i][j]);
            msgForm = (retorno.arrMessages[i][j]);
            break;
        }
        break;
    }
    //if( typeof(arrMsg[0]) == 'object' ) {
    if( typeof(msgForm) == 'object' ) {
        //exibirei apenas o primeiro erro com subform
        var elemSubform;
        var msgSumform;
        for(k in retorno.arrMessages[i][j]){
            msgSumform = (retorno.arrMessages[i][j][k]);
            break;
        }
        elemSubform = i+'-'+j;
        $('#'+ elemSubform).showToolTip(msgSumform);
    } else {
        //exibirei apenas o primeiro erro
        //$('#'+ arrId[0]).showToolTip(arrMsg[0]);
        $('#'+ elemForm).showToolTip(msgForm);
    }
// subform
//{"error":true,"errorType":1,"arrMessages":{"procuracao":{"DT_VALIDADE":{"isEmpty":"Este campo n\u00e3o pode ser vazio"}}}}
// form
//{"error":true,"errorType":1,"arrMessages":{"DT_VALIDADE":{"isEmpty":"Este campo n\u00e3o pode ser vazio"}}}
}

/**
 * Exibe mensagem de erro a partir do json retornado pela requisição ajax
 * @param retorno json
 * @return
 */
function showPhpDbError(retorno){
    //      var msg = isset(retorno.errorMessage)?retorno.errorMessage:i18n.MN042;
    //    showDialog(msg, 'alert', retorno.urlRedirect, true);

    if( !retorno.errorMessage ){
        if( isset(retorno.urlRedirect) ){
            redirect( retorno.urlRedirect, retorno.arrData );
        }
    } else {
        if(count(retorno.arrData)>0){
            showDialog(retorno.errorMessage, 'alert',false, true, function(){
                redirect(retorno.urlRedirect,retorno.arrData,'post');
            });
        } else {
            showDialog(retorno.errorMessage, 'alert',retorno.urlRedirect, true);
        }
    }
}

/**
 * Exibe mensage de sucesso a partir do json retornado pela requisição ajax
 * @param retorno json
 * @return void
 */
function showPhpSuccess(retorno){
    if( !retorno.successMessage ){
        if( isset(retorno.urlRedirect) ){
            redirect( retorno.urlRedirect, retorno.arrData );
        }
    } else {
        if(count(retorno.arrData)>0){
            showDialog(retorno.successMessage, 'success',false, true, function(){
                redirect(retorno.urlRedirect,retorno.arrData,'post');
            });
        } else {
            showDialog(retorno.successMessage, 'success',retorno.urlRedirect, true);
        }
    }
}


/**
 * Função que checa os campos de senha
 *
 * @param object jQuery objSenha
 * @return boolean
 */
function checkPassword(objSenha){
    var objSenha = (isset(objSenha))?objSenha:$(this);

    var password  = $.trim( objSenha.val() );
    var minLength = objSenha.attr('minlength');
    if( password.length != 0 && password.length < minLength ){
        if( minLength == 6 ){
            objSenha.showToolTip(i18n.MSG002);
        }
        return false;
    }
    return true;
}

/**
 * Para checar se o CapsLock ta ativado
 * se sim retorna o showMsg com o aviso no elemento informado
 *
 * exemplo: onkeypress="checarCapsLock(event,$(this))"
 * @param event ev
 * @param object jQUery objQuery
 * @return void
 */
function checarCapsLock(ev,objQuery) {
    removeToolTip();

    var e = ev || window.event;
    var codigo_tecla = e.charCode||e.keyCode||e.which;
    var tecla_shift = e.shiftKey?e.shiftKey:((codigo_tecla == 16)?true:false);

    if(((codigo_tecla >= 65 && codigo_tecla <= 90) && !tecla_shift) || ((codigo_tecla >= 97 && codigo_tecla <= 122) && tecla_shift)) {
        objQuery.showToolTip(i18n.MSG003);
    }
}


/**
 * Função para validar se a data informada é maior/menor que a ontem/amanhã/atual
 *
 * @param object jQuery objJquery
 * @param string type
 * @return boolean
 */
function isDateValidGeneric(objJquery,type){
    removeToolTip();
    var value = objJquery.getValUnmasked();
    if(value != ''){
        if(!isDateValid(objJquery)){
            return false;
        }else{
            var str = objJquery.val();

            var data = new Date();

            var dia = data.getDate();
            var mes = (data.getMonth())+1;
            var ano = data.getFullYear();


            if(dia < 10) dia = '0' + dia;
            if(mes < 10) mes = '0' + mes;

            var data1 = str;
            var value = parseInt( data1.split( "/" )[2].toString() + data1.split( "/" )[1].toString() + data1.split( "/" )[0].toString() );

            var data2 = dia + '/' + mes + '/' + ano;
            var hoje  = parseInt( data2.split( "/" )[2].toString() + data2.split( "/" )[1].toString() + data2.split( "/" )[0].toString() );

            switch(type){
                case 'greaterThanToday':
                    if ( hoje >= value ){
                        objJquery.showToolTip(i18n.MSG004);
                        return false;
                    }else{
                        return true;
                    }
                    break;
                case 'greaterThanYesterday':
                    if ( hoje > value ){
                        objJquery.showToolTip(i18n.MSG005);
                        return false;
                    }else{
                        return true;
                    }
                    break;
                case 'lessThanToday':
                    if ( hoje <= value ){
                        objJquery.showToolTip(i18n.MSG006);
                        return false;
                    }else{
                        return true;
                    }
                    break;
                case 'lessThanTomorrow':
                    if ( hoje < value ){
                        objJquery.showToolTip(i18n.MSG007);
                        return false;
                    }else{
                        return true;
                    }
                    break;
                default:
                    showDialog(i18n.MSG010,'alert');
                    return false;
                    break;
            }
        }
    }
}

/**
 * Função para validar se a data informada é maior que a atual
 *
 * @param object jQuery objJquery
 * @return boolean
 */
function isDateValidGreaterThanToday(objJquery){
    return isDateValidGeneric(objJquery,'greaterThanToday');
}
/**
 * Função para validar se a data informada é maior que a ontem
 *
 * @param object jQuery objJquery
 * @return boolean
 */
function isDateValidGreaterThanYesterday(objJquery){
    return isDateValidGeneric(objJquery,'greaterThanYesterday');
}
/**
 * Função para validar se a data informada é menor que a ontem
 *
 * @param object jQuery objJquery
 * @return boolean
 */
function isDateValidLessThanToday(objJquery){
    return isDateValidGeneric(objJquery,'lessThanToday');
}
/**
 * Função para validar se a data informada é menor que a amanhã
 *
 * @param object jQuery objJquery
 * @return boolean
 */
function isDateValidLessThanTomorrow(objJquery){
    return isDateValidGeneric(objJquery,'lessThanTomorrow');
}

/**
 * Verifica e-mail válido
 * @param object JQuery
 * @return boolean
 */
function isMailValid(objJquery) {
    removeToolTip();
    if(objJquery.val() != ''){
        if(!isMail(objJquery.val())) {
            objJquery.showToolTip(i18n.MSG012);
            return false;
        }
        return true;
    }else{
        return true;
    }
}

/**
 * Verifica se uma string é um email valido
 * @param mail
 * @return boolean
 */
function isMail(mail){
    var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
    if(typeof(mail) == "string"){
        if(er.test(mail)){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * Verifica se a data é válida
 * @param objJquery
 * @return boolean
 */
function isInitDateValid(objJquery){
    if( !isDateValid(objJquery) ){
        return false;
    }
    var objInitDate  = objJquery;
    var objFinalDate = $(objJquery.attr('dependent'));
    var comparer     = compareDate(objInitDate, objFinalDate);
    if( comparer >= 0 ){
        return true;
    } else {
        objJquery.showToolTip(i18n.MSG008);
        return false;
    }
}

/**
 * Verifica se a data é válida
 * @param objJquery
 * @return boolean
 */
function isFinalDateValid(objJquery){
    if( !isDateValid(objJquery) ){
        return false;
    }

    var objFinalDate = objJquery;
    var objInitDate  = $(objJquery.attr('dependent'));
    var comparer     = compareDate(objInitDate, objFinalDate);
    if( comparer >= 0 ){
        return true;
    } else {
        objJquery.showToolTip(i18n.MSG009);
        return false;
    }
}

/**
 * Verifica se a data é válida
 * @param objJquery
 * @return boolean
 */
function isDateValid(objJquery){
    removeToolTip();
    var value = objJquery.getValUnmasked();
    if(value != ''){
        var data = new Date();
        switch(  value.length ){
            case 8:
                data = data.parseDate(objJquery.val(), 'dd/mm/yyyy');
                break;
            case 6:
                data = data.parseDate(objJquery.val(), 'mm/yyyy');
                break;
            default:
                data = false;
                break;
        }
        if(!data) {
            objJquery.showToolTip(i18n.MSG011);
            return false;
        }
        return true;
    }else{
        return true;
    }
}
/**
 * Verifica se uma string é um CPF
 */
function isCPF(str){
    if (!str){
        return false;
    }

    str = str.replace('.','');
    str = str.replace('.','');
    str = str.replace('-','');

    var c = str.substr(0,9);

    if( c == "000000000" +''
        || c == "111111111" +''
        || c == "222222222" +''
        || c == "333333333" +''
        || c == "444444444" +''
        || c == "555555555" +''
        || c == "666666666" +''
        || c == "777777777" +''
        || c == "888888888" +''
        || c == "999999999" ){
        return false;
    }

    var dv = str.substr(9,2);
    var d1 = 0;
    for (i = 0; i < 9; i++){
        d1 += c.charAt(i)*(10-i);
    }

    if (d1 == 0){
        return false;
    }

    d1 = 11 - (d1 % 11);
    if (d1 > 9) d1 = 0;
    if (dv.charAt(0) != d1){
        return false;
    }

    d1 *= 2;
    for (i = 0; i < 9; i++){
        d1 += c.charAt(i)*(11-i);
    }
    d1 = 11 - (d1 % 11);
    if (d1 > 9) d1 = 0;
    if (dv.charAt(1) != d1){
        return false;
    }
    return true;
}

/**
 * Verifica se o valor do campo é um CPF
 *
 * @param objJquery
 * @return boolean
 */
function isCpfValid(objJquery) {
    removeToolTip();
    var cpf = objJquery.getValUnmasked();
    if( cpf.length == 11 ){
        if( !isCPF( cpf ) ){
            objJquery.showToolTip(i18n.MSG013);
            return false;
        } else {
            return true;
        }
    }
    return false;
}

/**
 * Verifica se a string é um cnpj
 *
 * @param String str
 * @return
 */
function isCNPJ(str){
    if (!str){
        return false;
    }

    str = str.replace('.','');
    str = str.replace('.','');
    str = str.replace('/','');
    str = str.replace('-','');

    if (str.length != 14){
        return false;
    }

    if ((str.indexOf("-") != -1) || (str.indexOf(".") != -1) || (str.indexOf("/") != -1)){
        return false;
    }

    var df, resto, dac = "";

    df = 5*str.charAt(0)+4*str.charAt(1)+3*str.charAt(2)+2*str.charAt(3)+9*str.charAt(4)+8*str.charAt(5)+7*str.charAt(6)+6*str.charAt(7)+5*str.charAt(8)+4*str.charAt(9)+3*str.charAt(10)+2*str.charAt(11);
    resto = df % 11;
    dac += ( (resto <= 1) ? 0 : (11-resto) );
    df = 6*str.charAt(0)+5*str.charAt(1)+4*str.charAt(2)+3*str.charAt(3)+2*str.charAt(4)+9*str.charAt(5)+8*str.charAt(6)+7*str.charAt(7)+6*str.charAt(8)+5*str.charAt(9)+4*str.charAt(10)+3*str.charAt(11)+2*parseInt(dac);
    resto = df % 11;
    dac += ( (resto <= 1) ? 0 : (11-resto) );

    if (dac != (str.substring(str.length-2,str.length))){
        return false;
    }
    return true;
}

/**
 * Verifica se o valor do campo é um CNPJ
 *
 * @param objJquery
 * @return boolean
 */
function isCnpjValid(objJquery){
    removeToolTip();
    var cnpj = objJquery.getValUnmasked();
    if( cnpj.length == 14 ){
        if( !isCNPJ( cnpj ) ){
            objJquery.showToolTip(i18n.MSG014);
            return false;
        } else {
            return true;
        }
    }
    return false;
}
/**
 * Verifica se o conteudo do input é composto
 * @param objJquery
 *
 * @return boolean
 */
function isValorCompostoValid(objJquery){
    removeToolTip();
    var str = trim(objJquery.val());
    if(str != ''){
        var espaco = str.indexOf(" ");
        if(espaco == -1){
            objJquery.showToolTip(i18n.MSG015);
            return false;
        }else{
            var menos = str.charCodeAt(espaco-1);
            var mais = str.charCodeAt(espaco+1);
            if(menos == '32' || mais == '32'){
                return false;
            }else{
                return true;
            }
        }
    } else {
        return false;
    }
}

// limita campo textarea [change][keyup]
function textLimit(campo, tam, count) {
    if(campo.value.length >= tam)
        campo.value = campo.value.substr(0, tam);
    if(count){
        $('#' + count).html(campo.value.length + '');
    }
}

$.fn.floatVal = function(){
    return parseFloat(this.getValUnmasked().replace(',','.'));
};
/**
 * Retorna as informações de um input sem a máscara.
 *
 * @param ARRAY arrAddCaracteres com os caracteres que são para remover do valor também.
 * @return o valor sem os caracteres de mascara e/ou os caracteres no array enviado por parâmetro.
 */
$.fn.getValUnmasked = function(arrAddCaracteres) {
    var sValue = $(this).val();
    sValue = sValue.toString().replace( /[\-\.\/\:\_\s]/g, "" );
    if( arrAddCaracteres ){
        var i;
        var j;
        for(j=0;j<arrAddCaracteres.length;j++){
            i = 0;
            while ( i < sValue.length ){
                sValue = sValue.toString().replace( arrAddCaracteres[j], "" );
                i++;
            }
        }
    }
    return sValue;
};

/**
 * Limpa os campos do formulario
 */
$.fn.clearForm = function() {
    return this.each(function() {
        var type = this.type, tag = this.tagName.toLowerCase();
        if (tag == 'form')
            return $(':input',this).clearForm();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden')
            this.value = '';
        else if (type == 'checkbox' || type == 'radio')
            this.checked = false;
        else if (tag == 'select')
            this.value = '';
    });
};


$.fn.number = function(e) {
    e=e||window.event;
    var k=e.charCode||e.keyCode||e.which;
    var strCheck = '0123456789';
    var keysOk = [0,8,9,13];
    var key = String.fromCharCode(k);
    if( $.inArray(k,keysOk)   != -1 ){
        return true;
    }
    if( strCheck.indexOf(key) == -1 ){
        return false;
    }
};

/**
 * Limita a quantidade dos caracteres de um textarea a partir do atributo
 * maxlenght
 *
 */
$.fn.limited = function() {
    $(this).keyup(function() {
        textLimit(this, this.getAttribute('maxlength'), this.getAttribute('target'));
    });
    $(this).change(function() {
        textLimit(this, this.getAttribute('maxlength'), this.getAttribute('target'));
    });
};

/**
 * Verifica se o input possui um valor de moeda válido
 * @param objQuery
 *
 * @return boolean
 */
function isMoneyValid(objQuery){
    removeToolTip();
    if(!(objQuery.getValUnmasked(',')>0)){
        objQuery.showToolTip(i18n.MSG001);
        return false;
    }
    return true;
};

/**
 * Seta o foco depois de 50 ms (default)
 *
 * @param object jQuery objQuery
 * @param integer time
 * @return void
 */
function setFocusTimeout(objQuery,time){
    time = isset(time)?time:50;
    setTimeout(function(){
        objQuery.focus();
    },time);
}

/**
 * Função que controla a visibilidade do grupo
 * informado apartir do valor do 'change'
 * do elemento informado
 *
 * @param string manager = string com o id ou a classe ex.: '#id_do_elemento' ou '.classe-do-elemento'
 * @param json group     = json com a relacao valor e elemento ex.: {'valor1':'elemento1','valor2':'elemento2'}
 * @return void
 */
function groupVisibilityManager(manager,group,callback){
    var objManager = $(manager);
    if( objManager.length > 0 ){
        var func = function(){
            var idxShow = $(this).val();
            if( group ){
                var groupPrev = null;
                for( var i in group ){
                    if( groupPrev == group[i] && i != idxShow ){
                        //                        alert( group[i] + ' igual  ' + groupPrev );
                        continue;
                    }
                    if( i == idxShow ){
                        //                        alert( 'show: '+ group[i] + ' value: ' + i  );
                        $(group[i]).show();
                    } else {
                        //                        alert( 'hide: '+ group[i] + ' value: ' + i  );
                        $(group[i]).hide();
                    }
                    groupPrev = group[i];
                }
            }
            if( $.isFunction(callback) ){
                callback();
            }
        };
        objManager.bind('change',func);
        objManager.bind('click',func);
    }
}

/**
 * Função que clona o valor de "fromElement"
 * no "blur" do mesmo para o valor de "toElement"
 *
 * @param object jQuery fromElement
 * @param object jQuery toElement
 * @return boolean
 */
function setCloneValue(fromElement,toElement){
    if( !fromElement.length ) {
        return false;
    }
    if( !toElement.length ) {
        return false;
    }
    fromElement.bind('blur',function(){
        toElement.val($(this).val());
    });
}

/**
 * Função que clona o valor de "fromElement" para o valor de "toElement"
 *
 * @param object jQuery fromElement
 * @param object jQuery toElement
 * @return toElement
 */
function cloneValue(fromElement,toElement){
    if( !fromElement.length ) {
        return false;
    }
    if( !toElement.length ) {
        return false;
    }
    toElement.val(fromElement.val());
    return toElement;
}

/**
 * Associa o valor do indice de 'rs'
 * para o campo do indice de 'indexFields'
 * setando o campo como readonly
 * se 'setFieldsReadonly' for igual a true
 * e/ou
 * setando o campo como disabled
 * se 'setFieldsDisabled' for igual a true
 *
 *
 * @param object rs
 * @param object indexFields
 * @param boolean setFieldsReadonly
 * @param boolean setFieldsDisabled
 * @return void
 */
function basePopulate(rs,indexFields,setFieldsReadonly,setFieldsDisabled){
    if( !rs ){
        setFieldsReadonly = false;
    }
    var field;
    var i;
    var value;
    for(i in indexFields){
        field = $(indexFields[i]);
        if( !field.length ) {
            //            showDialog( 'Erro ao carregar os dados:<br />Campo '+indexFields[i]+' não existe.' ,'alert' );
            //            return false;
            continue;
        }
        value = ( !rs[i] )?undefined:rs[i];
        //value = ( !rs[i] )?'':rs[i];
        field.val(value);
        field.trigger('change');
        if( setFieldsReadonly != undefined ){
            if( setFieldsReadonly ){
                field.attr('readonly','readonly');
            } else {
                field.removeAttr('readonly');
            }
        }
        if( setFieldsDisabled != undefined ){
            if( setFieldsDisabled ){
                field.attr('disabled','disabled');
            } else {
                field.removeAttr('disabled');
            }
        }
    }
}


/**
 * Função que faz a requisição AJAX para montar os campos de cidade pela a uf
 *
 * @param string municipio
 * @return void
 */
$.fn.getMunicipioByUf = function(municipio){
    var objMunicipio = $(municipio);
    var txUf = $(this).find(':selected').text();
    var cdUf = $(this).val();

    if( !objMunicipio.length ) {
        showDialog( 'Erro ao mostrar as cidades da UF <b>'+txUf+'</b><br />Combo de cidade não existe.' ,'alert' );
        return false;
    }
    objMunicipio.empty();
    if( !cdUf ){
        objMunicipio.html('<option value="">Selecione</option>');
        return false;
    }
    $.ajax({
        type: "POST",
        url: systemName + '/generic/get-municipio-by-uf',
        data: {
            'uf':cdUf
        },
        async: false,
        dataType: 'json',
        success: function(retornoSuccess){
            if( $.isArray(retornoSuccess) ){
                if( retornoSuccess.length > 0 ){
                    var opt = '<option value="">Selecione</option>';
                    for( var i in retornoSuccess ){
                        opt += '<option value="'+retornoSuccess[i].CD_MUNICIPIO+'">'+retornoSuccess[i].TX_MUNICIPIO+'</option>';
                    }
                    objMunicipio.html(opt);
                    setFocusTimeout(objMunicipio);
                    return;
                }
            }
            showDialog( 'Erro ao mostrar as cidades da UF <b>'+txUf+'</b><br /> Uf sem cidades cadastradas.','alert' );
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            showDialog( 'Erro ao mostrar as cidades da UF <b>'+txUf+'</b><br /> Ajax Failure.','alert' );
        }
    });
};

/**
* Exibe o inspetor do BoxGrid
* @return void
*/
function toggleBoxGrid(){
    var vBox = $('.vBox');
    var hBox = $('.hBox');
    try{
        if(vBox.size() == 0 && hBox.size()==0){
            throw 'nenhum BaseForm encontrado';
        }
        if( true === $.browser.mozilla || true === $.browser.webkit ){
            hBox.toggleClass('hBoxGrid',500);
            vBox.toggleClass('vBoxGrid',500);
        } else {
            hBox.toggleClass('hBoxGrid');
            vBox.toggleClass('vBoxGrid');
        }
    }catch(e){
        alert(e);
    }

}
