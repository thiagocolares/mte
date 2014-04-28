<?php
class Base_Form_SubForm extends Base_Form
{
    /**
     * Whether or not form elements are members of an array
     * @var bool
     */
    protected $_isArray = true;
	
    /**
     * Carrega os decorators padroes
     * 
     * @return void
     */
    public function loadDefaultDecorators()
    {
        if ($this->loadDefaultDecoratorsIsDisabled()) {
            return;
        }

        $decorators = $this->getDecorators();
        if (empty($decorators)) {
            $this->addDecorator('FormElements');
//                 ->addDecorator('HtmlTag');
//               ->addDecorator('Fieldset')
        }
    }
}
