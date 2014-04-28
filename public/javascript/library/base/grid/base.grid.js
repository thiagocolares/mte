 /***************************
  * base.grid.js            *    
  *                         *
  * funções e ações da grid *
  ***************************/


/**
 * Função que chama a grid
 *  exemplos:
 *   $('seletorDoConteinerDaGrid').loadGrid('controller/action',{'campo':'valor'});
 *   $('seletorDoConteinerDaGrid').loadGrid('controller/action',$(':input'),5); 
 *   $('seletorDoConteinerDaGrid').loadGrid('controller/action',null,2); 
 *   $('seletorDoConteinerDaGrid').loadGrid('controller/action'); 
 * 
 * @param string controllerAction  
 * @param mixed data = seletor do jQuery ou JSON com parametro e valor ou nulo  
 * @param integer page  
 * @return void 
 */
$.fn.loadGrid = function(controllerAction,data,page){
    if( !controllerAction ){
        return false; 
    }
    var gridContainer = $(this);
    if( !gridContainer.length ) { 
        return false; 
    }
    ajaxLoading();
    
    page = parseInt(page);
    page = ( !page )?1:( page<0 )?1:page;
    if( !data ) {
        data = {'page':page};
    } else if(typeof(data)=='object'){
        if( !data.jquery  ){
            data['page'] = page;
        } else {
            data = data.serialize() + '&page=' + page;
        }
    } else {
        var jaTemPage = strpos(data,'page');
        if( !jaTemPage ){
            data = data + '&page=' + page;
        } else {
            data = data.substr(0,jaTemPage+5) + page;
        }
    }
    
    gridContainer.data('filterGrid',data);
    gridContainer.data('controllerActionGrid',controllerAction);
    gridContainer.data('page',page);
    gridContainer.data('toggleButtonFunction',function(){
        paginatorGrid(gridContainer,false,true);
    });
    
    
    
    gridContainer.hide('blind');
                //.hide("clip", { direction: "vertical" }, 500);
    $.ajax({
        type: "POST",
        url: baseUrl + '/' + controllerAction,
        data: data,
        async: false,
        dataType : 'html',
        success: function(retornoSuccess){
            var charIni = '{';
            var charEnd = '}';
            if( retornoSuccess.indexOf(charIni) == 0 && retornoSuccess.indexOf(charEnd) == retornoSuccess.length-1 ){
                eval( "retornoSuccess = "+retornoSuccess+";" );
                if( typeof(retornoSuccess)=='object' ){
                    if(retornoSuccess.error){
                        gridContainer.html('');
                        gridContainer.data('filterGrid',false);
                        gridContainer.data('controllerActionGrid',false);
                        gridContainer.data('page',false);
                        gridContainer.data('toggleButtonFunction',false);
                        gridContainer.data('toggleButton',false);
                        switch(retornoSuccess.errorType){
                            case 1:
                                showPhpValidation(retornoSuccess);
                                break;
                            case 2:
                                showPhpDbError(retornoSuccess);
                        }
                    } else {
                        showPhpSuccess(retornoSuccess);
                    }
                }
            } else {
                gridContainer.show('blind');
                gridContainer.html(retornoSuccess);
                           //.show("clip", { direction: "vertical" }, 500);
                if( gridContainer.data('toggleButton') ){
                    gridContainer.find('h6 button').remove();
                }
                gridContainer.find('h6').append(gridContainer.data('toggleButton'));
                setButtonsHovers(gridContainer);
                setupInputs(gridContainer);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            gridContainer.html('');
            gridContainer.data('filterGrid',false);
            gridContainer.data('controllerActionGrid',false);
            gridContainer.data('page',false);
            gridContainer.data('toggleButtonFunction',false);
            gridContainer.data('toggleButton',false);
            showDialog( 'Erro ao montar a grid: <br /> Ajax Failure.','alert' );
        }
    });
    ajaxLoaded();
    return true;
};
/**
 * Função que pagina a grid
 *
 * @parent mixed grid
 * @param integer page
 * @param boolean isParent
 * @return void
 */
function paginatorGrid(grid,page,isParent){
    var gridContainer;
    isParent = (isset(isParent))?isParent:false;
    if( typeof(grid) == 'object' ){
        if( !grid.jquery ){
            return false;
        }
    } else {
        grid = $(grid);
    }

    gridContainer = (!isParent)?grid.parent():grid;
    
    page = (!page)?gridContainer.data('page'):page;
    
    gridContainer.loadGrid(
        gridContainer.data('controllerActionGrid'),
        gridContainer.data('filterGrid'),
        page
    );
}
/**
 * Variavel que guarda os intervals de recarregar das grids
 * 
 * @var Array
 */
var intervalGrids = new Array();
/**
 * Função que controla o recarregar da grid
 * 
 * @param object jQuery gridContainer
 * @param object jQuery toggleButton
 * @param string name
 * @return void
 */
function refreshToggleButtonGrid(gridContainer,toggleButton,name){
    if(toggleButton.hasClass('ui-state-active')){
        if(!isset(intervalGrids[name])){
            gridContainer.data('toggleButton',toggleButton);
            gridContainer.find('h6').append(gridContainer.data('toggleButton'));
            gridContainer.data('toggleButtonFunction')();
            intervalGrids[name] = setInterval(gridContainer.data('toggleButtonFunction'),60000);
        }
    } else {
        gridContainer.data('toggleButton',false);
        clearInterval(intervalGrids[name]);
        intervalGrids[name] = undefined;
    }
}

/**
 * Remove uma linha da grid
 * a função pode ser chamada por um elemento da linha da grid (td, span, button...)
 * exemplo: <button onclick="removeRow($('this'))>Remover</button>"
 * 
 * @param objectJquery obj
 * @return bool true
 */
function removeRow(obj){
    //vai remover a linha inteira
    var grid = obj.parents('.grid');
    obj.parents('tr').remove();
    zebraGridMaker(grid);
    toggleGridVisibility(grid);
    recalcularGrid(grid, '.parcela', '.total');
    return true;
}

/**
 * Remove todas as linhas da grid 
 * exemplo: <button onclick="removeAllLine('#idDaGrid')>Remover</button>"
 * 
 * @param mixed objGrid
 * @return
 */
function removeAllRows( objGrid ){

    if(typeof(objGrid)=='string'){
        objGrid = $(objGrid);
    }
    
    if( !objGrid.jquery ){
        showDialog('Erro: Grid não existente.','alert');
        return false;
    }    
    if( !objGrid.length ){
        showDialog('Erro: Grid não existente.','alert');
        return false;
    }
    
    objGrid.find('tbody tr').each(function(){
            $(this).remove();
    });
    toggleGridVisibility(objGrid);
}


/**
 * Altera a visisbilidade da grid caso o tbody possua linhas
 * 
 * @param objectJquery objGrid
 * @return bool
 */
//function toggleGridVisibility(objGrid){
//  var trs = objGrid.find('tbody').find('tr').not('.not-valid');
//  if(trs.length > 0){
//      if(objGrid.is(':visible')){
//          return false;
//      }
//      objGrid.show('blind');
//  }else{
//      if(objGrid.is(':visible')){
//          objGrid.hide('blind');
//      }else{
//          return false;
//      }
//  }
//  return true;
//}



function toggleGridVisibility(objGrid){
    var trs = objGrid.find('tbody').find('tr').not('.not-valid');
    if(trs.length > 0){
        if(objGrid.is(':visible')){
            objGrid.css('display','table');
            return false;
        }else{
            objGrid.show('blind');
        }
    }else{
        if(objGrid.is(':visible')){
            objGrid.hide('blind');
        }else{
            objGrid.css('display','none');
            return false;
        }
    }
    return true;
}

/**
 * Localiza um valor numa determinada grid
 * a pesquisa pode ser feita apenas em uma coluna utilizando a classe da coluna
 * o valor pode estar em um input ou diretamente na celula da tabela
 * 
 * @param objJquery objGrid 
 * @param string value 
 * @param string columnClass
 * @return boolean
 */
function findGridValue(objGrid, value, columnClass){
    if( !objGrid ) {
        showDialog('Erro: Informe a grid para a busca.','alert');
        return false;
    } else if(typeof(objGrid)=='string'){
        objGrid = $(objGrid);
    }

    if( !objGrid.length ){
        showDialog('Erro: Grid não existente.','alert');
        return false;
    }
    
    var existent = false;
    
    if(columnClass){
        objGrid.find('.'+columnClass).each(function(){
            if(!existent && $(this).text() == value){
                existent = true;
            }
        });
        objGrid.find('.'+columnClass+':input').each(function(){
            if(!existent && $(this).val() == value){
                existent = true;
            }
        });
    }

    objGrid.find(':input:hidden').each(function(){
        if(!existent && $(this).val() == value){
            existent = true;
        }
    });
    
    return existent;
}

/**
 * Função que recaucula os valores de 'objGrid' 
 * soma todos os valores de 'parcelasClass' em 'totalClass' 
 * 
 * @param object jQuery objGrid
 * @param string parcelaClass
 * @param string totalClass
 * @return void
 */
function recalcularGrid(objGrid,parcelaClass,totalClass){
    var total = parseFloat(0);
    objGrid.find(parcelaClass).each(function(){
        total += parseFloat($(this).floatVal().toFixed(2));
    });
    objGrid.find(totalClass).removeAttr('readonly').val(total.toFixed(2)).unmaskMoney().maskMoney().attr('readonly','readonly');
}

/**
 * Redesenha as cores da grid (cor-sim, cor-não)
 * 
 * @param mixed objGrid
 * @return void
 */
function zebraGridMaker( objGrid ){

    if( !objGrid ) {
        objGrid = $('.grid');
    } else if(typeof(objGrid)=='string'){
        objGrid = $(objGrid);
    }
    
    if( !objGrid.jquery ){
        showDialog('Erro: Grid não existente.','alert');
        return false;
    }    
    if( !objGrid.length ){
        showDialog('Erro: Grid não existente.','alert');
        return false;
    }
    
    objGrid.each(function(){
        var line=0;
        $(this).find('tbody tr').each(function(){
            var trObj = $(this);
            var trClassAdd = ( ++line % 2 == 0 )?'row-even':'row-odd';
            var trClassDel = (   line % 2 == 0 )?'row-odd':'row-even';
            trObj.removeClass(trClassDel)
                 .addClass(trClassAdd);
        });
    });
}

/**
 * Função que divido o valor por igual entre os elementos do seletor 'elementSelector'
 * (se o valor não for dividido igualmente o primeiro elemento recebe a diferença
 * 
 * @param mixed objGrid
 * @param string elementSelector
 * @param string valueToDivide = moneyMask
 * @return void
 */
function shareValueGrid(objGrid,elementSelector,valueToDivide){
    if( !objGrid ) {
        objGrid = $('.grid');
    } else if(typeof(objGrid)=='string'){
        objGrid = $(objGrid);
    }
    
    if( !objGrid.jquery ){
        showDialog('Erro: Grid não existente.','alert');
        return false;
    }    
    if( !objGrid.length ){
        showDialog('Erro: Grid não existente.','alert');
        return false;
    }
    valueToDivide = parseFloat(valueToDivide.replace(/[.]/g,'').replace(',','.')).toFixed(2);
    
    objGrid.each(function(){
        var elements = $(this).find('tbody tr '+elementSelector);
        var qtdElements = elements.length;
        
        var valueElement = valueToDivide / qtdElements;
            valueElement = valueElement.toFixed(2);
            
        var valueTotal = valueElement * qtdElements;
        var diffValue = valueToDivide - valueTotal;
            diffValue = diffValue.toFixed(2);
            
        var valueX = parseFloat(valueElement) + parseFloat(diffValue);
            valueX = valueX.toFixed(2);
        
//        alert( 'valueToDivide = '+valueToDivide +'\n'+
//               'valueElement  = '+valueElement  +'\n'+
//               'valueTotal    = '+valueTotal    +'\n'+
//               'valueX        = '+valueX    +'\n'+
//               'diffValue     = '+diffValue );
        
        elements.each(function(i,elem){
            if( i == 0){
                $(this).val(valueX).unmaskMoney().maskMoney();
            } else {
                $(this).val(valueElement).unmaskMoney().maskMoney();
            }
        });
        
        recalcularGrid(objGrid,elementSelector,'.total');
    });
}
