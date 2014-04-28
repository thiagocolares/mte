<?php

class Base_Form_Element_Button extends Zend_Form_Element_Xhtml
{
    
    public $helper = 'baseFormButton';
    
    
    /**
     * Constructor
     * 
     * @param  string|array|Zend_Config $spec Element name or configuration
     * @param  string|array|Zend_Config $options Element value or configuration
     * @return void
     * 
     * @example  $btn = new Base_Form_Element_Button(
     *                          'btnExcluir', 
     *                      );
     *          
     */ 
    public function __construct($spec, $attribs = null){
        parent::__construct($spec, $attribs);
        $this->clearDecorators();
        $this->addDecorator('ViewHelper');
    }
    
    public function setLabel($label)
    {
        $this->setAttrib('label', $label);
        return $this;
    }
    
    public function setButtonType($buttonType)
    {
        $this->setAttrib('buttonType', $buttonType);
        return $this;
    } 
    
    

}
