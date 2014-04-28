<?php

class Base_Form_Element_Grid extends Zend_Form_Element_Xhtml
{
    /**
     * Use  view helper by default
     * @var string
     */
    public $helper = 'baseFormGrid';

    public function __construct($spec, $options = null){
        parent::__construct($spec, $options);
        $this->clearDecorators();
        $this->addDecorator('ViewHelper')
             ->addDecorator('Label');
    }  

}
