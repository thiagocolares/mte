<?php
class BaseX_JQuery_HForm extends ZendX_JQuery_Form
{
		
	public function __construct($options = null)
	{
		parent::__construct($options);
		$this->addDecorator('HtmlTag',
							array('tag'=>'<div>', 'class'=>'hbox'));	

		$this->addPrefixPath('Base_Form_Decorator',
							 	    'Base/Form/Decorator/',
							 		'decorator');
		$this->addElementPrefixPath('Base_Form_Decorator',
							 	    'Base/Form/Decorator/',
							 		'decorator');
		$this->addDisplayGroupPrefixPath('Base_Form_Decorator',
							 	    'Base/Form/Decorator/',
							 		'decorator');	
	
	}
}