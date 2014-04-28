<?php
class Base_View_Helper_BaseFormButton extends Zend_View_Helper_FormButton
{
    /**#@+
     * @var integer
     */
    const TYPE_BLANK  	= 0;
    const TYPE_SAVE   	= 1;
    const TYPE_CANCEL 	= 2;
    const TYPE_NEXT   	= 3;
    const TYPE_ADD    	= 4;
    const TYPE_SEARCH 	= 5;
    const TYPE_DELETE 	= 6;
    const TYPE_MAIL   	= 7;
    const TYPE_FORWARD  = 8;
    const TYPE_BACK     = 9;
    const TYPE_PRINT    = 10;
    const TYPE_EDIT     = 11;
    const TYPE_RESET    = 12;
    /**#@-*/

    /**
     * View helper para a constução dos botões do sistema
     *
     * @example
     *      $this->baseFormButton(
     *          'btnSalvar',
     *          '', //value do input button normalmente é nulo
     *          array(
     *              'buttonType'=>Base_View_Helper_BaseFormButton::TYPE_ADD,
     *              'label' => 'Salvar',
     *              'width' => '100' //opcional
     *          )
     *      );
     * @param string  $name
     * @param integer $type
     * @param array   $attribs
     * @return string
     */
    public function baseFormButton($name, $value = null, $attribs = null)
    {
        if( !isset($attribs['buttonType']) ){
            throw new Base_Exception("buttonType is required.");
        }

        $class = '';
        $label = '';
        $type  = 'button';
        switch ($attribs['buttonType']) {
            case self::TYPE_BLANK:
                $iconType = false;
                break;
            case self::TYPE_SAVE:
                $iconType = 'disk';
                $label    = 'Salvar';
                $class    = 'btnSave';
                break;
            case self::TYPE_CANCEL:
                $iconType = 'cancel';
                $label    = 'Cancelar';
                $class    = 'btnCancel';
            	break;
            case self::TYPE_NEXT:
                $iconType = 'seek-next';
                $label    = 'Próximo';
                $class    = 'btnNext';
            	break;
            case self::TYPE_ADD:
                $iconType = 'plus';
                $label    = 'Adicionar';
                $class    = 'btnAdd';
            	break;
            case self::TYPE_SEARCH:
                $iconType = 'search';
                $label    = 'Pesquisar';
                $class    = 'btnSearch';
            	break;
            case self::TYPE_DELETE:
                $iconType = 'trash';
                $label    = 'Excluir';
                $class    = 'btnDelete';
            	break;
            case self::TYPE_MAIL:
                $iconType = 'mail-closed';
                $label    = 'E-mail';
                $class    = 'btnEmail';
            	break;
            case self::TYPE_FORWARD:
                $iconType = 'arrowreturnthick-1-e';
                $label    = 'Encaminhar';
                $class    = 'btnForward';
            	break;
            case self::TYPE_BACK:
                $iconType = 'seek-prev';
                $label    = 'Voltar';
                $class    = 'btnBack';
            	break;
            case self::TYPE_PRINT:
                $iconType = 'print';
                $label    = 'Imprimir';
                $class    = 'btnPrint';
            	break;
            case self::TYPE_EDIT:
                $iconType = 'pencil';
                $label    = 'Editar';
                $class    = 'btnEdit';
            	break;
            case self::TYPE_RESET:
                $iconType = 'arrowreturnthick-1-w';
                $label    = 'Reiniciar Formulário';
                $type     = 'reset';
            	break;

        	default:
                throw new Base_Exception("Type of base button: <b>{$attribs['buttonType']}</b> invalid.");
            	break;
        }

        $attribs['type'] = $type;

        if( isset($attribs['label']) ){
        	$label = $attribs['label'];
        }

        if( isset($attribs['class']) ){
            $attribs['class'] .= " {$class} ui-state-default ui-corner-all";
        } else {
            $attribs['class']  = " {$class} ui-state-default ui-corner-all";
        }

        if($iconType !== false){
            $attribs['content'] = "<span class=\"ui-icon ui-icon-{$iconType}\"></span>{$label}";
            $attribs['escape']  = false;
        }


        $attribs['style'] = (isset($attribs['style']))?$attribs['style'].';':'';
        if( isset($attribs['width']) ){
            $attribs['width'] = str_ireplace('px','',$attribs['width']);
            $attribs['style'] = "{$attribs['style']} width:{$attribs['width']}px;";
            unset($attribs['width']);
        }

        if( isset($attribs['height']) ){
            $attribs['style']  = "{$attribs['style']} height:{$attribs['height']};";
            unset($attribs['height']);
        }
        $value = '';
        return parent::formButton($name,$value,$attribs);
    }
}