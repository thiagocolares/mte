 /******************************
  * base.global.js             *
  *                            *
  * comuns para todo o sistema *
  ******************************/

function formatMoney(num) {
	num = num.toString().replace(/\$|\,/g, '');
	if (isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10)
		cents = "0" + cents;
	for ( var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + '.'
				+ num.substring(num.length - (4 * i + 3));
	return (((sign) ? '' : '-') + 'R$ ' + num + ',' + cents);

}

function setPreventExit(){
//    window.onbeforeunload = function (e) {
//        if(!e) e = window.event;
//        //e.cancelBubble is supported by IE - this will kill the bubbling process.
//        e.cancelBubble = true;
//        e.returnValue = i18n.ER048; //This is displayed on the dialog
//
//        //e.stopPropagation works in Firefox.
//        if (e.stopPropagation) {
//            e.stopPropagation();
//            e.preventDefault();
//        }
//    };
}

function unsetPreventExit(){
//    window.onbeforeunload = function(){};
}

function isset(something){
    return something!==undefined;
}

function count(object) {
    var o=0;
    for( var i in object){o++;}
    return o;
}

function isArray( value ){
    return ( typeof(value)=='object' && !isset(value.jquery) && isset(value.length) );
}

function strpos( haystack, needle, offset){
    var i = (haystack+'').indexOf(needle, (offset ? offset : 0));
    return i === -1 ? false : i;
}

function roundNumber (rnum) {
   return Math.round(rnum*Math.pow(10,2))/Math.pow(10,2);
}

function trim(str, chars) {
    return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

/**
 * Função que executa um redirect com parametros por GET ou por POST
 *
 * @param string controllerAction
 * @param mixed  params
 * @param string type
 * @param boolean hasLoading
 * @return mixed
 */
function redirect(controllerAction,params,type,hasLoading){
    unsetPreventExit();

    hasLoading = isset(hasLoading)?hasLoading:true;
    if( hasLoading === true ){
        ajaxLoading();
    }

    type = !isset(type)?'get':'post';
    var url = '';

    if( controllerAction === false ){
        return false;
    }
    if( !isset(controllerAction) ){
        return false;
    }
    if( controllerAction === '' ){
        return window.location = url;
    }

    if( type === 'get' ){
        params = !isset(params)?'':params;
        var parameters = '';
        if( typeof(params)=='object' ){
            if( isset(params.jquery)){
                parameters = '?'+params.serialize();
            } else {
                for( var i in params ){
                    if( isset(params.i) ){
                        parameters += '/' + i + '/' + params.i;
                    } else {
                        parameters += '/' + i + '/' + params[i];
                    }
                }
            }
        } else {
            params = (params != '')? '/' + params:'';
            parameters = params;
        }
        if( parameters != '' ){
            var arrControllerAction = new Array();
            arrControllerAction = controllerAction.split('/');
            if( !isset(arrControllerAction[1]) ){
                controllerAction += '/index';
            } else if( arrControllerAction[1] == '' ){
                controllerAction += 'index';
            }
        }
        url = baseUrl + '/' + controllerAction + parameters;
        return window.location = url;
    } else {
        url = baseUrl + '/' + controllerAction;
        var formRedirect = mountHiddenForm('formRedirect',url,params);
        return formRedirect.submit();
    }
}

/**
 * Função que monta um form com campos ocutos
 *
 * @param string id
 * @param string action
 * @param mixed data
 * @param string container
 * @return object jQuery
 */
function mountHiddenForm(id,action,data,container){
    container = isset(container)?container:'body';
    var formXhtml  = '<form action="'+action+'" method="post" id="'+id+'">';
    $('#'+id).remove();
    if( typeof(data)=='object' ){
        if( isset(data.jquery)){
            data.each(function(i,elem){
                formXhtml += '<input type="hidden"';
                formXhtml += '       id="'+$(this).attr('id')+'"';
                formXhtml += '       name="'+$(this).attr('name')+'"';
                formXhtml += '       value="'+$(this).val()+'"';
                formXhtml += '/>';
            });
        } else {
            var value = '';
            for( var i in data ){
                if( isset(data.i) ){
                    value = data.i;
                } else {
                    value = (!isset(data[i]))?'':data[i];
                }
                if( isArray(value) ){
                    for( var o=0;o<value.length;o++ ){
                        formXhtml += '<input type="hidden"';
//                        formXhtml += '       id="'+i+'-'+value+'"';
                        formXhtml += '       name="'+i+'[]"';
                        formXhtml += ' value="'+value[o]+'"';
                        formXhtml += '/>';
                    }
                } else {
                    formXhtml += '<input type="hidden"';
//                    formXhtml += '       id="'+i+'"';
                    formXhtml += '       name="'+i+'"';
                    formXhtml += ' value="'+value+'"';
                    formXhtml += '/>';
                }
            }
        }
    }
    formXhtml += '</form>';
    $(container).append(formXhtml);
    return $(container+' #'+id);
}

function onKeyEnter( objQuery , callback ){
    objQuery.bind('keyup',function(e){
        var e=e||window.event;
        var k=e.keyCode||e.which;
        if( k == 13 ){
            if($.isFunction(callback)){
                setTimeout(callback, 50);
            }else{
                setTimeout('eval('+ callback +');', 50);
            }
        }
    });
}

/**
 * Função que abre o popup do relatório...
 *
 * @param string path
 * @param object params
 * @return void
 */
function openPopup( path, params ) {
    params = $.extend({"width"   : "640"}    , params); // largura do popup
    params = $.extend({"height"  : "480"}    , params); // altura do popup
    params = $.extend({"popupId" : "JANELA"} , params); // id do popup
    params = $.extend({"scrollbars" : "no"}  , params); // popup tem scrollbar

    var jan = window.open(
        path,
        params.popupId,
        "width = "+ params.width  +", "
       +"height= "+ params.height +", "
       +"directories=no, "
       +"channelmode=no, "
       +"fullscreen=no, "
       +"location=no, "
       +"menubar=no, "
       +"resizable=yes, "
       +"scrollbars="+ params.scrollbars +", "
       +"status=no, "
       +"titlebar=no, "
       +"toolbar=no");

    if( jan != null ){
        jan.focus();
    }
}
/**
 * Função chama o popup do relatório...
 *
 * @param mixed  form
 * @param string action
 * @param object params
 * @return void
 */
function gerarRelatorio( form, action, params ){
    if(typeof(form)=='string'){
        form = $(form);
    }
    if(typeof(form)=='object'){
        if( !form.jquery  ){
            form = mountHiddenForm('reportForm', action, form);
        }
    }
    if( !form.length ){
        showDialog('Erro: Form não existente.','alert');
        return false;
    }

    if( action == '' ){
        return false;
    }

    params = $.extend({"width":"985"},params);
    params = $.extend({"height":"550"},params);

    if(form){
        form.attr({
            'action':action,
            'method':'post',
            'target':'new'
        });
    }
    openPopup( action, params );
    if(form){
        form.attr('target', 'JANELA');
        form.submit();
    }
}

/**
 * Remove possive o toolTip visivel
 * @return void
 */
function removeDialog()
{
    var dialog = $("#dialog");
    if(dialog.length > 0){
        dialog.remove();
    }
}

/**
 * Cria um Dialog.
 * Quando TOP e LEFT não forem especificados o Dialog será centralizado.
 *
 * @param string             params.id
 * @param string             params.containerId
 * @param string             params.url
 * @param object             params.data
 * @param object             params.xhtml
 * @param string             params.title
 * @param integer            params.width
 * @param integer            params.height
 * @param object             params.buttons
 * @param boolean            params.closeOnEscape
 * @param function | string  params.actionButton
 *
 * @return void | boolean false;
 *
 * @sample loadDialog({
 *              "id"       : 'testeDialog', // obrigatorio
 *              "title"    : 'TESTE DE DIALOG', // opcional
 *
 *              "buttons"  : {
 *                  "label1" : function(){alert('vc clicou e não vai fechar')},
 *                  "label2" : function() {alert('vc clicou e vai fechar');closeDialog('id'));}
 *              } // opcional
 *
 *              "xhtml" : '<div>qualquer xhtml</div>',// SEM AJAX
 *              // ou esses //
 *              "url"      : systemName + '/gerenciamento-teste-caso-uso-analise/upload-file/pGet/vGet', // retorno da requisição AJAX
 *              "data"     : {'pPost1':'vPost1','pPost2':'vPost2'}, // opcional
 *          });
 *
 */
function loadDialog( params ){
    ajaxLoaded();
    var html = false;
    if( typeof(params)=='object' ){
        // ID é obrigatório
        if( !isset(params.id) ){ return false; }
        // se vier um XHTML
        if( isset(params.xhtml) ){
            var html = params.xhtml;
        // se vier uma URL com ou sem DATA
        } else if( isset(params.url) ){

            ajaxLoading();
            var html = $.ajax({
                                url      : params.url,
                                data     : params.data,
                                type     : 'POST',
                                dataType : 'html',
                                async    : false
                             }).responseText;
            ajaxLoaded();

            var charIni = '{';
            var charEnd = '}';
            if( html.indexOf(charIni) == 0 && html.indexOf(charEnd) == html.length-1 ){
                eval( "html = "+html+";" );
                if( typeof(html)=='object' ){
                    if(html.error){
                        switch(html.errorType){
                            case 1:
                                showPhpValidation(html);
                                break;
                            case 2:
                                showPhpDbError(html);
                        }
                    }else{
                        showPhpSuccess(html);
                    }
                    return false;
                }
            }
        }

    } else {
        return false;
    }

    // definindo o id com ID
    var id            =  params.id;
    // definindo o contentor com o CONTAINERID
    var containerId   = (params.containerId   != undefined) ? params.containerId   : false;
    // definindo o titulo com o TITLE
    var title         = (params.title         != undefined) ? params.title         : '';
    // definindo a largura com o WIDTH
    var width         = (params.width         != undefined) ? params.width         : 600;
    // definindo a altura com o LENGHT
    var height        = (params.height        != undefined) ? params.height        : 'auto';
    // definindo a se fecha ao precionar o ESC com o CLOSEONESCAPE
    var closeOnEscape = (params.closeOnEscape != undefined) ? params.closeOnEscape : true;
    // definindo os botões com o BUTTONS
    if(params.buttons != undefined){
        var buttons = params.buttons;
    } else {
        var buttons = {
            Ok : function() {
                closeDialog(id);
                //$("#"+id).remove();
                if(params.actionButton != undefined){
                    if($.isFunction(params.actionButton)){
                        setTimeout(params.actionButton, 100);
                    }else{
                        setTimeout('eval('+ params.actionButton +');', 100);
                    }
                }
            }
        };
    }

    $("#"+id).remove();

    if( !html ){ return false; }

    var strHtml  = '<div id="'+ id +'" title="'+ title +'" style="display:none;">';
        strHtml += html;
        strHtml += '</div>';

    var container = (containerId) ? 'body #'+ containerId : 'body';

    $(container).append(strHtml);

    $("#"+id).dialog({
        dragStart: function(event, ui) { removeToolTip();$(this).css('visibility','hidden'); },
        dragStop: function(event, ui) { removeToolTip();$(this).css('visibility','visible'); },
        bgiframe      : true,
        shadow        : true,
        modal         : true,
        width         : width,
        height        : height,
        closeOnEscape : closeOnEscape,
        buttons       : buttons

    });

    setupInputs($("#"+id));
    setButtonsHovers($("#"+id));
    $(".ui-icon-closethick").bind('click',function(){closeDialog( id );});
}
function closeDialog( idDialog ){
    removeToolTip();
    //  ação de fechar padrao do Dialog  //
    beforeCloseDialog();                 //
    $('#'+idDialog).dialog('close');     //
    while( $('#'+idDialog).length == 1){ //
        $('#'+idDialog).remove();        //
    }                                    //
    afterCloseDialog();                  //
    ///////////////////////////////////////
}
function beforeCloseDialog(){ return true; }
function  afterCloseDialog(){ return true; }

/**
 *
 * @param msg
 * @param type
 * @param urlRedirect
 * @param modal
 * @param callbackSuccess
 * @return
 */
function showDialog(msg, type, urlRedirect, modal, callbackSuccess){
    ajaxLoaded();
    removeToolTip();
    removeDialog();
    var color = (type == "success")? "#54aa3c" : "#cd0a0a";
    type  = (type == "success")? "ui-icon-circle-check ui-icon-green":"ui-icon-alert ui-icon-red";
    var element  =    '<div id="dialog" title="Mensagem">';
        element +=        '<p style="color:'+color+'">';
        element +=            '<span class="ui-icon '+ type +'" style="float:left; margin:0 7px 50px 0;"></span>';
        element +=            msg;
        element +=        '</p>';
        element +=    '</div>';
    $(document.body).append(element);
    modal = !isset(modal)?!modal:modal;
    $("#dialog").dialog({
        dragStart: function(event, ui) { removeToolTip();$(this).css('visibility','hidden'); },
        dragStop: function(event, ui) { removeToolTip();$(this).css('visibility','visible'); },
        bgiframe: true,
        dialogClass: 'hide-close-button',
        modal: modal,
        closeOnEscape: false,
        buttons: {
            Ok: function() {
                if($.isFunction(callbackSuccess)){
                    callbackSuccess();
                }
                if(urlRedirect !== false && urlRedirect != undefined){
                    redirect(urlRedirect);
                }
                $(this).dialog('close');
                $(this).remove();
                ajaxLoaded();
            }
        }
    });
}

/**
 * Função que substitui o CONFIRM padrão do JS.
 *
 * @param STRING  msg  ( mensagem do alert )
 * @param BOOLEAN funcaoSim ( função se TRUE )
 * @param BOOLEAN funcaoNao ( função se FALSE )
 * @param STRING  title  ( texto do titulo )
 * @param INT  height  ( altura do dialog )
 * @param INT  width  ( comprimento do dialog )
 */
function showConfirmDialog(msg, funcaoSim, funcaoNao, title, height, width)
{
    ajaxLoaded();
    removeToolTip();
    removeDialog();

    var title = (title)?title:'Confirmação';

    var strHtml = "<div id=\"dialog\" title=\""+title+"\" style=\"display:none;\">";
    strHtml += "      <p>";
    strHtml += "        <span class=\"ui-icon ui-icon-help\" style=\"float:left; margin:0 7px 50px 0;\"></span>";
    strHtml +=          msg;
    strHtml += "     </p>";
    strHtml += "</div>";


    $('body').append(strHtml);

    var height = (height)? height : 'auto';
    var width  = (width) ? width  : 300;

    $("#dialog").dialog({
        dragStart: function(event, ui) { removeToolTip();$(this).css('visibility','hidden'); },
        dragStop: function(event, ui) { removeToolTip();$(this).css('visibility','visible'); },
        bgiframe: true,
        resizable: true,
        height: height,
        width: width,
        modal: true,
        shadow: true,
        overlay: {
            backgroundColor: '#000',
            opacity: 0.5
        },
        buttons: {
            "Não": function() {
                $(this).dialog('close');
                $(this).remove();
                if(funcaoNao != ""){
                    if($.isFunction(funcaoNao)){
                        setTimeout(funcaoNao, 100);
                    }else{
                        setTimeout('eval('+ funcaoNao +');', 100);
                    }
                }
            },
            "Sim": function() {
                $(this).dialog('close');
                $(this).remove();

                if(funcaoSim != ""){
                    if($.isFunction(funcaoSim)){
                        setTimeout(funcaoSim, 100);
                    }else{
                        setTimeout('eval('+ funcaoSim +');', 100);
                    }
                }
            }
        }
    });
}

/**
 * coloca na tela uma mensagem enquanto carrega o AJAX...
 *
 * @param string msg
 * @return void
 */
function ajaxLoading( msg ){
    removeToolTip();
    removeDialog();
    msg = (!isset(msg))?i18n.MSG000:msg;

    $('#ajaxLoadingDialog').remove();

    var strHtml = '<div id="ajaxLoadingDialog" class="ajaxLoading" title="'+msg+'" style=\"display: none;\"></div>';
    $('body').prepend(strHtml);

    $("#ajaxLoadingDialog").dialog({
//        dragStart: function(event, ui) { removeToolTip();$(this).css('visibility','hidden'); },
//        dragStop: function(event, ui) { removeToolTip();$(this).css('visibility','visible'); },
//        draggable: false,
        closeOnEscape: false,
        minHeight: 60,
        minWidth: 150,
        modal: true,
        resizable: false,
        shadow: true
    });
    $("#ajaxLoadingDialog").prev().find('a').remove();
}

/**
 * depois que o AJAX carregou...
 *
 * @return void
 */
function ajaxLoaded(){
    setTimeout(function(){$('#ajaxLoadingDialog').dialog('close');},100);
}
/*
 * Função que abre um pop-up com as informações do relatório em iReports
 * @param: formName - Recebe o id do formulário para enviar os dados
 * @param: reportName - Nome do relatório do iReport
 * @param: params - Recebe os parâmetros adicionais para o relatório
*/
function generateReport(formName, reportName, params) {

	if(params == undefined){
		params = '';
	}
		
	//verifica se a variável e vazia	
	ajaxLoading();
    var strFormName = '#'+formName;

	$.ajax({
        url: '/relatorio/ajax-relatorio/relatorio/'+reportName,
        async: false,
        type: 'POST',
        data: $(strFormName).serialize() + params,
        dataType: 'json',
        success: function(retorno) {
            if(retorno != 'false') {
				//Incluindo a função para gerar o relatório em um novo pop-up
				openPopup('/reports/'+retorno,800,600,'yes');
				//Comentado a função para abrir o pop-up direto.
                //window.open('/reports/'+retorno,'page','toolbar=no,location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600');
            } else {
                showDialog('Não existem informações a serem exibidas para este relatório! Favor efetuar uma nova pesquisa.', 'error');
            }
	     $('#ajaxLoadingDialog').dialog('close');
        }
    });
	
}

function relatorioExcel(nome_relatorio, periodo){
	ajaxLoading();
	$.ajax({
        url: '/relatorio/ajax-relatorio/relatorio/'+nome_relatorio,
        async: false,
        type: 'POST',
        data: 'mes = '+periodo,
        dataType: 'json',
        success: function(retorno) {
            if(retorno != 'false') {
				//Incluindo a função para gerar o relatório em um novo pop-up
				openPopup('reports/'+retorno,800,600,'yes');
				//Comentado a função para abrir o pop-up direto.
                //window.open('/reports/'+retorno,'page','toolbar=no,location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600');
            } else {
                showDialog('Não existem informações a serem exibidas para este relatório! Favor efetuar uma nova pesquisa.', 'error');
            }
	     $('#ajaxLoadingDialog').dialog('close');
        }
    });
}

/**
 * Função que abre o popup do relatório...
 * 
 * @param STRING path
 * @param STRING width
 * @param STRING height
 * @autor: Wunilberto Rocha Melo
 */
function openPopup( path, width, height, scrollbars) {
    var w = (width)?width:'800';
    var h = (height)?height:'600';
    var s = (scrollbars)?scrollbars:'no';
    var jan = window.open( path, "JANELA", "width = "+w+", height= "+h+", directories=no, channelmode=no, fullscreen=no, location=no, menubar=no, resizable=no, scrollbars="+s+", status=no, titlebar=no, toolbar=no");
    jan.focus();
}

/**
 * Função que retorna a data atual no padrão brasileiro
 * 
 * @autor: Thiago Colares
 */

function getDate(){
	
	var objDate = new Date();
	var day = ""+objDate.getDate();
	var month = ""+objDate.getMonth();
	var year = ""+objDate.getFullYear();
	var hour = ""+objDate.getHours();
	var min = ""+objDate.getMinutes();

	if (day.length == 1) {
		day = "0" + day; 
	}
	
	if (month.length == 1) {
		month = "0" + month; 
	}
	
	if (hour.length == 1) {
		hour = "0" + hour; 
	}
	
	if (min.length == 1) {
		min = "0" + min; 
	}
	
	var strDate = day + "/" + month + "/" + year + " " + hour + ":" + min;
	
	return strDate;

}
