<?php
class Base_Form_VForm extends Base_Form
{
	public function __construct($options=null){
		parent::__construct($options);
		$this->addDecorator('HtmlTag',
							array('tag'=>'<div>', 'class'=>'vBox'));
	}

}