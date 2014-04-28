<?php

class Base_Form_Element_Label extends Zend_Form_Element_Xhtml
{
    /**
     * Use formLabel view helper by default
     * @var string
     */
    public $helper = 'baseFormLabel';

    public function __construct($spec, $options = null){

        parent::__construct($spec, $options);
        $this->clearDecorators();
        
    }  

}
