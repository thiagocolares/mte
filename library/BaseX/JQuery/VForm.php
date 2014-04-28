<?php
class BaseX_JQuery_VForm extends ZendX_JQuery_Form
{
	public function __construct($options = null)
	{
		parent::__construct($options);
		$this->addDecorator('HtmlTag',
							array('tag'=>'<div>', 'class'=>'vbox'));		
	}
}